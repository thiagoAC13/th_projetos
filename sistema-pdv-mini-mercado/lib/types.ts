export interface Product {
  id: string
  name: string
  barcode: string
  costPrice: number
  salePrice: number
  stock: number
  minStock: number
  createdAt: Date
  updatedAt: Date
}

export interface SaleItem {
  productId: string
  productName: string
  quantity: number
  unitPrice: number
  costPrice: number
  total: number
}

export interface Sale {
  id: string
  items: SaleItem[]
  subtotal: number
  total: number
  paymentMethod: 'dinheiro' | 'cartao' | 'pix'
  amountPaid: number
  change: number
  shiftId: string
  createdAt: Date
}

export interface CashShift {
  id: string
  openedAt: Date
  closedAt: Date | null
  initialBalance: number
  finalBalance: number | null
  cashSales: number
  cardSales: number
  pixSales: number
  totalSales: number
  status: 'open' | 'closed'
}

export interface StockEntry {
  id: string
  productId: string
  productName: string
  quantity: number
  costPrice: number
  createdAt: Date
}

export type PaymentMethod = 'dinheiro' | 'cartao' | 'pix'
