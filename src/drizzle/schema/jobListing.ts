import { boolean, index, integer, pgEnum, pgTable, text, timestamp, varchar } from "drizzle-orm/pg-core";
import { createdAt, id, updatedAt } from "../schemaHelpers";
import { OrganizationTable } from "./organization";
import { relations } from "drizzle-orm";
import { JobListingApplicationTable } from "./jobListingApplication";

export const wageIntervals = ["daily", "monthly", "yearly"] as const 
export type WageInterval = (typeof wageIntervals)[number]
export const wageIntervalEnum = pgEnum("job_listings_wage_interval", wageIntervals)

export const locationRequirements = ["in-office", "hybrid", "remote"] as const 
export type LocationRequirement = (typeof locationRequirements)[number]
export const locationRequirementEnum = pgEnum("job_listings_location_requirement", locationRequirements)

export const experienceLevels = ["junior", "mid-level", "senior"] as const 
export type ExperienceLevel = (typeof experienceLevels)[number]
export const experienceLevelEnum = pgEnum("job_listings_experience_level", experienceLevels)

export const jobListingStatuses = ["draft", "published", "delisted"] as const 
export type JobListingStatus = (typeof jobListingStatuses)[number]
export const jobListingStatusEnum = pgEnum("job_listings_status", jobListingStatuses)

export const jobListingTypes = ["internship", "part-time", "full-time", "contract"] as const 
export type JobListingType = (typeof jobListingTypes)[number]
export const jobListingTypeEnum = pgEnum("job_listings_type", jobListingTypes)

export const JobListingTable = pgTable("job_listings", {
    id,
    organizationId: varchar().references(() => OrganizationTable.id, { onDelete: "cascade" }).notNull(),
    title: varchar().notNull(),
    description: text().notNull(),
    wage: integer(),
    wageInterval: wageIntervalEnum(),
    region: varchar(),
    district: varchar(),
    isFeatured: boolean().notNull().default(false),
    locationRequirement: locationRequirementEnum().notNull(),
    experienceLevel: experienceLevelEnum().notNull(),
    status: jobListingStatusEnum().notNull().default("draft"),
    type: jobListingTypeEnum().notNull(),
    postedAt: timestamp({ withTimezone: true }),
    createdAt,
    updatedAt,
},
table => [index().on(table.district)]
)

export const jobListingReferences = relations(JobListingTable, ({ one, many }) => ({ 
    organization: one(OrganizationTable, {
        fields: [JobListingTable.organizationId], references: [OrganizationTable.id]
    }),
    applications: many(JobListingApplicationTable)
}))