"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"

const paymentFormSchema = z.object({
    amount: z.string().min(1, "Valor é obrigatório"),
    currency: z.enum(["BRL", "USD", "EUR"]),
    paymentMethod: z.string().min(1, "Payment method é obrigatório"),
})

type PaymentFormValues = z.infer<typeof paymentFormSchema>

// forms com validacao por schema
export default function NewPayment() {
    const form = useForm<PaymentFormValues>({
        resolver: zodResolver(paymentFormSchema),
        defaultValues: {
            amount: "",
            currency: "BRL",
            paymentMethod: "pm_card_visa"
        },
    })

    const { handleSubmit, control, formState: { isSubmitting } } = form

    async function onSubmit(values: PaymentFormValues) {
            try {
                const amountInCents = Math.round(Number(values.amount) * 100)
                
                const payload = {
                    ...values,
                    amount: amountInCents,
                }

                const response = await fetch("http://localhost:3000/payments", {
                    method: "Post",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(payload),
                })

                if (!response.ok) {
                    let errorMessage = "Erro ao criar pagamento"
                    try {
                        const errorData = await response.json()
                        errorMessage = errorData.message || errorData.error || errorMessage
                    } catch {
                        errorMessage = `Erro ${response.status}: ${response.statusText}`
                    }

                    // substituir pelo toast quando tiver
                    alert(errorMessage)
                    return
                }

                const data = await response.json();

                form.reset();

                alert("Pagamento criado com sucesso!");
            
            } catch (erro) {
                console.error("Erro ao enviar formulário:", erro)

                alert("Erro de conexão. Verifique se o servidor está rodando")
            }         
    }

    return (
        <div className="min-h-screen bg-slate-950 text-slate-50">
            <main className="max-w-3xl mx-auto px-6 py-10"> 
                <h1>New Payment</h1>
                <Card>
                    <CardHeader>
                        <CardTitle>Fazer novo pagamento</CardTitle>
                        <CardDescription>
                        Pagamento realizado via Stripe
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                                <FormField
                                control={form.control}
                                name="amount"
                                render={({ field }) => (
                                    <FormItem>
                                    <FormLabel>Valor</FormLabel>
                                    <FormControl>
                                        <Input 
                                        type="number" 
                                        placeholder="0.00" 
                                        step="0.01"
                                        {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                    </FormItem>
                                )}
                                />
                                <FormField
                                control={form.control}
                                name="currency"
                                render={({ field }) => (
                                    <FormItem>
                                    <FormLabel>Moeda</FormLabel>
                                    <FormControl>
                                        <Input 
                                        type="text" 
                                        placeholder="BRL" 
                                        {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                    </FormItem>
                                )}
                                />
                                <FormField
                                control={form.control}
                                name="paymentMethod"
                                render={({ field }) => (
                                    <FormItem>
                                    <FormLabel>Metodo de Pagamento</FormLabel>
                                    <FormControl>
                                        <Input 
                                        type="text" 
                                        placeholder="Metodo do pagamento" 
                                        {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                    </FormItem>
                                )}
                                />
                                <div className="flex justify-end pt-4">
                                <Button type="submit" disabled={isSubmitting}>
                                    {isSubmitting ? "Criando...": "Criar pagamento"}
                                </Button>
                                </div>
                            </form>
                        </Form>
                    </CardContent>
                </Card>
            </main>

        </div>
    )
}