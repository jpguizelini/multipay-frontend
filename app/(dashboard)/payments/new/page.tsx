import { AppHeader } from "@/components/app-header"
import { NewPaymentForm } from "@/components/payments/new-payment-form"

export default function NewPaymentPage() {
  return (
    <>
      <AppHeader title="Novo pagamento" showNewPaymentButton={false} />
      <div className="flex flex-1 flex-col gap-6 p-6">
        <NewPaymentForm />
      </div>
    </>
  )
}
