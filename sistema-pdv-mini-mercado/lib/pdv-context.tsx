'use client'

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react'
import type { Product, Sale, CashShift, SaleItem, PaymentMethod, StockEntry } from './types'
import * as db from './db'
import { v4 as uuidv4 } from 'uuid'

interface PDVContextType {
  // Products
  products: Product[]
  loadProducts: () => Promise<void>
  addProduct: (product: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>
  updateProduct: (product: Product) => Promise<void>
  deleteProduct: (id: string) => Promise<void>
  getProductByBarcode: (barcode: string) => Promise<Product | undefined>
  searchProducts: (query: string) => Promise<Product[]>
  lowStockProducts: Product[]
  
  // Cart
  cart: SaleItem[]
  addToCart: (product: Product, quantity?: number) => void
  removeFromCart: (productId: string) => void
  updateCartQuantity: (productId: string, quantity: number) => void
  clearCart: () => void
  cartTotal: number
  
  // Sales
  sales: Sale[]
  completeSale: (paymentMethod: PaymentMethod, amountPaid: number) => Promise<Sale | null>
  loadSales: () => Promise<void>
  
  // Shifts
  currentShift: CashShift | null
  openShift: (initialBalance: number) => Promise<void>
  closeShift: () => Promise<CashShift | null>
  loadCurrentShift: () => Promise<void>
  
  // Stock
  addStockEntry: (productId: string, quantity: number, costPrice: number) => Promise<void>
  
  // UI State
  isLoading: boolean
}

const PDVContext = createContext<PDVContextType | null>(null)

export function PDVProvider({ children }: { children: React.ReactNode }) {
  const [products, setProducts] = useState<Product[]>([])
  const [sales, setSales] = useState<Sale[]>([])
  const [cart, setCart] = useState<SaleItem[]>([])
  const [currentShift, setCurrentShift] = useState<CashShift | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const lowStockProducts = products.filter(p => p.stock <= p.minStock)

  const cartTotal = cart.reduce((sum, item) => sum + item.total, 0)

  const loadProducts = useCallback(async () => {
    const allProducts = await db.getAllProducts()
    setProducts(allProducts)
  }, [])

  const loadSales = useCallback(async () => {
    const allSales = await db.getAllSales()
    setSales(allSales)
  }, [])

  const loadCurrentShift = useCallback(async () => {
    const shift = await db.getOpenShift()
    setCurrentShift(shift)
  }, [])

  useEffect(() => {
    async function init() {
      setIsLoading(true)
      await Promise.all([loadProducts(), loadSales(), loadCurrentShift()])
      setIsLoading(false)
    }
    init()
  }, [loadProducts, loadSales, loadCurrentShift])

  const addProduct = async (productData: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>) => {
    const product: Product = {
      ...productData,
      id: uuidv4(),
      createdAt: new Date(),
      updatedAt: new Date(),
    }
    await db.addProduct(product)
    await loadProducts()
  }

  const updateProductFn = async (product: Product) => {
    product.updatedAt = new Date()
    await db.updateProduct(product)
    await loadProducts()
  }

  const deleteProductFn = async (id: string) => {
    await db.deleteProduct(id)
    await loadProducts()
  }

  const getProductByBarcode = async (barcode: string) => {
    return db.getProductByBarcode(barcode)
  }

  const searchProductsFn = async (query: string) => {
    return db.searchProducts(query)
  }

  const addToCart = (product: Product, quantity = 1) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.productId === product.id)
      if (existing) {
        return prev.map((item) =>
          item.productId === product.id
            ? {
                ...item,
                quantity: item.quantity + quantity,
                total: (item.quantity + quantity) * item.unitPrice,
              }
            : item
        )
      }
      return [
        ...prev,
        {
          productId: product.id,
          productName: product.name,
          quantity,
          unitPrice: product.salePrice,
          costPrice: product.costPrice,
          total: quantity * product.salePrice,
        },
      ]
    })
  }

  const removeFromCart = (productId: string) => {
    setCart((prev) => prev.filter((item) => item.productId !== productId))
  }

  const updateCartQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId)
      return
    }
    setCart((prev) =>
      prev.map((item) =>
        item.productId === productId
          ? { ...item, quantity, total: quantity * item.unitPrice }
          : item
      )
    )
  }

  const clearCart = () => {
    setCart([])
  }

  const completeSale = async (paymentMethod: PaymentMethod, amountPaid: number): Promise<Sale | null> => {
    if (!currentShift || cart.length === 0) return null

    const sale: Sale = {
      id: uuidv4(),
      items: [...cart],
      subtotal: cartTotal,
      total: cartTotal,
      paymentMethod,
      amountPaid,
      change: paymentMethod === 'dinheiro' ? amountPaid - cartTotal : 0,
      shiftId: currentShift.id,
      createdAt: new Date(),
    }

    await db.addSale(sale)
    
    // Update shift totals
    const updatedShift = { ...currentShift }
    updatedShift.totalSales += sale.total
    if (paymentMethod === 'dinheiro') {
      updatedShift.cashSales += sale.total
    } else if (paymentMethod === 'cartao') {
      updatedShift.cardSales += sale.total
    } else {
      updatedShift.pixSales += sale.total
    }
    await db.updateShift(updatedShift)
    setCurrentShift(updatedShift)

    clearCart()
    await loadProducts()
    await loadSales()
    
    return sale
  }

  const openShift = async (initialBalance: number) => {
    const shift: CashShift = {
      id: uuidv4(),
      openedAt: new Date(),
      closedAt: null,
      initialBalance,
      finalBalance: null,
      cashSales: 0,
      cardSales: 0,
      pixSales: 0,
      totalSales: 0,
      status: 'open',
    }
    await db.addShift(shift)
    setCurrentShift(shift)
  }

  const closeShift = async (): Promise<CashShift | null> => {
    if (!currentShift) return null

    const closedShift: CashShift = {
      ...currentShift,
      closedAt: new Date(),
      finalBalance: currentShift.initialBalance + currentShift.cashSales,
      status: 'closed',
    }
    await db.updateShift(closedShift)
    setCurrentShift(null)
    return closedShift
  }

  const addStockEntryFn = async (productId: string, quantity: number, costPrice: number) => {
    const product = products.find(p => p.id === productId)
    if (!product) return

    const entry: StockEntry = {
      id: uuidv4(),
      productId,
      productName: product.name,
      quantity,
      costPrice,
      createdAt: new Date(),
    }
    await db.addStockEntry(entry)
    await loadProducts()
  }

  return (
    <PDVContext.Provider
      value={{
        products,
        loadProducts,
        addProduct,
        updateProduct: updateProductFn,
        deleteProduct: deleteProductFn,
        getProductByBarcode,
        searchProducts: searchProductsFn,
        lowStockProducts,
        cart,
        addToCart,
        removeFromCart,
        updateCartQuantity,
        clearCart,
        cartTotal,
        sales,
        completeSale,
        loadSales,
        currentShift,
        openShift,
        closeShift,
        loadCurrentShift,
        addStockEntry: addStockEntryFn,
        isLoading,
      }}
    >
      {children}
    </PDVContext.Provider>
  )
}

export function usePDV() {
  const context = useContext(PDVContext)
  if (!context) {
    throw new Error('usePDV must be used within a PDVProvider')
  }
  return context
}
