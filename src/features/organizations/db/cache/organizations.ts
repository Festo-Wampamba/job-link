import { getGlobalTag, getIdTag } from "@/services/clerk/lib/dataCache";
import { revalidateTag } from "next/cache";

export function getOrganizationGlobalTag(): string {
    return getGlobalTag("organizations") 
}

export function getOrganizationIdTag(id: string): string {
    return getIdTag("organizations", id) 
}

export function revalidateOrganizationCache(id: string): void {
    revalidateTag( getOrganizationGlobalTag(), 'max' );
    revalidateTag( getOrganizationIdTag(id), 'max' );
}
