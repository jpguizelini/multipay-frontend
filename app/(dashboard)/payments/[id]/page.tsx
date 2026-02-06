"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { AppHeader } from "@/components/app-header"
import { PaymentDetails } from "@/components/payments/payment-details"
import { Payment } from "@/components/payments/payments-table"

export default function PaymentDetailsPage() {
  const params = useParams()
  const paymentId = params.id as string

  const [payment, setPayment] = useState<Payment | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function loadPayment() {
      if (!paymentId) return

      try {
        const res = await fetch(`http://localhost:3000/payments/${paymentId}`)
        
        if (res.status === 404) {
          setPayment(null)
          setError(null)
          return
        }

        if (!res.ok) {
          throw new Error("Erro ao carregar pagamento")
        }

        const data = await res.json()
        setPayment(data)
        setError(null)
      } catch (err: any) {
        setError(err.message ?? "Erro inesperado")
      } finally {
        setLoading(false)
      }
    }

    loadPayment()
  }, [paymentId])

  return (
    <>
      <AppHeader title="Detalhes do pagamento" showNewPaymentButton={false} />
      <div className="flex flex-1 flex-col gap-6 p-6">
        {error && (
          <div className="text-sm text-destructive">
            Erro: {error}
          </div>
        )}
        <PaymentDetails payment={payment!} isLoading={loading} />
      </div>
    </>
  )
}