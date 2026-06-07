import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import axios from 'axios'
import type { Book } from '@/types/book'
import { isAxiosError } from 'axios'

interface BookResp {
  totalItems: number
  items: Book[]
}

export const useBookStore = defineStore('book', () => {
  const books = ref<Book[]>([])
  const searchBooks = ref<Book[]>([])
  const searchQuery = ref('')
  const selectBook = ref<Book | null>(null)
  const selectedGenre = ref<string | null>(null)
  const isFetching = ref(false)
  const error = ref<string | null>(null)

  const API_KEY = import.meta.env.VITE_GOOGLE_BOOKS_API_KEY
  const BASE_URL = 'https://www.googleapis.com/books/v1'
  const DEFAULT_QUERY = 'subject:fantasy'

  const fetchBooks = async (query: string = DEFAULT_QUERY): Promise<void> => {
    const response = await axios.get<BookResp>(`${BASE_URL}/volumes`, {
      params: {
        q: query,
        maxResults: 40,
        key: API_KEY,
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
        key: API_KEY,
      },
    })
    searchBooks.value = response.data.items
  }

  const fetchBookId = async (id: string): Promise<void> => {
    isFetching.value = true
    error.value = null

    try {
      const response = await axios.get<Book>(`${BASE_URL}/volumes/${id}`, {
        params: {
          key: API_KEY,
        },
      })
      selectBook.value = response.data
    } catch (e) {
      console.error('Ошибка загрузки книги:', e)
      if (isAxiosError(e)) {
        if (e.response?.status === 503) {
          error.value = 'Упс, что-то пошло не так. Попробуйте снова.'
        } else {
          error.value = 'Ошибка соединения с сервером.'
        }
      } else {
        error.value = 'Неизвестная'
      }
    } finally {
      isFetching.value = false
    }
  }

  const allGenres = computed(() => {
    const genres = books.value.flatMap((book) => book.volumeInfo.categories ?? [])
    return Array.from(new Set(genres))
  })

  const selectGenre = (genre: string) => {
    selectedGenre.value = selectedGenre.value === genre ? null : genre
  }

  const filteredBooks = computed(() => {
    if (searchQuery.value.trim()) return searchBooks.value

    if (!selectedGenre.value) return books.value

    return books.value.filter((book) => book.volumeInfo.categories?.includes(selectedGenre.value!))
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
    selectGenre,
    selectedGenre,
    filteredBooks,
    isFetching,
    error,
  }
})
