import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { JobListingItems } from "../../_shared/JobListingItems";
import { IsBreakpoint } from "@/components/IsBreakpoint";
import { Suspense } from "react";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { ClientSheet } from "./_ClientSheet";
import { cacheTag } from "next/dist/server/use-cache/cache-tag";
import { getJobListingIdTag } from "@/features/jobListings/db/cache/jobListings";
import { and, eq } from "drizzle-orm";
import { db } from "@/drizzle/db";
import { JobListingApplicationTable, JobListingTable, UserResumeTable } from "@/drizzle/schema";
import { getOrganizationIdTag } from "@/features/organizations/db/cache/organization";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { XIcon } from "lucide-react";
import { convertSearchParamsToString } from "@/lib/convertSearchParamsToString";
import { JobListingBadges } from "@/features/jobListings/components/JobListingBadges";
import { MarkdownRenderer } from "@/components/markdown/MarkdownRenderer";
import { getCurrentUser } from "@/services/clerk/lib/getCurrentAuth";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { SignUpButton } from "@/services/clerk/components/AuthButton";
import { getJobListingApplicationIdTag } from "@/features/jobListingApplications/db/cache/jobListingApplications";
import { connection } from "next/server";
import { differenceInDays } from "date-fns/differenceInDays";
import { getUserResumeIdTag } from "@/features/users/db/cache/userResumes";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { NewJobListingApplicationForm } from "@/features/jobListingApplications/components/NewJobListingApplicationForm";


export default function JobListingPage({
  params,
  searchParams,
}: {
  params: Promise<{ jobListingId: string }>;
  searchParams: Promise<Record<string, string | string[]>>;
}) {
  return (
    <>
      {/* @ts-expect-error: shadcn/ui types omit autoSaveId, but the underlying library supports it perfectly */}
      <ResizablePanelGroup autoSaveId="job-board-panel" direction="horizontal">
        {/* Removed 'id' and 'order' - it naturally becomes Panel 1 */}
        <ResizablePanel defaultSize={60} minSize={30}>
          <div className="p-4 h-screen overflow-y-auto">
            <JobListingItems searchParams={searchParams} params={params} />
          </div>
        </ResizablePanel>

        <IsBreakpoint
          breakpoint="(min-width: 1024px)"
          otherwise={
            <ClientSheet>
              <SheetContent hideCloseButton className="p-4">
                <SheetHeader className="sr-only">
                  <SheetTitle>Job Listing Details</SheetTitle>
                </SheetHeader>
                <Suspense fallback={<LoadingSpinner />}>
                  <JobListingDetails
                    searchParams={searchParams}
                    params={params}
                  />
                </Suspense>
              </SheetContent>
            </ClientSheet>
          }
        >
          {/* We wrap the Handle and the Right Panel in a React Fragment! */}
          <>
            <ResizableHandle withHandle className="mx-2" />

            <ResizablePanel defaultSize={40} minSize={30}>
              <div className="p-4 h-screen overflow-y-auto">
                <Suspense fallback={<LoadingSpinner />}>
                  <JobListingDetails
                    params={params}
                    searchParams={searchParams}
                  />
                </Suspense>
              </div>
            </ResizablePanel>
          </>
        </IsBreakpoint>
      </ResizablePanelGroup>
    </>
  );
}

