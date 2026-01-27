import { Sidebar, SidebarContent, SidebarFooter, SidebarGroup, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebarClient } from "./_AppSiderbarClient";
import Link from "next/dist/client/link";
import { LogInIcon } from "lucide-react";
import { SignedOut } from "@clerk/nextjs";
import { Suspense } from "react";
import { SidebarUserButton } from "@/features/users/components/SidebarUserButton";
import { SignedIn } from "@/services/clerk/components/SignInStatus";

export default function HomePage() {
  return <SidebarProvider className="overflow-y-hidden">
    <AppSidebarClient>
    <Sidebar collapsible="icon" className="overflow-hidden">
      <SidebarHeader className="flex-row">
        <SidebarTrigger />
        <span className="text-xl text-nowrap"> KORE </span>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarMenu>
            <SignedOut>
            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <Link href="/sign-in">
                  <LogInIcon />
                  <span>Sign In</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            </SignedOut>
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      <SignedIn>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarUserButton />
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
      </SignedIn>
    </Sidebar>
    <main className="flex-1">Home Page</main>
    </AppSidebarClient>
  </SidebarProvider>;
}