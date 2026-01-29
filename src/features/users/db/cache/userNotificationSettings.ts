import { getGlobalTag, getIdTag } from "@/services/clerk/lib/dataCache";
import { revalidateTag } from "next/cache";

export function getUserUserNotificationSettingsGlobalTag(): string {
    return getGlobalTag("userNotificationSettings") 
}

export function getUserNotificationSettingsIdTag(userId: string): string {
    return getIdTag("userNotificationSettings", userId) 
}

export function revalidateUserNotificationSettingsCache(userId: string): void {
    revalidateTag( getUserUserNotificationSettingsGlobalTag(), 'max' );
    revalidateTag( getUserNotificationSettingsIdTag(userId), 'max' );
}