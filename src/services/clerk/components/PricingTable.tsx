import { PricingTable as ClerkPricingTable } from "@clerk/nextjs"

export function PricingTable() {
    return (
        <ClerkPricingTable 
            for="organization" 
            newSubscriptionRedirectUrl="/employer/pricing" 
        />
    )
}