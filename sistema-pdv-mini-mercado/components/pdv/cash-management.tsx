'use client'

import { useState } from 'react'
import { usePDV } from '@/lib/pdv-context'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { DoorOpen, DoorClosed, Banknote, CreditCard, Smartphone, Clock, TrendingUp } from 'lucide-react'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'

export function CashManagement() {
  const { currentShift, openShift, closeShift, sales } = usePDV()
  
  const [showOpenDialog, setShowOpenDialog] = useState(false)
  const [showCloseDialog, setShowCloseDialog] = useState(false)
  const [initialBalance, setInitialBalance] = useState('')
  const [closedShiftSummary, setClosedShiftSummary] = useState<{
    total: number
    cash: number
    card: number
    pix: number
    initial: number
    final: number
  } | null>(null)

  const handleOpenShift = async () => {
    const balance = parseFloat(initialBalance.replace(',', '.')) || 0
    await openShift(balance)
    setInitialBalance('')
    setShowOpenDialog(false)
  }

  const handleCloseShift = async () => {
    const summary = await closeShift()
    if (summary) {
      setClosedShiftSummary({
        total: summary.totalSales,
        cash: summary.cashSales,
        card: summary.cardSales,
        pix: summary.pixSales,
        initial: summary.initialBalance,
        final: summary.finalBalance || 0,
      })
    }
    setShowCloseDialog(false)
  }

  // Get current shift sales
  const shiftSales = currentShift
    ? sales.filter((s) => s.shiftId === currentShift.id)
    : []

  return (
    <div className="space-y-4">
      {/* Status Card */}
      <Card className={currentShift ? 'border-success' : 'border-warning'}>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center gap-2">
              {currentShift ? (
                <>
                  <DoorOpen className="h-5 w-5 text-success" />
                  <span className="text-success">Caixa Aberto</span>
                </>
              ) : (
                <>
                  <DoorClosed className="h-5 w-5 text-warning" />
                  <span className="text-warning">Caixa Fechado</span>
                </>
              )}
            </span>
            {currentShift ? (
              <Button variant="destructive" onClick={() => setShowCloseDialog(true)}>
                Fechar Caixa
              </Button>
            ) : (
              <Button onClick={() => setShowOpenDialog(true)}>
                Abrir Caixa
              </Button>
            )}
          </CardTitle>
        </CardHeader>
        {currentShift && (
          <CardContent>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Clock className="h-4 w-4" />
              Aberto em: {format(new Date(currentShift.openedAt), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
            </div>
          </CardContent>
        )}
      </Card>

      {/* Current Shift Summary */}
      {currentShift && (
        <>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-full bg-primary/10">
                    <TrendingUp className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Total de Vendas</p>
                    <p className="text-2xl font-bold">R$ {currentShift.totalSales.toFixed(2)}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-full bg-success/10">
                    <Banknote className="h-5 w-5 text-success" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Dinheiro</p>
                    <p className="text-2xl font-bold">R$ {currentShift.cashSales.toFixed(2)}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-full bg-blue-500/10">
                    <CreditCard className="h-5 w-5 text-blue-500" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Cartão</p>
                    <p className="text-2xl font-bold">R$ {currentShift.cardSales.toFixed(2)}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-full bg-cyan-500/10">
                    <Smartphone className="h-5 w-5 text-cyan-500" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Pix</p>
                    <p className="text-2xl font-bold">R$ {currentShift.pixSales.toFixed(2)}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Cash Balance */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Saldo em Caixa (Dinheiro)</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <div className="flex items-center gap-4 text-sm">
                    <span className="text-muted-foreground">Fundo inicial:</span>
                    <span className="font-mono">R$ {currentShift.initialBalance.toFixed(2)}</span>
                  </div>
                  <div className="flex items-center gap-4 text-sm">
                    <span className="text-muted-foreground">Vendas em dinheiro:</span>
                    <span className="font-mono text-success">+ R$ {currentShift.cashSales.toFixed(2)}</span>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm text-muted-foreground">Total em Caixa</p>
                  <p className="text-3xl font-bold text-primary">
                    R$ {(currentShift.initialBalance + currentShift.cashSales).toFixed(2)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Recent Sales */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Vendas do Turno ({shiftSales.length})</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              {shiftSales.length === 0 ? (
                <div className="p-8 text-center text-muted-foreground">
                  Nenhuma venda realizada neste turno
                </div>
              ) : (
                <div className="max-h-[300px] overflow-auto">
                  <table className="w-full">
                    <thead className="bg-muted/50 sticky top-0">
                      <tr className="text-left text-sm">
                        <th className="p-3">Hora</th>
                        <th className="p-3">Itens</th>
                        <th className="p-3">Pagamento</th>
                        <th className="p-3 text-right">Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      {shiftSales
                        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                        .map((sale) => (
                          <tr key={sale.id} className="border-b last:border-0">
                            <td className="p-3 text-sm">
                              {format(new Date(sale.createdAt), 'HH:mm')}
                            </td>
                            <td className="p-3 text-sm">
                              {sale.items.reduce((sum, item) => sum + item.quantity, 0)} item(s)
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
        </>
      )}

      {/* Closed Shift Summary */}
      {closedShiftSummary && (
        <Card className="border-success">
          <CardHeader>
            <CardTitle className="text-success">Turno Encerrado com Sucesso</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Total de Vendas:</span>
                  <span className="font-bold">R$ {closedShiftSummary.total.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Dinheiro:</span>
                  <span>R$ {closedShiftSummary.cash.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Cartão:</span>
                  <span>R$ {closedShiftSummary.card.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Pix:</span>
                  <span>R$ {closedShiftSummary.pix.toFixed(2)}</span>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Fundo Inicial:</span>
                  <span>R$ {closedShiftSummary.initial.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Saldo Final em Caixa:</span>
                  <span className="font-bold text-success">R$ {closedShiftSummary.final.toFixed(2)}</span>
                </div>
              </div>
            </div>
            <Button
              variant="outline"
              className="w-full mt-4"
              onClick={() => setClosedShiftSummary(null)}
            >
              Fechar Resumo
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Open Shift Dialog */}
      <Dialog open={showOpenDialog} onOpenChange={setShowOpenDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Abrir Caixa</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="initialBalance">Fundo de Caixa Inicial</Label>
              <Input
                id="initialBalance"
                value={initialBalance}
                onChange={(e) => setInitialBalance(e.target.value)}
                placeholder="0,00"
                className="text-lg"
              />
              <p className="text-sm text-muted-foreground mt-1">
                Valor em dinheiro disponível no caixa
              </p>
            </div>
            <Button onClick={handleOpenShift} className="w-full">
              Confirmar Abertura
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Close Shift Dialog */}
      <Dialog open={showCloseDialog} onOpenChange={setShowCloseDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Fechar Caixa</DialogTitle>
          </DialogHeader>
          {currentShift && (
            <div className="space-y-4">
              <div className="p-4 bg-muted rounded-lg space-y-2">
                <div className="flex justify-between">
                  <span>Total de Vendas:</span>
                  <span className="font-bold">R$ {currentShift.totalSales.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Dinheiro:</span>
                  <span>R$ {currentShift.cashSales.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Cartão:</span>
                  <span>R$ {currentShift.cardSales.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Pix:</span>
                  <span>R$ {currentShift.pixSales.toFixed(2)}</span>
                </div>
                <hr />
                <div className="flex justify-between">
                  <span>Fundo Inicial:</span>
                  <span>R$ {currentShift.initialBalance.toFixed(2)}</span>
                </div>
                <div className="flex justify-between font-bold text-lg">
                  <span>Saldo em Caixa:</span>
                  <span className="text-success">
                    R$ {(currentShift.initialBalance + currentShift.cashSales).toFixed(2)}
                  </span>
                </div>
              </div>
              <p className="text-sm text-muted-foreground">
                Confirme que o valor em caixa está correto antes de fechar.
              </p>
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => setShowCloseDialog(false)} className="flex-1">
                  Cancelar
                </Button>
                <Button variant="destructive" onClick={handleCloseShift} className="flex-1">
                  Confirmar Fechamento
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
