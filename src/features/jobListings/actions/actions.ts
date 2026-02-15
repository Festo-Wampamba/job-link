"use server";

import { db } from "@/drizzle/db";
import { JobListingTable } from "@/drizzle/schema";
import { getCurrentOrganization } from "@/services/clerk/lib/getCurrentAuth";
import { hasOrgUserPermission } from "@/services/clerk/lib/orgUserPermissions";
import { and, eq } from "drizzle-orm";
import { updateTag } from "next/cache";
import { cacheTag } from "next/dist/server/use-cache/cache-tag";
import { redirect } from "next/navigation";
import z from "zod";
import {
  getJobListingIdTag,
  getJobListingOrganizationTag,
} from "../db/cache/jobListings";
import {
  insertJobListing,
  updateJobListing as updatedJobListingDb,
  deleteJobListing as deleteJobListingDb,
} from "../db/jobListings";
import { jobListingSchema } from "./schemas";
import { getNextJobListingStatus } from "../lib/utils";
import {
  hasReachedMaxFeaturedJobListings,
  hasReachedMaxPublishedJobListings,
} from "../lib/planfeatureHelpers";

export async function createJobListing(
  unsafeData: z.infer<typeof jobListingSchema>,
) {
  const { orgId } = await getCurrentOrganization();

  // [CHANGE 1]: Split the authentication (orgId) and authorization (permission) checks.
  if (!orgId) {
    return {
      error: true,
      message:
        "Authentication failed: You must be logged into an organization.",
    };
  }

  // [CHANGE 2]: Now provides an exact error for missing permissions.
  if (!(await hasOrgUserPermission("org:job_listings:create"))) {
    return {
      error: true,
      message:
        "Access Denied: You do not have permission to create a job listing.",
    };
  }

  const { success, data } = jobListingSchema.safeParse(unsafeData);

  if (!success) {
    return {
      error: true,
      message: "Validation Error: Invalid job listing data provided.",
    };
  }

  const jobListing = await insertJobListing({
    ...data,
    organizationId: orgId,
    status: "draft",
  });

  redirect(`/employer/job-listings/${jobListing.id}`);
}

export async function updateJobListing(
  id: string,
  unsafeData: z.infer<typeof jobListingSchema>,
) {
  const { orgId } = await getCurrentOrganization();

  // [CHANGE 3]: Split the checks for the update function as well.
  if (!orgId) {
    return {
      error: true,
      message:
        "Authentication failed: You must be logged into an organization.",
    };
  }

  // [CHANGE 4]: Fixed the misleading error message from 'create' to 'update'.
  if (!(await hasOrgUserPermission("org:job_listings:update"))) {
    return {
      error: true,
      message:
        "Access Denied: You do not have permission to update this job listing!",
    };
  }

  const { success, data } = jobListingSchema.safeParse(unsafeData);

  if (!success) {
    return {
      error: true,
      message: "Validation Error: Invalid job listing data provided.",
    };
  }

  // Ensure location is cleared if Remote
  if (data.locationRequirement === "remote") {
    data.city = null;
    data.district = null;
  }

  // [CHANGE 5]: Added the missing 'await' keyword here!
  // Without this, the function wouldn't wait for the database query to finish.
  const jobListing = await getJobListing(id, orgId);

  if (!jobListing) {
    return {
      error: true,
      message:
        "Not Found: This job listing does not exist or belongs to a different organization.",
    };
  }

  const updatedJobListing = await updatedJobListingDb(id, data);
  // [THE FIX]: Clear the Next.js cache so the user sees the fresh data!
  updateTag(getJobListingIdTag(id));

  redirect(`/employer/job-listings/${updatedJobListing.id}`);
}

export async function toggleJobListingStatus(id: string) {
  const error = {
    error: true,
    message:
      "Access Denied: You do not have permission to update this job listing status",
  };
  const { orgId } = await getCurrentOrganization();
  if (!orgId) return error;

  const jobListing = await getJobListing(id, orgId);
  if (!jobListing) {
    return error;
  }

  const newStatus = getNextJobListingStatus(jobListing.status);
  if (
    !(await hasOrgUserPermission("org:job_listings:change_status")) ||
    (newStatus === "published" && (await hasReachedMaxPublishedJobListings()))
  ) {
    return error;
  }

  await updatedJobListingDb(id, {
    status: newStatus,
    isFeatured: newStatus === "published" ? undefined : false,
    postedAt:
      newStatus === "published" && jobListing.postedAt == null
        ? new Date()
        : undefined,
  });

  // 1. Clears the cache for the individual job (so the UI updates)
  updateTag(getJobListingIdTag(id));

  // 2. Clears the cache for the Organization (so the published count resets!)
  updateTag(getJobListingOrganizationTag(orgId));

  // 3. Returns success so the ActionButton doesn't crash!
  return { error: false };
}

export async function toggleJobListingFeatured(id: string) {
  const error = {
    error: true,
    message:
      "Access Denied: You do not have permission to update this job listing's featured'",
  };
  const { orgId } = await getCurrentOrganization();
  if (!orgId) return error;

  const jobListing = await getJobListing(id, orgId);
  if (!jobListing) {
    return error;
  }

  const newFeaturedStatus = !jobListing.isFeatured;
  if (
    !(await hasOrgUserPermission("org:job_listings:change_status")) ||
    (newFeaturedStatus && (await hasReachedMaxFeaturedJobListings()))
  ) {
    return error;
  }

  await updatedJobListingDb(id, {
    isFeatured: newFeaturedStatus,
  });

  // 1. Clears the cache for the individual job (so the UI updates)
  updateTag(getJobListingIdTag(id));

  // 2. Clears the cache for the Organization (so the published count resets!)
  updateTag(getJobListingOrganizationTag(orgId));

  // 3. Returns success so the ActionButton doesn't crash!
  return { error: false };
}

export async function deleteJobListing(id: string) {
  const error = {
    error: true,
    message: "You don't have permission to delete this job listing",
  }
  const { orgId } = await getCurrentOrganization()
  if (orgId == null) return error

  const jobListing = await getJobListing(id, orgId)
  if (jobListing == null) return error

  if (!(await hasOrgUserPermission("org:job_listings:delete"))) {
    return error
  }

  await deleteJobListingDb(id)

  // 1. Check if this organization has any jobs left
  const remainingJobs = await db.query.JobListingTable.findFirst({
    where: eq(JobListingTable.organizationId, orgId),
    columns: { id: true } // We only need the ID to know if one exists!
  })

  // 2. Smart Redirect based on what we found
  if (!remainingJobs) {
    redirect("/employer/job-listings/new")
  }

  redirect("/employer") // Or wherever your main jobs list is!
}


async function getJobListing(id: string, orgId: string) {
  "use cache";
  cacheTag(getJobListingIdTag(id));

  return db.query.JobListingTable.findFirst({
    where: and(
      eq(JobListingTable.id, id),
      eq(JobListingTable.organizationId, orgId),
    ),
  });
}
