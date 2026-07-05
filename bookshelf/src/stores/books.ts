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

export const PAGE_SIZE = 10
export const DEFAULT_QUERY = 'subject:fantasy'

export const useBookStore = defineStore('book', () => {
  const books = ref<Book[]>([])
  const searchBooks = ref<Book[]>([])
  const searchQuery = ref('')
  const selectBook = ref<Book | null>(null)
  const isFetching = ref(false)
  const error = ref<string | null>(null)

  const currentPage = ref(1)
  const totalItems = ref(0)
  const currentQuery = ref(DEFAULT_QUERY)
  const totalPages = computed(() => Math.max(1, Math.ceil(totalItems.value / PAGE_SIZE)))

  const BASE_URL = 'https://openlibrary.org'

  function cacheKey(query: string, page: number) {
    return `${query}_page${page}`
  }

  async function executeSearch(query: string, target: Ref<Book[]>, page: number) {
    const response = await axios.get<OpenLibrarySearchResponse>(`${BASE_URL}/search.json`, {
      params: { q: query, limit: PAGE_SIZE, page, fields: OPEN_LIBRARY_SEARCH_FIELDS },
    })
    const docs = response.data.docs ?? []
    totalItems.value = response.data.numFound ?? 0
    target.value = await enrichBooksWithDescriptions(docs.map(mapSearchDocToBook))
    searchCache.set(cacheKey(query, page), { items: target.value, total: totalItems.value })
  }

  function handleError(context: string, e: unknown) {
    console.error(`${context}:`, e)
    if (isAxiosError(e)) {
      error.value =
        e.response?.status === 503
          ? 'Упс, что-то пошло не так. Попробуйте снова.'
          : 'Ошибка соединения с сервером.'
    } else {
      error.value = 'Неизвестная ошибка'
    }
  }

  const fetchBooks = async (query?: string, page: number = 1): Promise<void> => {
    const q = query ?? currentQuery.value
    currentQuery.value = q

    const cached = searchCache.get(cacheKey(q, page))
    if (cached) {
      books.value = cached.items
      totalItems.value = cached.total
      currentPage.value = page
      return
    }
    isFetching.value = true
    error.value = null
    try {
      currentPage.value = page
      await executeSearch(q, books, page)
    } catch (e) {
      handleError('Ошибка поиска', e)
    } finally {
      isFetching.value = false
    }
  }

  function setQuery(query: string) {
    currentQuery.value = query || DEFAULT_QUERY
    currentPage.value = 1
    fetchBooks(currentQuery.value)
  }

  const fetchSearchBooks = async (page: number = 1): Promise<void> => {
    if (!searchQuery.value.trim()) {
      searchBooks.value = []
      totalItems.value = 0
      return
    }

    const cached = searchCache.get(cacheKey(searchQuery.value, page))
    if (cached) {
      searchBooks.value = cached.items
      totalItems.value = cached.total
      currentPage.value = page
      return
    }

    isFetching.value = true
    error.value = null

    try {
      currentPage.value = page
      await executeSearch(searchQuery.value, searchBooks, page)
    } catch (e) {
      handleError('Ошибка поиска', e)
    } finally {
      isFetching.value = false
    }
  }

  let bookAbortController: AbortController | null = null

  const fetchBookId = async (id: string): Promise<void> => {
    const cachedBook = bookDetailCache.get(id)
    if (cachedBook !== undefined) {
      selectBook.value = cachedBook
      return
    }

    bookAbortController?.abort()
    bookAbortController = new AbortController()
    const { signal } = bookAbortController

    isFetching.value = true
    error.value = null

    try {
      const workResponse = await axios.get<OpenLibraryWork>(`${BASE_URL}/works/${id}.json`, {
        signal,
      })
      const work = workResponse.data

      const authorKeys = work.authors?.map((entry) => entry.author.key) ?? []
      const authorResponses = await Promise.all(
        authorKeys.map((key) => axios.get<OpenLibraryAuthor>(`${BASE_URL}${key}.json`, { signal })),
      )
      const authorNames = authorResponses
        .map((response) => response.data.name)
        .filter((name): name is string => Boolean(name))

      const book = mapWorkToBook(work, authorNames)

      const existingBook =
        books.value.find((book) => book.id === id) ??
        searchBooks.value.find((book) => book.id === id)

      if (existingBook?.volumeInfo.averageRating != null) {
        book.volumeInfo = {
          ...book.volumeInfo,
          averageRating: existingBook.volumeInfo.averageRating,
        }
      }

      selectBook.value = book
      bookDetailCache.set(id, book)
    } catch (e) {
      if (axios.isCancel(e)) return

      handleError('Ошибка загрузки книги', e)
    } finally {
      isFetching.value = false
    }
  }

  function setPage(page: number) {
    if (page < 1 || page > totalPages.value) return
    currentPage.value = page
    if (searchQuery.value.trim()) {
      fetchSearchBooks(page)
    } else {
      fetchBooks(undefined, page)
    }
  }

  const displayBooks = computed(() => {
    if (searchQuery.value.trim()) return searchBooks.value
    return books.value
  })

  return {
    books,
    fetchBooks,
    setQuery,
    fetchSearchBooks,
    searchBooks,
    fetchBookId,
    selectBook,
    searchQuery,
    displayBooks,
    isFetching,
    error,
    currentPage,
    totalItems,
    totalPages,
    setPage,
  }
})
