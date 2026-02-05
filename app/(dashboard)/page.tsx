import { AppHeader } from "@/components/app-header"
import { StripeStatus } from "@/components/dashboard/stripe-status"

export default function DashboardPage() {
    return (
        <>
            <AppHeader title="Dashboard" />
            <StripeStatus />
        
        </>
        
    )
}