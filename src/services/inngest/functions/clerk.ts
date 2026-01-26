import { inngest } from "../client";
import { Webhook } from "svix"

function verifyWebhook({ raw, headers }: {
    raw: string,
    headers: Record<string, string>
}) {
    return new Webhook("env.CLERK_WEBHOOK_SECRET").verify(raw, headers)
}

export const clerkCreateUser = inngest.createFunction(
    { id: "clerk/create-db-user", name: "Clerk - Create DB User" },
    {
        event: "clerk/user.created",
    },
    async ({ event, step }) => {
        await step.run("Verify Webhook", async() => {
        verifyWebhook(event.data)
    })
}
)