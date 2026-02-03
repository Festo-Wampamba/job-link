import { inngest } from "@/services/inngest/client";
import { clerkCreateOrganization, clerkCreateUser, clerkDeleteUser, clerkUpdateUser } from "@/services/inngest/functions/clerk";
import { serve } from "inngest/next";

// Create an API that serves zero functions
export const { GET, POST, PUT } = serve({
  client: inngest,
  functions: [ clerkCreateUser, clerkUpdateUser, clerkDeleteUser, clerkCreateOrganization ],
});