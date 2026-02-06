"use client"

import Link from "next/link"
import { Eye } from "lucide-react"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Skeleton } from "@/components/ui/skeleton"

type PaymentStatus = "SUCCEEDED" | "PENDING" | "FAILED"

export interface Payment {
  id: string
  amount: number // em centavos (da API)
  currency: string
  status: PaymentStatus
  providerPaymentId: string
  createdAt: string // ISO string da API
  tenant?: { name: string }
}

interface PaymentsTableProps {
  payments: Payment[]
  isLoading: boolean
}

function getStatusBadge(status: PaymentStatus) {
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

function PaymentsTableSkeleton() {
  return (
    <div className="space-y-3">
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="flex items-center gap-4">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-8 w-20" />
        </div>
      ))}
    </div>
  )
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <div className="rounded-full bg-muted p-4 mb-4">
        <Eye className="size-8 text-muted-foreground" />
      </div>
      <h3 className="text-lg font-semibold mb-1">Nenhum pagamento encontrado</h3>
      <p className="text-muted-foreground text-sm mb-4">
        Comece criando seu primeiro pagamento.
      </p>
      <Button asChild>
        <Link href="/payments/new">Criar pagamento</Link>
      </Button>
    </div>
  )
}

export function PaymentsTable({ payments, isLoading }: PaymentsTableProps) {
  const isEmpty = !isLoading && payments.length === 0

  return (
    <Card>
      <CardHeader>
        <CardTitle>Todos os pagamentos</CardTitle>
        <CardDescription>
          Lista completa de pagamentos processados via Stripe
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <PaymentsTableSkeleton />
        ) : isEmpty ? (
          <EmptyState />
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Data</TableHead>
                <TableHead>Valor</TableHead>
                <TableHead>Moeda</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="hidden md:table-cell">Provider ID</TableHead>
                <TableHead className="text-right">Ação</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {payments.map((payment) => (
                <TableRow key={payment.id}>
                  <TableCell className="text-muted-foreground">
                    {new Date(payment.createdAt).toLocaleString("pt-BR")}
                  </TableCell>
                  <TableCell className="font-medium">
                    {formatCurrencyFromCents(payment.amount, payment.currency)}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {payment.currency}
                  </TableCell>
                  <TableCell>{getStatusBadge(payment.status)}</TableCell>
                  <TableCell className="hidden md:table-cell font-mono text-xs text-muted-foreground">
                    {payment.providerPaymentId}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm" asChild>
                      <Link href={`/payments/${payment.id}`}>
                        <Eye className="mr-2 size-4" />
                        Ver detalhes
                      </Link>
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  )
}