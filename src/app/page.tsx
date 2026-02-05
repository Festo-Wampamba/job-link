import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { AppSidebarClient } from "./_AppSidebarClient";
import Link from "next/link";
import { LogInIcon } from "lucide-react";
import { SignedIn, SignedOut } from "@clerk/nextjs";
import { Suspense } from "react";

export default function HomePage() {
  return (
    <SidebarProvider className="overflow-y-hidden">
      <AppSidebarClient>
        <Sidebar collapsible="icon" className="overflow-hidden">
          <SidebarHeader className="flex-row">
            <SidebarTrigger />
            <span className="text-xl text-nowrap">KORE Jobs</span>
          </SidebarHeader>
          <SidebarContent>
            <SidebarGroup>
              <SidebarMenu>
                <Suspense>
                  <SignedOut>
                    <SidebarMenuItem>
                      <SidebarMenuButton asChild>
                        <Link href="/sign-in">
                          <LogInIcon />
                          <span> Sign In</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  </SignedOut>
                </Suspense>
              </SidebarMenu>
            </SidebarGroup>
          </SidebarContent>
          <SidebarFooter></SidebarFooter>
        </Sidebar>
        <main className="flex-1">Home Page</main>
      </AppSidebarClient>
    </SidebarProvider>
  );
}
