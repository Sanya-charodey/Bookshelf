import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import axios from 'axios'
import type { Book } from '@/types/book'

interface BookResp {
  totalItems: number
  items: Book[]
}

export const useBookStore = defineStore('book', () => {
  const books = ref<Book[]>([])
  const searchBooks = ref<Book[]>([])
  const searchQuery = ref('')
  const selectBook = ref<Book | null>(null)

  const BASE_URL = 'https://www.googleapis.com/books/v1'

  const fetchBooks = async (query: string): Promise<void> => {
    const response = await axios.get<BookResp>(`${BASE_URL}/volumes`, {
      params: {
        q: query,
        maxResults: 40,
        key: import.meta.env.VITE_GOOGLE_BOOKS_API_KEY,
      },
    })
    books.value = response.data.items
  }

  const fetchSearchBooks = async (): Promise<void> => {
    if (!searchQuery.value.trim()) return

    const response = await axios.get<BookResp>(`${BASE_URL}/volumes`, {
      params: {
        q: searchQuery.value,
        maxResults: 40,
        key: import.meta.env.VITE_GOOGLE_BOOKS_API_KEY,
      },
    })
    searchBooks.value = response.data.items
  }

  const fetchBookId = async (id: string): Promise<void> => {
    const response = await axios.get<Book>(`${BASE_URL}/volumes/${id}`, {
      params: {
        key: import.meta.env.VITE_GOOGLE_BOOKS_API_KEY,
      },
    })
    selectBook.value = response.data
  }

  const allGenres = computed(() => {
    const genres = books.value.flatMap((book) => book.volumeInfo.categories ?? [])
    return [...new Set(genres)]
  })

  return {
    books,
    fetchBooks,
    fetchSearchBooks,
    searchBooks,
    fetchBookId,
    selectBook,
    searchQuery,
    allGenres,
  }
})
