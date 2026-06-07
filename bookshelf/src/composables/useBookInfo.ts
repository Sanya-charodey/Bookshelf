import { computed, toValue } from 'vue'
import type { Book } from '@/types/book'

export const useBookInfo = (book: () => Book | null) => {
  const b = computed(() => toValue(book))

  const thumbnail = computed(
    () => b.value?.volumeInfo?.imageLinks?.thumbnail?.replace('http://', 'https://') ?? null,
  )

  const authors = computed(() => b.value?.volumeInfo?.authors?.join(', ') ?? 'Автор неизвестен')

  const description = computed(() => {
    const desc = b.value?.volumeInfo?.description
    if (!desc) return 'Описание отсутствует'
    return desc.replace(/<[^>]*>/g, '').trim()
  })

  const rating = computed(() => {
    const value = b.value?.volumeInfo?.averageRating
    if (value == null) return null
    return value.toFixed(1)
  })

  return { thumbnail, authors, description, rating }
}
