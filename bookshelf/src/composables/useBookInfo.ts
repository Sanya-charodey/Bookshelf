import { computed } from 'vue'
import type { Book } from '@/types/book'

export const useBookInfo = (book: Book) => {
  const thumbnail = computed(
    () => book.volumeInfo.imageLinks?.thumbnail?.replace('http://', 'https://') ?? null,
  )

  const authors = computed(() => book.volumeInfo.authors?.join(', ') ?? 'Автор неизвестен')

  const description = computed(() => {
    const desc = book.volumeInfo.description
    if (!desc) return 'Описание отсутствует'
    return desc.length > 120 ? desc.slice(0, 120) + '...' : desc
  })
  return { thumbnail, authors, description }
}
