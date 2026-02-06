// page.tsx
"use client"

import { useEffect, useState } from "react"
import { AppHeader } from "@/components/app-header"
import { PaymentsTable, Payment } from "@/components/payments/payments-table"

export default function PaymentsPage() {
  const [payments, setPayments] = useState<Payment[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function loadPayments() {
      try {
        const res = await fetch("http://localhost:3000/payments")
        if (!res.ok) throw new Error("Erro ao carregar pagamentos")
        const data = await res.json()
        setPayments(data)
        setError(null)
      } catch (err: any) {
        setError(err.message ?? "Erro inesperado")
      } finally {
        setLoading(false)
      }
    }

    loadPayments()
  }, [])

  return (
    <>
      <AppHeader title="Pagamentos" />
      <div className="flex flex-1 flex-col gap-6 p-6">
        {error && (
          <div className="text-sm text-destructive">
            Erro: {error}
          </div>
        )}
        <PaymentsTable payments={payments} isLoading={loading} />
      </div>
    </>
  )
}