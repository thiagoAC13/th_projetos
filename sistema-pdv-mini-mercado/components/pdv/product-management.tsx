'use client'

import { useState, useCallback } from 'react'
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
  DialogTrigger,
} from '@/components/ui/dialog'
import { Plus, Search, Edit2, Trash2, Package, AlertTriangle, PackagePlus } from 'lucide-react'
import type { Product } from '@/lib/types'

interface FormData {
  name: string
  barcode: string
  costPrice: string
  salePrice: string
  stock: string
  minStock: string
}

interface ProductFormProps {
  formData: FormData
  onFieldChange: (field: keyof FormData, value: string) => void
  onSubmit: () => void
  isEdit?: boolean
}

function ProductForm({ formData, onFieldChange, onSubmit, isEdit = false }: ProductFormProps) {
  return (
    <div className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <Label htmlFor="name">Nome do Produto *</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => onFieldChange('name', e.target.value)}
            placeholder="Ex: Arroz Tipo 1 5kg"
            autoComplete="off"
          />
        </div>
        <div className="sm:col-span-2">
          <Label htmlFor="barcode">Codigo de Barras *</Label>
          <Input
            id="barcode"
            value={formData.barcode}
            onChange={(e) => onFieldChange('barcode', e.target.value)}
            placeholder="7891234567890"
            className="font-mono"
            autoComplete="off"
          />
        </div>
        <div>
          <Label htmlFor="costPrice">Preco de Custo</Label>
          <Input
            id="costPrice"
            value={formData.costPrice}
            onChange={(e) => onFieldChange('costPrice', e.target.value)}
            placeholder="0,00"
            autoComplete="off"
          />
        </div>
        <div>
          <Label htmlFor="salePrice">Preco de Venda *</Label>
          <Input
            id="salePrice"
            value={formData.salePrice}
            onChange={(e) => onFieldChange('salePrice', e.target.value)}
            placeholder="0,00"
            autoComplete="off"
          />
        </div>
        <div>
          <Label htmlFor="stock">Estoque Atual</Label>
          <Input
            id="stock"
            type="number"
            value={formData.stock}
            onChange={(e) => onFieldChange('stock', e.target.value)}
            placeholder="0"
            autoComplete="off"
          />
        </div>
        <div>
          <Label htmlFor="minStock">Estoque Minimo</Label>
          <Input
            id="minStock"
            type="number"
            value={formData.minStock}
            onChange={(e) => onFieldChange('minStock', e.target.value)}
            placeholder="5"
            autoComplete="off"
          />
        </div>
      </div>
      <Button onClick={onSubmit} className="w-full">
        {isEdit ? 'Salvar Alteracoes' : 'Cadastrar Produto'}
      </Button>
    </div>
  )
}

