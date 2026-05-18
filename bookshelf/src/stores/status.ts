import type { StatusValue } from '@/types/status'
import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useStatusStore = defineStore('status', () => {
  const statuses = ref<Record<string, StatusValue>>(
    JSON.parse(localStorage.getItem('book_statuses') ?? '{}'),
  )

  const saveStatuses = () => {
    localStorage.setItem('book_statuses', JSON.stringify(statuses.value))
  }

  const setStatus = (bookId: string, status: StatusValue) => {
    statuses.value[bookId] = status
    saveStatuses()
  }

  const removeStatus = (bookId: string) => {
    delete statuses.value[bookId]
    saveStatuses()
  }

  const getStatus = (bookId: string): StatusValue | null => {
    return statuses.value[bookId] ?? null
  }

  return {
    statuses,
    setStatus,
    removeStatus,
    getStatus,
  }
})
