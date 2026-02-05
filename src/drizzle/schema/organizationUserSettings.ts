import { boolean, integer, pgTable, primaryKey, varchar } from "drizzle-orm/pg-core";
import { UserTable } from "./user";
import { OrganizationTable } from "./organization";
import { createdAt, updatedAt } from "../schemaHelpers";
import { relations } from "drizzle-orm";


export const OrganizationUserSettingsTable = pgTable(
    "organization_user_settings",
    {
        userId: varchar().notNull().references(() => UserTable.id),
        OrganizationTable: varchar().notNull().references(() => OrganizationTable.id),
        newApplicationEmailNotification: boolean().notNull().default(false),
        minimumRating: integer(),
        createdAt,
        updatedAt,
    },
    table => [primaryKey({ columns: [table.userId, table.OrganizationTable] })],
)

export const organizationUserSettingsRelations = relations(
    OrganizationUserSettingsTable,
    ({ one }) => ({
        user: one(UserTable, {
            fields: [OrganizationUserSettingsTable.userId],
            references: [UserTable.id],
        }),
        organization: one(OrganizationTable, {
            fields: [OrganizationUserSettingsTable.userId],
            references: [OrganizationTable.id],
        }),
    }),
)