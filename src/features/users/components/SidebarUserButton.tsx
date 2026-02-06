import { auth } from "@clerk/nextjs/server";
import { Suspense } from "react";
import { SidebarUserButtonClient } from "./_SideBarUserButtonClient";

export function SidebarUserButton() {
    return <Suspense>
        <SidebarUserSuspense />
    </Suspense>
}

async function SidebarUserSuspense() {
    const { userId } = await auth()

    return <SidebarUserButtonClient user = {{ email: "festotech@test.com", name: "Festo Tech", imageUrl: "" }} />
}