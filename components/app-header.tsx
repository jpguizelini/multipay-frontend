"use client"

import Link from "next/link"
import { PlusCircle } from "lucide-react"

import { Button } from "@/components/ui/button"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"

interface AppHeaderProps {
  title: string
  showNewPaymentButton?: boolean
}

export function AppHeader({ title, showNewPaymentButton = true }: AppHeaderProps) {
  return (
    <header className="sticky top-0 z-10 flex h-14 items-center justify-between border-b border-border bg-background px-4">
      <div className="flex items-center gap-3">
        <SidebarTrigger />
        <Separator orientation="vertical" className="h-6" />
        <h1 className="text-lg font-semibold">{title}</h1>
      </div>
      {showNewPaymentButton && (
        <Button asChild size="sm">
          <Link href="/payments/new">
            <PlusCircle className="mr-2 size-4" />
            Novo pagamento
          </Link>
        </Button>
      )}
    </header>
  )
}
