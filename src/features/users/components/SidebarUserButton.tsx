import { Suspense } from "react";
import { SidebarUserButtonClient } from "./SidebarUserButtonClient";
import { getCurrentUser } from "@/services/clerk/lib/getCurrentAuth";
import { SignOutButton } from "@/services/clerk/components/AuthButton";
import { SidebarMenuButton } from "@/components/ui/sidebar";

export function SidebarUserButton() {
    return<Suspense>
        <SidebarUserSuspense />
    </Suspense>
}

async function SidebarUserSuspense() {
    const { user } = await getCurrentUser( {allData: true} );

    if (user == null) {
        return (
        <SignOutButton>
            <SidebarMenuButton>
                <span>Sign Out</span>
            </SidebarMenuButton>
        </SignOutButton>);
    }

    return <SidebarUserButtonClient user= {user} />
}