export function ProductManagement() {
  const { products, addProduct, updateProduct, deleteProduct, lowStockProducts, addStockEntry } = usePDV()
  
  const [searchQuery, setSearchQuery] = useState('')
  const [showAddDialog, setShowAddDialog] = useState(false)
  const [showEditDialog, setShowEditDialog] = useState(false)
  const [showStockDialog, setShowStockDialog] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  
  const [formData, setFormData] = useState<FormData>({
    name: '',
    barcode: '',
    costPrice: '',
    salePrice: '',
    stock: '',
    minStock: '',
  })

  const [stockEntry, setStockEntry] = useState({
    quantity: '',
    costPrice: '',
  })

  const filteredProducts = products.filter(
    (p) =>
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.barcode.includes(searchQuery)
  )

  const resetForm = useCallback(() => {
    setFormData({
      name: '',
      barcode: '',
      costPrice: '',
      salePrice: '',
      stock: '',
      minStock: '',
    })
  }, [])

  const handleFieldChange = useCallback((field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }, [])

  const handleAddProduct = useCallback(async () => {
    if (!formData.name || !formData.barcode || !formData.salePrice) {
      alert('Preencha os campos obrigatorios: Nome, Codigo de Barras e Preco de Venda')
      return
    }

    await addProduct({
      name: formData.name,
      barcode: formData.barcode,
      costPrice: parseFloat(formData.costPrice.replace(',', '.')) || 0,
      salePrice: parseFloat(formData.salePrice.replace(',', '.')) || 0,
      stock: parseInt(formData.stock) || 0,
      minStock: parseInt(formData.minStock) || 5,
    })

    resetForm()
    setShowAddDialog(false)
  }, [formData, addProduct, resetForm])

  const handleEditProduct = useCallback(async () => {
    if (!selectedProduct) return

    await updateProduct({
      ...selectedProduct,
      name: formData.name,
      barcode: formData.barcode,
      costPrice: parseFloat(formData.costPrice.replace(',', '.')) || 0,
      salePrice: parseFloat(formData.salePrice.replace(',', '.')) || 0,
      stock: parseInt(formData.stock) || 0,
      minStock: parseInt(formData.minStock) || 5,
    })

    resetForm()
    setSelectedProduct(null)
    setShowEditDialog(false)
  }, [formData, selectedProduct, updateProduct, resetForm])

  const openEditDialog = (product: Product) => {
    setSelectedProduct(product)
    setFormData({
      name: product.name,
      barcode: product.barcode,
      costPrice: product.costPrice.toFixed(2),
      salePrice: product.salePrice.toFixed(2),
      stock: product.stock.toString(),
      minStock: product.minStock.toString(),
    })
    setShowEditDialog(true)
  }

  const openStockDialog = (product: Product) => {
    setSelectedProduct(product)
    setStockEntry({
      quantity: '',
      costPrice: product.costPrice.toFixed(2),
    })
    setShowStockDialog(true)
  }

  const handleAddStock = async () => {
    if (!selectedProduct || !stockEntry.quantity) return

    await addStockEntry(
      selectedProduct.id,
      parseInt(stockEntry.quantity) || 0,
      parseFloat(stockEntry.costPrice.replace(',', '.')) || selectedProduct.costPrice
    )

    setStockEntry({ quantity: '', costPrice: '' })
    setSelectedProduct(null)
    setShowStockDialog(false)
  }

  const handleDeleteProduct = async (id: string) => {
    if (confirm('Tem certeza que deseja excluir este produto?')) {
      await deleteProduct(id)
    }
  }

  return (
    <div className="space-y-4">
      {/* Low Stock Alert */}
      {lowStockProducts.length > 0 && (
        <Card className="border-warning bg-warning/10">
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2 text-warning">
              <AlertTriangle className="h-5 w-5" />
              Produtos com Estoque Baixo ({lowStockProducts.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {lowStockProducts.slice(0, 5).map((product) => (
                <Badge key={product.id} variant="outline" className="text-warning border-warning">
                  {product.name} ({product.stock})
                </Badge>
              ))}
              {lowStockProducts.length > 5 && (
                <Badge variant="outline">+{lowStockProducts.length - 5} mais</Badge>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Header Actions */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Buscar por nome ou código..."
            className="pl-10"
          />
        </div>
        <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
          <DialogTrigger asChild>
            <Button onClick={resetForm}>
              <Plus className="mr-2 h-4 w-4" />
              Novo Produto
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Cadastrar Produto</DialogTitle>
            </DialogHeader>
            <ProductForm
              formData={formData}
              onFieldChange={handleFieldChange}
              onSubmit={handleAddProduct}
            />
          </DialogContent>
        </Dialog>
      </div>

      {/* Products List */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base flex items-center gap-2">
            <Package className="h-5 w-5" />
            Produtos ({filteredProducts.length})
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {filteredProducts.length === 0 ? (
            <div className="p-8 text-center text-muted-foreground">
              {searchQuery ? 'Nenhum produto encontrado' : 'Nenhum produto cadastrado'}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-muted/50">
                  <tr className="text-left text-sm">
                    <th className="p-3">Produto</th>
                    <th className="p-3 hidden sm:table-cell">Código</th>
                    <th className="p-3 text-right">Custo</th>
                    <th className="p-3 text-right">Venda</th>
                    <th className="p-3 text-center">Estoque</th>
                    <th className="p-3 text-right">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredProducts.map((product) => (
                    <tr key={product.id} className="border-b last:border-0">
                      <td className="p-3">
                        <p className="font-medium text-balance">{product.name}</p>
                        <p className="text-xs text-muted-foreground sm:hidden font-mono">
                          {product.barcode}
                        </p>
                      </td>
                      <td className="p-3 hidden sm:table-cell font-mono text-sm text-muted-foreground">
                        {product.barcode}
                      </td>
                      <td className="p-3 text-right font-mono text-sm">
                        R$ {product.costPrice.toFixed(2)}
                      </td>
                      <td className="p-3 text-right font-mono font-medium">
                        R$ {product.salePrice.toFixed(2)}
                      </td>
                      <td className="p-3 text-center">
                        <Badge
                          variant={product.stock <= product.minStock ? 'destructive' : 'secondary'}
                        >
                          {product.stock}
                        </Badge>
                      </td>
                      <td className="p-3">
                        <div className="flex justify-end gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => openStockDialog(product)}
                            title="Entrada de Estoque"
                          >
                            <PackagePlus className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => openEditDialog(product)}
                            title="Editar"
                          >
                            <Edit2 className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-destructive hover:text-destructive"
                            onClick={() => handleDeleteProduct(product.id)}
                            title="Excluir"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Edit Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar Produto</DialogTitle>
          </DialogHeader>
          <ProductForm
            formData={formData}
            onFieldChange={handleFieldChange}
            onSubmit={handleEditProduct}
            isEdit
          />
        </DialogContent>
      </Dialog>

      {/* Stock Entry Dialog */}
      <Dialog open={showStockDialog} onOpenChange={setShowStockDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Entrada de Estoque</DialogTitle>
          </DialogHeader>
          {selectedProduct && (
            <div className="space-y-4">
              <div className="p-3 bg-muted rounded-lg">
                <p className="font-medium">{selectedProduct.name}</p>
                <p className="text-sm text-muted-foreground">
                  Estoque atual: {selectedProduct.stock} unidades
                </p>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <Label htmlFor="entryQuantity">Quantidade</Label>
                  <Input
                    id="entryQuantity"
                    type="number"
                    value={stockEntry.quantity}
                    onChange={(e) =>
                      setStockEntry({ ...stockEntry, quantity: e.target.value })
                    }
                    placeholder="0"
                  />
                </div>
                <div>
                  <Label htmlFor="entryCost">Preço de Custo</Label>
                  <Input
                    id="entryCost"
                    value={stockEntry.costPrice}
                    onChange={(e) =>
                      setStockEntry({ ...stockEntry, costPrice: e.target.value })
                    }
                    placeholder="0,00"
                  />
                </div>
              </div>
              {stockEntry.quantity && (
                <div className="p-3 bg-success/10 rounded-lg text-center">
                  <p className="text-sm text-muted-foreground">Novo Estoque</p>
                  <p className="text-2xl font-bold text-success">
                    {selectedProduct.stock + (parseInt(stockEntry.quantity) || 0)} unidades
                  </p>
                </div>
              )}
              <Button onClick={handleAddStock} className="w-full">
                Confirmar Entrada
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
