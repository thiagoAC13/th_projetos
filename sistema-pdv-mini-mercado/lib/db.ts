import { openDB, IDBPDatabase } from 'idb'
import type { Product, Sale, CashShift, StockEntry } from './types'

const DB_NAME = 'pdv-minimercado'
const DB_VERSION = 1

interface PDVDatabase {
  products: {
    key: string
    value: Product
    indexes: { 'by-barcode': string; 'by-name': string }
  }
  sales: {
    key: string
    value: Sale
    indexes: { 'by-date': Date; 'by-shift': string }
  }
  shifts: {
    key: string
    value: CashShift
    indexes: { 'by-status': string }
  }
  stockEntries: {
    key: string
    value: StockEntry
    indexes: { 'by-product': string; 'by-date': Date }
  }
}

let dbPromise: Promise<IDBPDatabase<PDVDatabase>> | null = null

export function getDB() {
  if (!dbPromise) {
    dbPromise = openDB<PDVDatabase>(DB_NAME, DB_VERSION, {
      upgrade(db) {
        // Products store
        if (!db.objectStoreNames.contains('products')) {
          const productStore = db.createObjectStore('products', { keyPath: 'id' })
          productStore.createIndex('by-barcode', 'barcode', { unique: true })
          productStore.createIndex('by-name', 'name', { unique: false })
        }

        // Sales store
        if (!db.objectStoreNames.contains('sales')) {
          const salesStore = db.createObjectStore('sales', { keyPath: 'id' })
          salesStore.createIndex('by-date', 'createdAt', { unique: false })
          salesStore.createIndex('by-shift', 'shiftId', { unique: false })
        }

        // Shifts store
        if (!db.objectStoreNames.contains('shifts')) {
          const shiftsStore = db.createObjectStore('shifts', { keyPath: 'id' })
          shiftsStore.createIndex('by-status', 'status', { unique: false })
        }

        // Stock entries store
        if (!db.objectStoreNames.contains('stockEntries')) {
          const stockStore = db.createObjectStore('stockEntries', { keyPath: 'id' })
          stockStore.createIndex('by-product', 'productId', { unique: false })
          stockStore.createIndex('by-date', 'createdAt', { unique: false })
        }
      },
    })
  }
  return dbPromise
}

// Product operations
export async function addProduct(product: Product) {
  const db = await getDB()
  return db.add('products', product)
}

export async function updateProduct(product: Product) {
  const db = await getDB()
  return db.put('products', product)
}

export async function deleteProduct(id: string) {
  const db = await getDB()
  return db.delete('products', id)
}

export async function getProduct(id: string) {
  const db = await getDB()
  return db.get('products', id)
}

export async function getProductByBarcode(barcode: string) {
  const db = await getDB()
  return db.getFromIndex('products', 'by-barcode', barcode)
}

export async function getAllProducts() {
  const db = await getDB()
  return db.getAll('products')
}

export async function searchProducts(query: string) {
  const db = await getDB()
  const allProducts = await db.getAll('products')
  const lowerQuery = query.toLowerCase()
  return allProducts.filter(
    (p) =>
      p.name.toLowerCase().includes(lowerQuery) ||
      p.barcode.includes(query)
  )
}

export async function getLowStockProducts() {
  const db = await getDB()
  const allProducts = await db.getAll('products')
  return allProducts.filter((p) => p.stock <= p.minStock)
}

// Sale operations
export async function addSale(sale: Sale) {
  const db = await getDB()
  
  // Update stock for each item
  for (const item of sale.items) {
    const product = await db.get('products', item.productId)
    if (product) {
      product.stock -= item.quantity
      product.updatedAt = new Date()
      await db.put('products', product)
    }
  }
  
  return db.add('sales', sale)
}

export async function getAllSales() {
  const db = await getDB()
  return db.getAll('sales')
}

export async function getSalesByDateRange(startDate: Date, endDate: Date) {
  const db = await getDB()
  const allSales = await db.getAll('sales')
  return allSales.filter(
    (s) => s.createdAt >= startDate && s.createdAt <= endDate
  )
}

export async function getSalesByShift(shiftId: string) {
  const db = await getDB()
  return db.getAllFromIndex('sales', 'by-shift', shiftId)
}

// Shift operations
export async function addShift(shift: CashShift) {
  const db = await getDB()
  return db.add('shifts', shift)
}

export async function updateShift(shift: CashShift) {
  const db = await getDB()
  return db.put('shifts', shift)
}

export async function getOpenShift() {
  const db = await getDB()
  const shifts = await db.getAllFromIndex('shifts', 'by-status', 'open')
  return shifts[0] || null
}

export async function getAllShifts() {
  const db = await getDB()
  return db.getAll('shifts')
}

// Stock entry operations
export async function addStockEntry(entry: StockEntry) {
  const db = await getDB()
  
  // Update product stock
  const product = await db.get('products', entry.productId)
  if (product) {
    product.stock += entry.quantity
    product.costPrice = entry.costPrice
    product.updatedAt = new Date()
    await db.put('products', product)
  }
  
  return db.add('stockEntries', entry)
}

export async function getStockEntriesByProduct(productId: string) {
  const db = await getDB()
  return db.getAllFromIndex('stockEntries', 'by-product', productId)
}
