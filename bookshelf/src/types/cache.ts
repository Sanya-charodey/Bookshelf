export interface CacheEntry<T> {
  data: T
  timestamp: number
  ttl: number
}
