import { defineStore } from 'pinia'
import { computed, ref } from 'vue'

export interface Genre {
  value: string
  label: string
}

export const GENRES: Genre[] = [
  { value: 'fiction', label: 'Художественная литература' },
  { value: 'fantasy', label: 'Фэнтези' },
  { value: 'science_fiction', label: 'Научная фантастика' },
  { value: 'romance', label: 'Романтика' },
  { value: 'mystery', label: 'Детектив' },
  { value: 'thriller', label: 'Триллер' },
  { value: 'horror', label: 'Ужасы' },
  { value: 'historical_fiction', label: 'Историческая проза' },
  { value: 'adventure', label: 'Приключения' },
  { value: 'crime', label: 'Криминал' },
  { value: 'biography', label: 'Биография' },
  { value: 'autobiography', label: 'Автобиография' },
  { value: 'self_help', label: 'Саморазвитие' },
  { value: 'psychology', label: 'Психология' },
  { value: 'philosophy', label: 'Философия' },
  { value: 'history', label: 'История' },
  { value: 'science', label: 'Наука' },
  { value: 'business', label: 'Бизнес' },
  { value: 'poetry', label: 'Поэзия' },
  { value: 'children', label: 'Детские книги' },
  { value: 'young_adult', label: 'Подростковая литература' },
  { value: 'comics', label: 'Комиксы' },
  { value: 'graphic_novels', label: 'Графические романы' },
  { value: 'travel', label: 'Путешествия' },
  { value: 'cooking', label: 'Кулинария' },
  { value: 'art', label: 'Искусство' },
  { value: 'religion', label: 'Религия' },
  { value: 'health', label: 'Здоровье' },
  { value: 'politics', label: 'Политика' },
  { value: 'education', label: 'Образование' },
]

export const useGenreStore = defineStore('genre', () => {
  const selectedValues = ref<string[]>([])

  function toggle(value: string) {
    if (selectedValues.value.includes(value)) {
      selectedValues.value = selectedValues.value.filter((v) => v !== value)
    } else {
      selectedValues.value = [...selectedValues.value, value]
    }
  }

  function clear() {
    selectedValues.value = []
  }

  const isSelected = computed(() => (value: string) => selectedValues.value.includes(value))

  const subjectQuery = computed(() => {
    if (selectedValues.value.length === 0) return ''
    if (selectedValues.value.length === 1) return `subject:${selectedValues.value[0]}`
    return `(${selectedValues.value.map((v) => `subject:${v}`).join(' OR ')})`
  })

  const hasSelection = computed(() => selectedValues.value.length > 0)

  return { selectedValues, toggle, clear, isSelected, subjectQuery, hasSelection }
})
