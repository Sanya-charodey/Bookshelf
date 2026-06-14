import { defineStore } from 'pinia'
import { computed, ref, type Ref } from 'vue'
import axios from 'axios'
import type { Book } from '@/types/book'
import { isAxiosError } from 'axios'
import {
  enrichBooksWithDescriptions,
  mapSearchDocToBook,
  mapWorkToBook,
  OPEN_LIBRARY_SEARCH_FIELDS,
  type OpenLibraryAuthor,
  type OpenLibrarySearchResponse,
  type OpenLibraryWork,
} from '@/api/openLibrary'
import { searchCache, bookDetailCache } from '@/api/bookCache'

export const useBookStore = defineStore('book', () => {
  const books = ref<Book[]>([])
  const searchBooks = ref<Book[]>([])
  const searchQuery = ref('')
  const selectBook = ref<Book | null>(null)
  const selectedGenre = ref<string | null>(null)
  const isFetching = ref(false)
  const error = ref<string | null>(null)

  const BASE_URL = 'https://openlibrary.org'
  const DEFAULT_QUERY = 'subject:fantasy'

  function loadCached<T>(data: T | undefined, assign: (data: T) => void) {
    if (data === undefined) return false
    assign(data)
    return true
  }

  async function executeSearch(query: string, target: Ref<Book[]>) {
    try {
      const response = await axios.get<OpenLibrarySearchResponse>(`${BASE_URL}/search.json`, {
        params: { q: query, limit: 40, fields: OPEN_LIBRARY_SEARCH_FIELDS },
      })
      target.value = await enrichBooksWithDescriptions(
        (response.data.docs ?? []).map(mapSearchDocToBook),
      )
      searchCache.set(query, target.value)
      error.value = null
    } catch (e) {
      console.error('Ошибка поиска:', e)
      if (isAxiosError(e)) {
        error.value = e.response?.status === 503
          ? 'Упс, что-то пошло не так. Попробуйте снова.'
          : 'Ошибка соединения с сервером.'
      } else {
        error.value = 'Неизвестная ошибка'
      }
    }
  }

  const fetchBooks = async (query: string = DEFAULT_QUERY): Promise<void> => {
    if (loadCached(searchCache.get(query), data => { books.value = data })) return
    await executeSearch(query, books)
  }

  const fetchSearchBooks = async (): Promise<void> => {
    if (!searchQuery.value.trim()) return
    if (loadCached(searchCache.get(searchQuery.value), data => { searchBooks.value = data })) return
    await executeSearch(searchQuery.value, searchBooks)
  }

  let bookAbortController: AbortController | null = null

  const fetchBookId = async (id: string): Promise<void> => {
    if (loadCached(bookDetailCache.get(id), data => { selectBook.value = data })) return

    bookAbortController?.abort()
    bookAbortController = new AbortController()
    const { signal } = bookAbortController

    isFetching.value = true
    error.value = null

    try {
      const workResponse = await axios.get<OpenLibraryWork>(`${BASE_URL}/works/${id}.json`, { signal })
      const work = workResponse.data

      const authorKeys = work.authors?.map((entry) => entry.author.key) ?? []
      const authorResponses = await Promise.all(
        authorKeys.map((key) => axios.get<OpenLibraryAuthor>(`${BASE_URL}${key}.json`, { signal })),
      )
      const authorNames = authorResponses
        .map((response) => response.data.name)
        .filter((name): name is string => Boolean(name))

      selectBook.value = mapWorkToBook(work, authorNames)

      const existingBook =
        books.value.find((book) => book.id === id) ??
        searchBooks.value.find((book) => book.id === id)

      if (existingBook?.volumeInfo.averageRating != null) {
        selectBook.value.volumeInfo.averageRating = existingBook.volumeInfo.averageRating
      }

      bookDetailCache.set(id, selectBook.value)
    } catch (e) {
      if (axios.isCancel(e)) return

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
