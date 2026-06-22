'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { usePDV } from '@/lib/pdv-context'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Trash2, Plus, Minus, Search, X, Banknote, CreditCard, Smartphone, AlertCircle } from 'lucide-react'
import type { Product, PaymentMethod } from '@/lib/types'

export function POSTerminal() {
  const {
    cart,
    addToCart,
    removeFromCart,
    updateCartQuantity,
    clearCart,
    cartTotal,
    completeSale,
    getProductByBarcode,
    searchProducts,
    currentShift,
  } = usePDV()

  const [barcodeInput, setBarcodeInput] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState<Product[]>([])
  const [showSearch, setShowSearch] = useState(false)
  const [showPayment, setShowPayment] = useState(false)
  const [selectedPayment, setSelectedPayment] = useState<PaymentMethod>('dinheiro')
  const [amountPaid, setAmountPaid] = useState('')
  const [lastSale, setLastSale] = useState<{ total: number; change: number } | null>(null)
  const [multiplier, setMultiplier] = useState<number | null>(null)
  
  const barcodeRef = useRef<HTMLInputElement>(null)
  const amountRef = useRef<HTMLInputElement>(null)

  // Focus barcode input on mount and after actions
  useEffect(() => {
    if (!showPayment && !showSearch) {
      barcodeRef.current?.focus()
    }
  }, [showPayment, showSearch])

  // Handle barcode scan or manual entry
  const handleBarcodeSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault()
    
    let input = barcodeInput.trim()
    let qty = multiplier || 1

    // Check for multiplier format (e.g., "5*" or "5*7891234567890")
    if (input.includes('*')) {
      const parts = input.split('*')
      const num = parseInt(parts[0])
      if (!isNaN(num) && num > 0) {
        qty = num
        input = parts[1] || ''
        if (!input) {
          setMultiplier(qty)
          setBarcodeInput('')
          return
        }
      }
    }

    if (input) {
      const product = await getProductByBarcode(input)
      if (product) {
        if (product.stock < qty) {
          alert(`Estoque insuficiente! Disponível: ${product.stock}`)
        } else {
          addToCart(product, qty)
          setLastSale(null)
        }
      } else {
        // Try search
        const results = await searchProducts(input)
        if (results.length === 1) {
          addToCart(results[0], qty)
        } else if (results.length > 1) {
          setSearchResults(results)
          setSearchQuery(input)
          setShowSearch(true)
        } else {
          alert('Produto não encontrado')
        }
      }
    }

    setBarcodeInput('')
    setMultiplier(null)
  }, [barcodeInput, multiplier, getProductByBarcode, searchProducts, addToCart])

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (showPayment || showSearch) return

      // F2 - Payment
      if (e.key === 'F2' && cart.length > 0) {
        e.preventDefault()
        setShowPayment(true)
        setAmountPaid(cartTotal.toFixed(2))
        setTimeout(() => amountRef.current?.focus(), 100)
      }
      
      // F3 - Search products
      if (e.key === 'F3') {
        e.preventDefault()
        setShowSearch(true)
        setSearchQuery('')
        setSearchResults([])
      }
      
      // Escape - Clear/Cancel
      if (e.key === 'Escape') {
        e.preventDefault()
        if (multiplier) {
          setMultiplier(null)
        } else {
          clearCart()
        }
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [cart, cartTotal, showPayment, showSearch, clearCart, multiplier])

  // Search products
  const handleSearch = async () => {
    if (searchQuery.trim()) {
      const results = await searchProducts(searchQuery)
      setSearchResults(results)
    }
  }

  // Select product from search
  const selectProduct = (product: Product) => {
    const qty = multiplier || 1
    if (product.stock < qty) {
      alert(`Estoque insuficiente! Disponível: ${product.stock}`)
    } else {
      addToCart(product, qty)
    }
    setShowSearch(false)
    setSearchQuery('')
    setSearchResults([])
    setMultiplier(null)
    setLastSale(null)
    barcodeRef.current?.focus()
  }

  // Process payment
  const handlePayment = async () => {
    const paid = parseFloat(amountPaid.replace(',', '.')) || 0
    
    if (selectedPayment === 'dinheiro' && paid < cartTotal) {
      alert('Valor insuficiente!')
      return
    }

    const sale = await completeSale(selectedPayment, paid)
    if (sale) {
      setLastSale({ total: sale.total, change: sale.change })
      setShowPayment(false)
      setAmountPaid('')
      setSelectedPayment('dinheiro')
      barcodeRef.current?.focus()
    }
  }

  // Quick amount buttons
  const quickAmounts = [5, 10, 20, 50, 100, 200]

  if (!currentShift) {
    return (
      <Card className="h-full flex items-center justify-center">
        <CardContent className="text-center">
          <AlertCircle className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
          <p className="text-lg font-medium">Caixa Fechado</p>
          <p className="text-muted-foreground">Abra o caixa para iniciar as vendas</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="grid h-full gap-4 lg:grid-cols-3">
      {/* Cart Section */}
      <div className="lg:col-span-2 flex flex-col gap-4">
        {/* Barcode Input */}
        <Card>
          <CardContent className="p-4">
            <form onSubmit={handleBarcodeSubmit} className="flex gap-2">
              <div className="relative flex-1">
                <Input
                  ref={barcodeRef}
                  value={barcodeInput}
                  onChange={(e) => setBarcodeInput(e.target.value)}
                  placeholder={multiplier ? `${multiplier}x → Digite o código` : "Código de barras ou busca..."}
                  className="text-lg h-12 pr-20 font-mono"
                  autoComplete="off"
                />
                {multiplier && (
                  <Badge className="absolute right-2 top-1/2 -translate-y-1/2 bg-primary">
                    {multiplier}x
                  </Badge>
                )}
              </div>
              <Button type="button" variant="outline" size="icon" className="h-12 w-12" onClick={() => setShowSearch(true)}>
                <Search className="h-5 w-5" />
              </Button>
            </form>
            <div className="mt-2 flex gap-2 text-xs text-muted-foreground">
              <span className="bg-muted px-2 py-1 rounded">F2 Pagamento</span>
              <span className="bg-muted px-2 py-1 rounded">F3 Buscar</span>
              <span className="bg-muted px-2 py-1 rounded">ESC Limpar</span>
              <span className="bg-muted px-2 py-1 rounded">5* Multiplicar</span>
            </div>
          </CardContent>
        </Card>

        {/* Last Sale Info */}
        {lastSale && (
          <Card className="bg-success/10 border-success">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <span className="font-medium text-success">Venda concluída!</span>
                <div className="text-right">
                  <p className="text-sm">Total: <span className="font-bold">R$ {lastSale.total.toFixed(2)}</span></p>
                  {lastSale.change > 0 && (
                    <p className="text-lg font-bold text-success">Troco: R$ {lastSale.change.toFixed(2)}</p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Cart Items */}
        <Card className="flex-1 overflow-hidden">
          <CardHeader className="border-b py-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base">Itens da Venda</CardTitle>
              {cart.length > 0 && (
                <Button variant="ghost" size="sm" onClick={clearCart}>
                  <X className="mr-1 h-4 w-4" />
                  Limpar
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent className="p-0 overflow-auto max-h-[400px]">
            {cart.length === 0 ? (
              <div className="p-8 text-center text-muted-foreground">
                <p>Nenhum item adicionado</p>
                <p className="text-sm mt-1">Escaneie um produto ou use F3 para buscar</p>
              </div>
            ) : (
              <table className="w-full">
                <thead className="bg-muted/50 sticky top-0">
                  <tr className="text-left text-sm">
                    <th className="p-3">Produto</th>
                    <th className="p-3 text-center w-32">Qtd</th>
                    <th className="p-3 text-right w-24">Preço</th>
                    <th className="p-3 text-right w-28">Total</th>
                    <th className="p-3 w-10"></th>
                  </tr>
                </thead>
                <tbody>
                  {cart.map((item) => (
                    <tr key={item.productId} className="border-b last:border-0">
                      <td className="p-3">
                        <p className="font-medium text-balance">{item.productName}</p>
                      </td>
                      <td className="p-3">
                        <div className="flex items-center justify-center gap-1">
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-7 w-7"
                            onClick={() => updateCartQuantity(item.productId, item.quantity - 1)}
                          >
                            <Minus className="h-3 w-3" />
                          </Button>
                          <span className="w-8 text-center font-mono">{item.quantity}</span>
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-7 w-7"
                            onClick={() => updateCartQuantity(item.productId, item.quantity + 1)}
                          >
                            <Plus className="h-3 w-3" />
                          </Button>
                        </div>
                      </td>
                      <td className="p-3 text-right font-mono">
                        R$ {item.unitPrice.toFixed(2)}
                      </td>
                      <td className="p-3 text-right font-mono font-medium">
                        R$ {item.total.toFixed(2)}
                      </td>
                      <td className="p-3">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7 text-destructive hover:text-destructive"
                          onClick={() => removeFromCart(item.productId)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Summary Section */}
      <div className="flex flex-col gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Resumo</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Itens</span>
                <span>{cart.reduce((sum, item) => sum + item.quantity, 0)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Subtotal</span>
                <span>R$ {cartTotal.toFixed(2)}</span>
              </div>
              <hr />
              <div className="flex justify-between text-2xl font-bold">
                <span>Total</span>
                <span className="text-primary">R$ {cartTotal.toFixed(2)}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Button
          size="lg"
          className="h-16 text-lg"
          disabled={cart.length === 0}
          onClick={() => {
            setShowPayment(true)
            setAmountPaid(cartTotal.toFixed(2))
            setTimeout(() => amountRef.current?.focus(), 100)
          }}
        >
          <Banknote className="mr-2 h-6 w-6" />
          Finalizar (F2)
        </Button>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Turno Atual</CardTitle>
          </CardHeader>
          <CardContent className="text-sm space-y-1">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Vendas</span>
              <span className="font-mono">R$ {currentShift.totalSales.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Dinheiro</span>
              <span className="font-mono">R$ {currentShift.cashSales.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Cartão</span>
              <span className="font-mono">R$ {currentShift.cardSales.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Pix</span>
              <span className="font-mono">R$ {currentShift.pixSales.toFixed(2)}</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Payment Modal */}
      {showPayment && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <Card className="w-full max-w-md">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Pagamento</CardTitle>
                <Button variant="ghost" size="icon" onClick={() => setShowPayment(false)}>
                  <X className="h-5 w-5" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center py-4 bg-muted rounded-lg">
                <p className="text-sm text-muted-foreground">Total a Pagar</p>
                <p className="text-4xl font-bold text-primary">R$ {cartTotal.toFixed(2)}</p>
              </div>

              <div className="space-y-2">
                <p className="text-sm font-medium">Forma de Pagamento</p>
                <div className="grid grid-cols-3 gap-2">
                  <Button
                    variant={selectedPayment === 'dinheiro' ? 'default' : 'outline'}
                    onClick={() => setSelectedPayment('dinheiro')}
                    className="flex-col h-auto py-3"
                  >
                    <Banknote className="h-6 w-6 mb-1" />
                    <span className="text-xs">Dinheiro</span>
                  </Button>
                  <Button
                    variant={selectedPayment === 'cartao' ? 'default' : 'outline'}
                    onClick={() => setSelectedPayment('cartao')}
                    className="flex-col h-auto py-3"
                  >
                    <CreditCard className="h-6 w-6 mb-1" />
                    <span className="text-xs">Cartão</span>
                  </Button>
                  <Button
                    variant={selectedPayment === 'pix' ? 'default' : 'outline'}
                    onClick={() => setSelectedPayment('pix')}
                    className="flex-col h-auto py-3"
                  >
                    <Smartphone className="h-6 w-6 mb-1" />
                    <span className="text-xs">Pix</span>
                  </Button>
                </div>
              </div>

              {selectedPayment === 'dinheiro' && (
                <div className="space-y-2">
                  <p className="text-sm font-medium">Valor Recebido</p>
                  <Input
                    ref={amountRef}
                    value={amountPaid}
                    onChange={(e) => setAmountPaid(e.target.value)}
                    placeholder="0,00"
                    className="text-2xl h-14 text-center font-mono"
                    onKeyDown={(e) => e.key === 'Enter' && handlePayment()}
                  />
                  <div className="flex flex-wrap gap-2">
                    {quickAmounts.map((amount) => (
                      <Button
                        key={amount}
                        variant="outline"
                        size="sm"
                        onClick={() => setAmountPaid(amount.toFixed(2))}
                      >
                        R$ {amount}
                      </Button>
                    ))}
                  </div>
                  {parseFloat(amountPaid.replace(',', '.')) >= cartTotal && (
                    <div className="text-center py-2 bg-success/10 rounded-lg">
                      <p className="text-sm text-muted-foreground">Troco</p>
                      <p className="text-2xl font-bold text-success">
                        R$ {(parseFloat(amountPaid.replace(',', '.')) - cartTotal).toFixed(2)}
                      </p>
                    </div>
                  )}
                </div>
              )}

              <Button size="lg" className="w-full h-14 text-lg" onClick={handlePayment}>
                Confirmar Pagamento
              </Button>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Search Modal */}
      {showSearch && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <Card className="w-full max-w-2xl max-h-[80vh] flex flex-col">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Buscar Produto</CardTitle>
                <Button variant="ghost" size="icon" onClick={() => setShowSearch(false)}>
                  <X className="h-5 w-5" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4 overflow-hidden flex flex-col">
              <div className="flex gap-2">
                <Input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Nome ou código do produto..."
                  className="flex-1"
                  onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                  autoFocus
                />
                <Button onClick={handleSearch}>
                  <Search className="mr-2 h-4 w-4" />
                  Buscar
                </Button>
              </div>
              
              <div className="overflow-auto flex-1">
                {searchResults.length === 0 ? (
                  <p className="text-center text-muted-foreground py-8">
                    Digite o nome do produto e clique em Buscar
                  </p>
                ) : (
                  <div className="space-y-2">
                    {searchResults.map((product) => (
                      <button
                        key={product.id}
                        onClick={() => selectProduct(product)}
                        className="w-full p-3 text-left rounded-lg border hover:bg-muted transition-colors"
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="font-medium">{product.name}</p>
                            <p className="text-sm text-muted-foreground font-mono">{product.barcode}</p>
                          </div>
                          <div className="text-right">
                            <p className="font-bold text-primary">R$ {product.salePrice.toFixed(2)}</p>
                            <p className="text-sm text-muted-foreground">
                              Estoque: {product.stock}
                            </p>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