async function JobListingDetails({
  params,
  searchParams,
}: {
  params: Promise<{ jobListingId: string }>;
  searchParams: Promise<Record<string, string | string[]>>;
}) {
  const { jobListingId } = await params;
  const resolvedSearchParams = await searchParams; // Safely await this at the top!

  const jobListing = await getJobListing(jobListingId);
  if (jobListing == null) return notFound();

  const nameInitials = jobListing.organization.name
    .split(" ")
    .splice(0, 4)
    .map((word) => word[0])
    .join("");

  return (
    <div className="space-y-6 @container">
      <div className="space-y-4">
        <div className="flex gap-4 items-start">
          <Avatar className="size-14 @max-md:hidden">
            <AvatarImage
              src={jobListing.organization.imageUrl ?? undefined}
              alt={jobListing.organization.name}
            />
            <AvatarFallback className="uppercase bg-primary text-primary-foreground">
              {nameInitials}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col gap-1">
            <h1 className="text-2xl font-bold tracking-tight">
              {jobListing.title}
            </h1>
            <div className="text-base text-muted-foreground">
              {jobListing.organization.name}
            </div>
            {jobListing.postedAt != null && (
              <div className="text-sm text-muted-foreground @min-lg:hidden">
                {jobListing.postedAt.toLocaleDateString()}
              </div>
            )}
          </div>
          <div className="ml-auto flex items-center gap-4">
            {jobListing.postedAt != null && (
              <div className="text-sm text-muted-foreground @max-lg:hidden">
                {jobListing.postedAt.toLocaleDateString()}
              </div>
            )}
            <Button size="icon" variant="outline" asChild>
              <Link
                href={`/?${convertSearchParamsToString(resolvedSearchParams)}`}
              >
                <span className="sr-only">Close</span>
                <XIcon />
              </Link>
            </Button>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 mt-2">
        <JobListingBadges jobListing={jobListing} />
      </div>

      <Suspense fallback={<Button disabled>Apply</Button>}>
      <ApplyButton jobListingId={jobListing.id} />
      </Suspense>


      <MarkdownRenderer source={jobListing.description} />
    </div>
  );
}


async function ApplyButton({ jobListingId }: { jobListingId: string }) {
  const { userId } = await getCurrentUser()
  if (userId == null) {
    return (
      <Popover>
        <PopoverTrigger asChild>
          <Button>Apply</Button>
        </PopoverTrigger>
        <PopoverContent className="flex flex-col gap-2">
          You need to create an account before applying for a job.
          <SignUpButton />
        </PopoverContent>
      </Popover>
    )
  }

  const application = await getJobListingApplication({
    jobListingId, userId
  })

    if (application != null) {
    const formatter = new Intl.RelativeTimeFormat(undefined, {
      style: "short",
      numeric: "always",
    })

    await connection()
    const difference = differenceInDays(application.createdAt, new Date())

    return (
      <div className="text-muted-foreground text-sm">
        You applied for this job{" "}
        {difference === 0 ? "today" : formatter.format(difference, "days")}
      </div>
    )
  }

  const userResume = await getUserResume(userId)
  if (userResume == null) {
    return (
      <Popover>
        <PopoverTrigger asChild>
          <Button>Apply</Button>
        </PopoverTrigger>
        <PopoverContent className="flex flex-col gap-2">
          You need to create an account before applying for a job.
          <Button asChild>
            <Link href="/user-settings/resume">Upload Resume</Link>
          </Button>
        </PopoverContent>
      </Popover>
    )
  }

    return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Apply</Button>
      </DialogTrigger>
      <DialogContent className="md:max-w-3xl max-h-[calc(100%-2rem)]
      overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle>Application</DialogTitle>
          <DialogDescription>
            Applying for a job cannot be undone and is something you can only do
            once per job listing.
          </DialogDescription>
        </DialogHeader>
        <div className="flex-1 overflow-y-auto">
          <NewJobListingApplicationForm jobListingId={jobListingId} />
        </div>
      </DialogContent>
    </Dialog>
  )

}


async function getUserResume(userId: string) {
  "use cache"
  cacheTag(getUserResumeIdTag(userId))

  return db.query.UserResumeTable.findFirst({
    where: eq(UserResumeTable.userId, userId),
  })
}


async function getJobListingApplication({
  jobListingId,
  userId,
}: {
  jobListingId: string
  userId: string
}) {
  "use cache"
  cacheTag(getJobListingApplicationIdTag({ jobListingId, userId }))

  return db.query.JobListingApplicationTable.findFirst({
    where: and(
      eq(JobListingApplicationTable.jobListingId, jobListingId),
      eq(JobListingApplicationTable.userId, userId)
    ),
  })
}



async function getJobListing(id: string) {
  "use cache";
  cacheTag(getJobListingIdTag(id));

  const listing = await db.query.JobListingTable.findFirst({
    where: and(
      eq(JobListingTable.id, id),
      eq(JobListingTable.status, "published"),
    ),
    with: {
      organization: {
        columns: {
          id: true,
          name: true,
          imageUrl: true,
        },
      },
    },
  });

  if (listing != null) {
    cacheTag(getOrganizationIdTag(listing.organization.id));
  }

  return listing;
}
