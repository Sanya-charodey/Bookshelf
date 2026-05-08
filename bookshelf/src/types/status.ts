import type { Component } from 'vue'

export type StatusValue = 'planned' | 'reading' | 'finished'

export interface StatusOption {
  value: StatusValue
  label: string
  icon: Component
}
