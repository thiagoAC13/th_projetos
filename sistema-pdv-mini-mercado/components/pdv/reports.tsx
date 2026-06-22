'use client'

import { useState, useMemo } from 'react'
import { usePDV } from '@/lib/pdv-context'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  TrendingUp,
  TrendingDown,
  ShoppingCart,
  Package,
  Banknote,
  Calendar,
  ArrowUp,
  ArrowDown,
} from 'lucide-react'
import { format, startOfDay, endOfDay, subDays, startOfMonth, endOfMonth, isWithinInterval } from 'date-fns'
import { ptBR } from 'date-fns/locale'

type Period = 'today' | 'week' | 'month' | 'all'

export function Reports() {
  const { sales, products } = usePDV()
  const [period, setPeriod] = useState<Period>('today')

  // Filter sales by period
  const filteredSales = useMemo(() => {
    const now = new Date()
    let start: Date
    let end: Date = endOfDay(now)

    switch (period) {
      case 'today':
        start = startOfDay(now)
        break
      case 'week':
        start = startOfDay(subDays(now, 7))
        break
      case 'month':
        start = startOfMonth(now)
        end = endOfMonth(now)
        break
      case 'all':
      default:
        return sales
    }

    return sales.filter((sale) =>
      isWithinInterval(new Date(sale.createdAt), { start, end })
    )
  }, [sales, period])

  // Calculate stats
  const stats = useMemo(() => {
    const totalRevenue = filteredSales.reduce((sum, sale) => sum + sale.total, 0)
    const totalCost = filteredSales.reduce(
      (sum, sale) =>
        sum + sale.items.reduce((itemSum, item) => itemSum + item.costPrice * item.quantity, 0),
      0
    )
    const grossProfit = totalRevenue - totalCost
    const profitMargin = totalRevenue > 0 ? (grossProfit / totalRevenue) * 100 : 0

    const totalItems = filteredSales.reduce(
      (sum, sale) => sum + sale.items.reduce((itemSum, item) => itemSum + item.quantity, 0),
      0
    )

    const cashTotal = filteredSales
      .filter((s) => s.paymentMethod === 'dinheiro')
      .reduce((sum, s) => sum + s.total, 0)
    const cardTotal = filteredSales
      .filter((s) => s.paymentMethod === 'cartao')
      .reduce((sum, s) => sum + s.total, 0)
    const pixTotal = filteredSales
      .filter((s) => s.paymentMethod === 'pix')
      .reduce((sum, s) => sum + s.total, 0)

    return {
      totalRevenue,
      totalCost,
      grossProfit,
      profitMargin,
      totalSales: filteredSales.length,
      totalItems,
      averageTicket: filteredSales.length > 0 ? totalRevenue / filteredSales.length : 0,
      cashTotal,
      cardTotal,
      pixTotal,
    }
  }, [filteredSales])

  // Top selling products
  const topProducts = useMemo(() => {
    const productSales: Record<string, { name: string; quantity: number; revenue: number }> = {}

    filteredSales.forEach((sale) => {
      sale.items.forEach((item) => {
        if (!productSales[item.productId]) {
          productSales[item.productId] = {
            name: item.productName,
            quantity: 0,
            revenue: 0,
          }
        }
        productSales[item.productId].quantity += item.quantity
        productSales[item.productId].revenue += item.total
      })
    })

    return Object.values(productSales)
      .sort((a, b) => b.quantity - a.quantity)
      .slice(0, 10)
  }, [filteredSales])

  // Sales by hour (for today)
  const salesByHour = useMemo(() => {
    if (period !== 'today') return []

    const hourly: Record<number, number> = {}
    filteredSales.forEach((sale) => {
      const hour = new Date(sale.createdAt).getHours()
      hourly[hour] = (hourly[hour] || 0) + sale.total
    })

    return Object.entries(hourly)
      .map(([hour, total]) => ({
        hour: parseInt(hour),
        total,
      }))
      .sort((a, b) => a.hour - b.hour)
  }, [filteredSales, period])

  const periodLabel = {
    today: 'Hoje',
    week: 'Últimos 7 dias',
    month: 'Este mês',
    all: 'Todo o período',
  }

  return (
    <div className="space-y-4">
      {/* Period Selector */}
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold flex items-center gap-2">
          <Calendar className="h-5 w-5" />
          Relatórios - {periodLabel[period]}
        </h2>
        <Select value={period} onValueChange={(v) => setPeriod(v as Period)}>
          <SelectTrigger className="w-40">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="today">Hoje</SelectItem>
            <SelectItem value="week">7 dias</SelectItem>
            <SelectItem value="month">Este mês</SelectItem>
            <SelectItem value="all">Tudo</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Key Metrics */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Receita Total</p>
                <p className="text-2xl font-bold">R$ {stats.totalRevenue.toFixed(2)}</p>
              </div>
              <div className="p-3 rounded-full bg-primary/10">
                <TrendingUp className="h-6 w-6 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Lucro Bruto</p>
                <p className="text-2xl font-bold text-success">R$ {stats.grossProfit.toFixed(2)}</p>
                <p className="text-xs text-muted-foreground">
                  Margem: {stats.profitMargin.toFixed(1)}%
                </p>
              </div>
              <div className="p-3 rounded-full bg-success/10">
                <Banknote className="h-6 w-6 text-success" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Vendas</p>
                <p className="text-2xl font-bold">{stats.totalSales}</p>
                <p className="text-xs text-muted-foreground">{stats.totalItems} itens</p>
              </div>
              <div className="p-3 rounded-full bg-blue-500/10">
                <ShoppingCart className="h-6 w-6 text-blue-500" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Ticket Médio</p>
                <p className="text-2xl font-bold">R$ {stats.averageTicket.toFixed(2)}</p>
              </div>
              <div className="p-3 rounded-full bg-orange-500/10">
                <Package className="h-6 w-6 text-orange-500" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Payment Methods */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Vendas por Forma de Pagamento</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full bg-success" />
                <span>Dinheiro</span>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-muted-foreground">
                  {stats.totalRevenue > 0
                    ? ((stats.cashTotal / stats.totalRevenue) * 100).toFixed(0)
                    : 0}
                  %
                </span>
                <span className="font-mono font-medium w-28 text-right">
                  R$ {stats.cashTotal.toFixed(2)}
                </span>
              </div>
            </div>
            <div className="h-2 bg-muted rounded-full overflow-hidden">
              <div
                className="h-full bg-success rounded-full"
                style={{
                  width: `${stats.totalRevenue > 0 ? (stats.cashTotal / stats.totalRevenue) * 100 : 0}%`,
                }}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full bg-blue-500" />
                <span>Cartão</span>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-muted-foreground">
                  {stats.totalRevenue > 0
                    ? ((stats.cardTotal / stats.totalRevenue) * 100).toFixed(0)
                    : 0}
                  %
                </span>
                <span className="font-mono font-medium w-28 text-right">
                  R$ {stats.cardTotal.toFixed(2)}
                </span>
              </div>
            </div>
            <div className="h-2 bg-muted rounded-full overflow-hidden">
              <div
                className="h-full bg-blue-500 rounded-full"
                style={{
                  width: `${stats.totalRevenue > 0 ? (stats.cardTotal / stats.totalRevenue) * 100 : 0}%`,
                }}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full bg-cyan-500" />
                <span>Pix</span>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-muted-foreground">
                  {stats.totalRevenue > 0
                    ? ((stats.pixTotal / stats.totalRevenue) * 100).toFixed(0)
                    : 0}
                  %
                </span>
                <span className="font-mono font-medium w-28 text-right">
                  R$ {stats.pixTotal.toFixed(2)}
                </span>
              </div>
            </div>
            <div className="h-2 bg-muted rounded-full overflow-hidden">
              <div
                className="h-full bg-cyan-500 rounded-full"
                style={{
                  width: `${stats.totalRevenue > 0 ? (stats.pixTotal / stats.totalRevenue) * 100 : 0}%`,
                }}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 lg:grid-cols-2">
        {/* Top Products */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <ArrowUp className="h-4 w-4 text-success" />
              Produtos Mais Vendidos
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {topProducts.length === 0 ? (
              <div className="p-8 text-center text-muted-foreground">
                Nenhuma venda no período
              </div>
            ) : (
              <div className="max-h-[300px] overflow-auto">
                <table className="w-full">
                  <thead className="bg-muted/50 sticky top-0">
                    <tr className="text-left text-sm">
                      <th className="p-3">#</th>
                      <th className="p-3">Produto</th>
                      <th className="p-3 text-center">Qtd</th>
                      <th className="p-3 text-right">Receita</th>
                    </tr>
                  </thead>
                  <tbody>
                    {topProducts.map((product, index) => (
                      <tr key={product.name} className="border-b last:border-0">
                        <td className="p-3 text-sm text-muted-foreground">{index + 1}</td>
                        <td className="p-3 font-medium text-balance">{product.name}</td>
                        <td className="p-3 text-center">
                          <Badge variant="secondary">{product.quantity}</Badge>
                        </td>
                        <td className="p-3 text-right font-mono">
                          R$ {product.revenue.toFixed(2)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Sales by Hour (Today only) */}
        {period === 'today' && (
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Vendas por Hora</CardTitle>
            </CardHeader>
            <CardContent>
              {salesByHour.length === 0 ? (
                <div className="p-8 text-center text-muted-foreground">
                  Nenhuma venda hoje
                </div>
              ) : (
                <div className="space-y-2">
                  {salesByHour.map(({ hour, total }) => {
                    const maxTotal = Math.max(...salesByHour.map((s) => s.total))
                    return (
                      <div key={hour} className="flex items-center gap-3">
                        <span className="w-12 text-sm text-muted-foreground">
                          {hour.toString().padStart(2, '0')}:00
                        </span>
                        <div className="flex-1 h-6 bg-muted rounded overflow-hidden">
                          <div
                            className="h-full bg-primary/20 flex items-center justify-end pr-2"
                            style={{ width: `${(total / maxTotal) * 100}%` }}
                          >
                            <span className="text-xs font-medium">
                              R$ {total.toFixed(0)}
                            </span>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Profit/Cost Breakdown */}
        {period !== 'today' && (
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Análise de Lucro</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                <span>Receita Total</span>
                <span className="font-bold">R$ {stats.totalRevenue.toFixed(2)}</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-destructive/10 rounded-lg">
                <span className="flex items-center gap-2">
                  <ArrowDown className="h-4 w-4 text-destructive" />
                  Custo dos Produtos
                </span>
                <span className="font-bold text-destructive">- R$ {stats.totalCost.toFixed(2)}</span>
              </div>
              <hr />
              <div className="flex items-center justify-between p-3 bg-success/10 rounded-lg">
                <span className="flex items-center gap-2">
                  <ArrowUp className="h-4 w-4 text-success" />
                  Lucro Bruto
                </span>
                <span className="font-bold text-success">R$ {stats.grossProfit.toFixed(2)}</span>
              </div>
              <div className="text-center">
                <p className="text-sm text-muted-foreground">Margem de Lucro</p>
                <p className="text-3xl font-bold">{stats.profitMargin.toFixed(1)}%</p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Recent Sales List */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Histórico de Vendas</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {filteredSales.length === 0 ? (
            <div className="p-8 text-center text-muted-foreground">
              Nenhuma venda no período selecionado
            </div>
          ) : (
            <div className="max-h-[400px] overflow-auto">
              <table className="w-full">
                <thead className="bg-muted/50 sticky top-0">
                  <tr className="text-left text-sm">
                    <th className="p-3">Data/Hora</th>
                    <th className="p-3 hidden sm:table-cell">Itens</th>
                    <th className="p-3">Pagamento</th>
                    <th className="p-3 text-right">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredSales
                    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                    .slice(0, 50)
                    .map((sale) => (
                      <tr key={sale.id} className="border-b last:border-0">
                        <td className="p-3 text-sm">
                          <p>{format(new Date(sale.createdAt), 'dd/MM/yyyy', { locale: ptBR })}</p>
                          <p className="text-muted-foreground">{format(new Date(sale.createdAt), 'HH:mm')}</p>
                        </td>
                        <td className="p-3 hidden sm:table-cell">
                          <p className="text-sm">
                            {sale.items.reduce((sum, item) => sum + item.quantity, 0)} item(s)
                          </p>
                          <p className="text-xs text-muted-foreground truncate max-w-[200px]">
                            {sale.items.map((i) => i.productName).join(', ')}
                          </p>
                        </td>
                        <td className="p-3">
                          <Badge variant="outline">
                            {sale.paymentMethod === 'dinheiro' && 'Dinheiro'}
                            {sale.paymentMethod === 'cartao' && 'Cartão'}
                            {sale.paymentMethod === 'pix' && 'Pix'}
                          </Badge>
                        </td>
                        <td className="p-3 text-right font-mono font-medium">
                          R$ {sale.total.toFixed(2)}
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
