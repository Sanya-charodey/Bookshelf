import type { Book } from '@/types/book'

const CACHE_PREFIX = 'bookshelf_'
const DEFAULT_TTL = 24 * 60 * 60 * 1000

interface CacheEntry<T> {
  data: T
  timestamp: number
  ttl: number
}

export function createCache<T>(name: string, ttl: number = DEFAULT_TTL) {
  const storageKey = CACHE_PREFIX + name
  const map = new Map<string, CacheEntry<T>>()

  try {
    const raw = localStorage.getItem(storageKey)
    if (raw) {
      const saved = JSON.parse(raw) as Record<string, CacheEntry<T>>
      for (const [key, entry] of Object.entries(saved)) {
        if (Date.now() - entry.timestamp < entry.ttl) {
          map.set(key, entry)
        }
      }
    }
  } catch {}

  const persist = () => {
    try {
      const obj: Record<string, CacheEntry<T>> = {}
      map.forEach((v, k) => {
        obj[k] = v
      })
      localStorage.setItem(storageKey, JSON.stringify(obj))
    } catch {}
  }

  const get = (key: string): T | undefined => {
    const entry = map.get(key)
    if (!entry) return undefined
    if (Date.now() - entry.timestamp > entry.ttl) {
      map.delete(key)
      persist()
      return undefined
    }
    return entry.data
  }

  const set = (key: string, data: T) => {
    map.set(key, { data, timestamp: Date.now(), ttl })
    persist()
  }

  return { get, set }
}

export const searchCache = createCache<{ items: Book[]; total: number }>('search')
export const bookDetailCache = createCache<Book>('bookDetail')
export const descriptionCache = createCache<string>('description')
