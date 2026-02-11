import { AppSidebar } from "@/components/sidebar/AppSidebar";
import { SidebarNavMenuGroup } from "@/components/sidebar/SidebarNavMenuGroup";
import {
  SidebarGroup,
  SidebarGroupAction,
  SidebarGroupLabel
} from "@/components/ui/sidebar";
import { SidebarOrganizationButton } from "@/features/organizations/components/SidebarOrganizationButton";
import { getCurrentOrganization } from "@/services/clerk/lib/getCurrentAuth";
import { ClipboardListIcon, PlusIcon } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { ReactNode, Suspense } from "react";

export default function EmployerLayout({ children }: { children: ReactNode }) {
  return (
    <Suspense>
      <LayoutSuspense>{children}</LayoutSuspense>
    </Suspense>
  )
}

async function LayoutSuspense({ children }: { children: ReactNode }) {
  const { orgId } = await getCurrentOrganization()
  if (orgId == null)  return redirect("/organization/select");


  return (
    <AppSidebar
      content={
        <>
        <SidebarGroup>
          <SidebarGroupLabel>Job Listings</SidebarGroupLabel>
          <SidebarGroupAction title="Add Job Listing" asChild>
            <Link href="/employer/job-listings/new">
              <PlusIcon className="cursor-pointer" /> <span className="sr-only">Add Job Listing</span>
            </Link>
          </SidebarGroupAction>
        </SidebarGroup>
        <SidebarNavMenuGroup
                  className="mt-auto"
                  items={[
                    { href: "/", icon: <ClipboardListIcon />, label: "Job Board" },
                  ]}
                />
                </>
      }
      footerButton={<SidebarOrganizationButton />}
    >
      {children}
    </AppSidebar>
  );
}
