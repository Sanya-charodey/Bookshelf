import { defineStore } from 'pinia'
import { computed, ref, watch } from 'vue'
import type { Book } from '@/types/book'

const STORAGE_KEY = 'bookshelf-shelf'

export const useShelfStore = defineStore('shelf', () => {
  const books = ref<Book[]>([])

  function load() {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) {
      try { books.value = JSON.parse(raw) } catch { books.value = [] }
    }
  }

  function persist() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(books.value))
  }

  watch(books, persist, { deep: true })

  function addBook(book: Book) {
    if (!isOnShelf(book.id)) {
      books.value.push(book)
    }
  }

  function removeBook(id: string) {
    books.value = books.value.filter((b) => b.id !== id)
  }

  function isOnShelf(id: string) {
    return books.value.some((b) => b.id === id)
  }

  const totalBooks = computed(() => books.value.length)

  load()

  return { books, addBook, removeBook, isOnShelf, totalBooks }
})
