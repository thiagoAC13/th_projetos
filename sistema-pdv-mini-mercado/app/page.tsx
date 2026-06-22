'use client'

import { useState } from 'react'
import { PDVProvider, usePDV } from '@/lib/pdv-context'
import { POSTerminal } from '@/components/pdv/pos-terminal'
import { ProductManagement } from '@/components/pdv/product-management'
import { CashManagement } from '@/components/pdv/cash-management'
import { Reports } from '@/components/pdv/reports'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  ShoppingCart,
  Package,
  Wallet,
  BarChart3,
  AlertTriangle,
  Store,
} from 'lucide-react'
import { cn } from '@/lib/utils'

type Tab = 'pdv' | 'products' | 'cash' | 'reports'

function PDVApp() {
  const [activeTab, setActiveTab] = useState<Tab>('pdv')
  const { lowStockProducts, currentShift, isLoading } = usePDV()

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center space-y-4">
          <Store className="h-12 w-12 mx-auto text-primary animate-pulse" />
          <p className="text-lg text-muted-foreground">Carregando sistema...</p>
        </div>
      </div>
    )
  }

  const tabs = [
    {
      id: 'pdv' as const,
      label: 'Caixa',
      icon: ShoppingCart,
      badge: currentShift ? undefined : 'Fechado',
      badgeVariant: 'destructive' as const,
    },
    {
      id: 'products' as const,
      label: 'Produtos',
      icon: Package,
      badge: lowStockProducts.length > 0 ? lowStockProducts.length.toString() : undefined,
      badgeVariant: 'destructive' as const,
    },
    {
      id: 'cash' as const,
      label: 'Gestão',
      icon: Wallet,
    },
    {
      id: 'reports' as const,
      label: 'Relatórios',
      icon: BarChart3,
    },
  ]

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Header */}
      <header className="border-b bg-card sticky top-0 z-40">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Store className="h-8 w-8 text-primary" />
              <div>
                <h1 className="font-bold text-lg">Mini Mercado PDV</h1>
                <p className="text-xs text-muted-foreground">Sistema de Vendas</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {currentShift ? (
                <Badge variant="outline" className="border-success text-success">
                  Caixa Aberto
                </Badge>
              ) : (
                <Badge variant="destructive">Caixa Fechado</Badge>
              )}
              {lowStockProducts.length > 0 && (
                <Badge variant="destructive" className="flex items-center gap-1">
                  <AlertTriangle className="h-3 w-3" />
                  {lowStockProducts.length} em falta
                </Badge>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="border-b bg-card/50 sticky top-[65px] z-30">
        <div className="container mx-auto px-4">
          <div className="flex gap-1 overflow-x-auto py-2">
            {tabs.map((tab) => (
              <Button
                key={tab.id}
                variant={activeTab === tab.id ? 'default' : 'ghost'}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  'flex items-center gap-2 whitespace-nowrap',
                  activeTab === tab.id && 'shadow-sm'
                )}
              >
                <tab.icon className="h-4 w-4" />
                <span className="hidden sm:inline">{tab.label}</span>
                {tab.badge && (
                  <Badge
                    variant={tab.badgeVariant}
                    className="ml-1 h-5 min-w-5 flex items-center justify-center text-xs"
                  >
                    {tab.badge}
                  </Badge>
                )}
              </Button>
            ))}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-1 container mx-auto px-4 py-4">
        {activeTab === 'pdv' && <POSTerminal />}
        {activeTab === 'products' && <ProductManagement />}
        {activeTab === 'cash' && <CashManagement />}
        {activeTab === 'reports' && <Reports />}
      </main>

      {/* Footer */}
      <footer className="border-t bg-card/50 py-2">
        <div className="container mx-auto px-4 text-center text-xs text-muted-foreground">
          Mini Mercado PDV - Sistema de Ponto de Venda
        </div>
      </footer>
    </div>
  )
}

export default function Home() {
  return (
    <PDVProvider>
      <PDVApp />
    </PDVProvider>
  )
}
