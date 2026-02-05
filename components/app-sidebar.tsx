"use client"

import Link from "next/link"
import { 
    CreditCard, 
    LayoutDashboard,
    PlusCircle,
    Building2,
    KeyRound,
} from "lucide-react";

import { 
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarMenu,
 } from "@/components/ui/sidebar";
import { usePathname } from "next/navigation";

 // Icone e rota do sidebar
 const generalNavItems = [
    {
      label: "Dashboard",
      icon: LayoutDashboard,
      route: "/",
    },
    {
      label: "Pagamentos",
      icon: CreditCard,
      route: "/payments",
    },
    {
      label: "Novo pagamento",
      icon: PlusCircle,
      route: "/payments/new",
    },
  ]

  const configNavItems = [
    {
      label: "Tenants",
      icon: Building2,
      route: "/tenants",
    },
    {
      label: "Chaves de API",
      icon: KeyRound,
      route: "/api-keys",
    },
  ]

export function AppSidebar() {
    const pathname = usePathname()

    return (
        <Sidebar collapsible="icon">
            <SidebarHeader className="border-b border-sidebar-border">
                <Link href="/" className="flex items-center gap-2 px-2 py-3 font-semibold text-lg">
                    <div className="flex size-8 items-center justify-center rounded-md bg-primary text-primary-foreground">
                        <LayoutDashboard />
                    </div>
                    <span className="group-data-[collapsible=icon]:hidden">Multipay</span>
                </Link>
            </SidebarHeader>
            <SidebarContent>
                <SidebarGroup />
                    <SidebarGroupLabel>Geral</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                        {generalNavItems.map((item) => (
                            <SidebarMenuItem key={item.route}>
                                <SidebarMenuButton
                                    asChild
                                    isActive={pathname === item.route}
                                    tooltip={item.label}
                                >
                                <Link href={item.route}>
                                    <item.icon className="size-4" />
                                    <span>{item.label}</span>
                                </Link>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                       ))} 
                        </SidebarMenu>
                    </SidebarGroupContent>
                <SidebarGroup>
                    <SidebarGroupLabel>Configuração</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                        {configNavItems.map((item) => (
                            <SidebarMenuItem key={item.route}>
                            <SidebarMenuButton
                                asChild
                                isActive={pathname === item.route}
                                tooltip={item.label}
                            >
                                <Link href={item.route}>
                                <item.icon className="size-4" />
                                <span>{item.label}</span>
                                </Link>
                            </SidebarMenuButton>
                            </SidebarMenuItem>
                        ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>  
        </Sidebar>
    )
}