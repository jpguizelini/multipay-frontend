"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Loader2, CheckCircle2, AlertCircle } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

const paymentSchema = z.object({
  amount: z
    .string()
    .min(1, "Valor é obrigatório")
    .refine((val) => !isNaN(parseFloat(val)) && parseFloat(val) > 0, {
      message: "Valor deve ser maior que zero",
    }),
  currency: z.string().min(1, "Moeda é obrigatória"),
  paymentMethod: z.string().min(1, "Método de pagamento é obrigatório"),
})

type PaymentFormData = z.infer<typeof paymentSchema>

const currencies = [
  { value: "BRL", label: "BRL - Real Brasileiro" },
  { value: "USD", label: "USD - Dólar Americano" },
  { value: "EUR", label: "EUR - Euro" },
]

const paymentMethods = [
  { value: "pm_card_visa", label: "Cartão de Crédito (visa teste)" },
]

export function NewPaymentForm() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitResult, setSubmitResult] = useState<{
    type: "success" | "error"
    message: string
  } | null>(null)

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
    reset,
  } = useForm<PaymentFormData>({
    resolver: zodResolver(paymentSchema),
    defaultValues: {
      amount: "",
      currency: "BRL",
      // mantém compatível com o backend atual
      paymentMethod: "pm_card_visa",
    },
  })

  const onSubmit = async (values: PaymentFormData) => {
    setIsSubmitting(true)
    setSubmitResult(null)

    try {
      const amountInCents = Math.round(Number(values.amount) * 100)

      const payload = {
        ...values,
        amount: amountInCents,
      }

      const response = await fetch("http://localhost:3000/payments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })

      if (!response.ok) {
        let errorMessage = "Erro ao criar pagamento"

        try {
          const errorData = await response.json()
          errorMessage =
            (errorData as any).message ||
            (errorData as any).error ||
            errorMessage
        } catch {
          errorMessage = `Erro ${response.status}: ${response.statusText}`
        }

        setSubmitResult({
          type: "error",
          message: errorMessage,
        })
        return
      }

      const data = await response.json()
      // se quiser usar o ID retornado:
      // const paymentId = data.id

      reset()

      setSubmitResult({
        type: "success",
        message: "Pagamento criado com sucesso!",
      })

      // se quiser redirecionar depois de criar:
      // setTimeout(() => {
      //   router.push("/payments")
      // }, 2000)
    } catch (erro) {
      console.error("Erro ao enviar formulário:", erro)

      setSubmitResult({
        type: "error",
        message: "Erro de conexão. Verifique se o servidor está rodando.",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Card className="max-w-lg">
      <CardHeader>
        <CardTitle>Novo pagamento</CardTitle>
        <CardDescription>
          Crie um novo pagamento integrado com Stripe em modo de teste.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {submitResult && (
            <Alert
              variant={submitResult.type === "error" ? "destructive" : "default"}
              className={
                submitResult.type === "success"
                  ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-400"
                  : ""
              }
            >
              {submitResult.type === "success" ? (
                <CheckCircle2 className="size-4" />
              ) : (
                <AlertCircle className="size-4" />
              )}
              <AlertTitle>
                {submitResult.type === "success" ? "Sucesso!" : "Erro"}
              </AlertTitle>
              <AlertDescription>{submitResult.message}</AlertDescription>
            </Alert>
          )}

          <div className="space-y-2">
            <Label htmlFor="amount">Valor</Label>
            <Input
              id="amount"
              type="number"
              step="0.01"
              min="0.01"
              placeholder="0.00"
              {...register("amount")}
              aria-invalid={!!errors.amount}
            />
            {errors.amount && (
              <p className="text-sm text-destructive">{errors.amount.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="currency">Moeda</Label>
            <Select
              defaultValue="BRL"
              onValueChange={(value) => setValue("currency", value)}
            >
              <SelectTrigger id="currency">
                <SelectValue placeholder="Selecione a moeda" />
              </SelectTrigger>
              <SelectContent>
                {currencies.map((currency) => (
                  <SelectItem key={currency.value} value={currency.value}>
                    {currency.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.currency && (
              <p className="text-sm text-destructive">
                {errors.currency.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="paymentMethod">Método de pagamento</Label>
            <Select
              defaultValue="pm_card_visa"
              onValueChange={(value) => setValue("paymentMethod", value)}
            >
              <SelectTrigger id="paymentMethod">
                <SelectValue placeholder="Selecione o método" />
              </SelectTrigger>
              <SelectContent>
                {paymentMethods.map((method) => (
                  <SelectItem key={method.value} value={method.value}>
                    {method.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.paymentMethod && (
              <p className="text-sm text-destructive">
                {errors.paymentMethod.message}
              </p>
            )}
          </div>

          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting && <Loader2 className="mr-2 size-4 animate-spin" />}
            {isSubmitting ? "Criando pagamento..." : "Criar pagamento"}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}