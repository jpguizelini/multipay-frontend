"use client"

import Link from "next/link"
import { ArrowLeft, CreditCard, Calendar, Hash, Globe } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Payment } from "./payments-table"

interface PaymentDetailsProps {
  payment: Payment
  isLoading: boolean
}

function getStatusBadge(status: Payment["status"]) {
  switch (status) {
    case "SUCCEEDED":
      return (
        <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30">
          Sucesso
        </Badge>
      )
    case "PENDING":
      return (
        <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30">
          Pendente
        </Badge>
      )
    case "FAILED":
      return (
        <Badge className="bg-red-500/20 text-red-400 border-red-500/30">
          Falha
        </Badge>
      )
  }
}

function formatCurrencyFromCents(amountInCents: number, currency: string) {
  const amount = amountInCents / 100
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency,
  }).format(amount)
}

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  })
}

function PaymentDetailsSkeleton() {
  return (
    <Card className="max-w-2xl">
      <CardHeader>
        <div className="h-8 w-32 bg-muted animate-pulse rounded" />
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid gap-4 sm:grid-cols-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-16 bg-muted animate-pulse rounded" />
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

export function PaymentDetails({ payment, isLoading }: PaymentDetailsProps) {
  if (isLoading) {
    return (
      <div className="space-y-6 max-w-2xl">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/payments">
            <ArrowLeft className="mr-2 size-4" />
            Voltar para lista
          </Link>
        </Button>
        <PaymentDetailsSkeleton />
      </div>
    )
  }

  if (!payment) {
    return (
      <div className="space-y-6 max-w-2xl">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/payments">
            <ArrowLeft className="mr-2 size-4" />
            Voltar para lista
          </Link>
        </Button>
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12 text-center">
            <h3 className="text-lg font-semibold mb-2">Pagamento não encontrado</h3>
            <p className="text-muted-foreground text-sm mb-4">
              O pagamento solicitado não existe ou foi removido.
            </p>
            <Button asChild>
              <Link href="/payments">
                <ArrowLeft className="mr-2 size-4" />
                Voltar para lista
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6 max-w-2xl">
      <Button variant="ghost" size="sm" asChild>
        <Link href="/payments">
          <ArrowLeft className="mr-2 size-4" />
          Voltar para lista
        </Link>
      </Button>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl">
                {formatCurrencyFromCents(payment.amount, payment.currency)}
              </CardTitle>
              <CardDescription>ID: {payment.id}</CardDescription>
            </div>
            {getStatusBadge(payment.status)}
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="flex items-center gap-3">
              <div className="flex size-10 items-center justify-center rounded-md bg-muted">
                <Calendar className="size-5 text-muted-foreground" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Data</p>
                <p className="font-medium">{formatDate(payment.createdAt)}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex size-10 items-center justify-center rounded-md bg-muted">
                <Globe className="size-5 text-muted-foreground" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Moeda</p>
                <p className="font-medium">{payment.currency}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex size-10 items-center justify-center rounded-md bg-muted">
                <Hash className="size-5 text-muted-foreground" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Status</p>
                <p className="font-medium capitalize">
                  {payment.status === "SUCCEEDED"
                    ? "Sucesso"
                    : payment.status === "PENDING"
                    ? "Pendente"
                    : "Falha"}
                </p>
              </div>
            </div>
            {payment.tenant && (
              <div className="flex items-center gap-3">
                <div className="flex size-10 items-center justify-center rounded-md bg-muted">
                  <CreditCard className="size-5 text-muted-foreground" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Tenant</p>
                  <p className="font-medium">{payment.tenant.name}</p>
                </div>
              </div>
            )}
          </div>

          <Separator />

          <div>
            <h3 className="font-semibold mb-4">Detalhes Stripe</h3>
            <div className="rounded-md bg-muted/50 p-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Provider Payment ID</span>
                <code className="font-mono text-sm bg-background px-2 py-1 rounded">
                  {payment.providerPaymentId}
                </code>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Status no Stripe</span>
                <span className="text-sm font-medium">
                  {payment.status === "SUCCEEDED"
                    ? "succeeded"
                    : payment.status === "PENDING"
                    ? "pending"
                    : "failed"}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Ambiente</span>
                <Badge variant="outline" className="text-yellow-500 border-yellow-500/30">
                  Test Mode
                </Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}