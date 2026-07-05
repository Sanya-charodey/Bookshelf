<template>
    <nav v-if="totalPages > 1" class="pagination" aria-label="Пагинация">
        <button
            class="pagination__btn"
            :disabled="currentPage <= 1"
            @click="goTo(currentPage - 1)"
        >
            ← Назад
        </button>

        <template v-for="page in pageNumbers" :key="page">
            <span v-if="page === '...'" class="pagination__ellipsis">…</span>
            <button
                v-else
                class="pagination__btn"
                :class="{ 'pagination__btn--active': page === currentPage }"
                @click="goTo(page as number)"
            >
                {{ page }}
            </button>
        </template>

        <button
            class="pagination__btn"
            :disabled="currentPage >= totalPages"
            @click="goTo(currentPage + 1)"
        >
            Вперед →
        </button>
    </nav>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
    currentPage: number
    totalPages: number
}>()

const emit = defineEmits<{
    (e: 'page-change', page: number): void
}>()

const pageNumbers = computed(() => {
    const total = props.totalPages
    const current = props.currentPage
    const pages: (number | '...')[] = []

    if (total <= 7) {
        for (let i = 1; i <= total; i++) pages.push(i)
        return pages
    }

    pages.push(1)

    if (current > 3) pages.push('...')

    const start = Math.max(2, current - 1)
    const end = Math.min(total - 1, current + 1)
    for (let i = start; i <= end; i++) pages.push(i)

    if (current < total - 2) pages.push('...')

    pages.push(total)

    return pages
})

function goTo(page: number) {
    if (page < 1 || page > props.totalPages || page === props.currentPage) return
    emit('page-change', page)
}
</script>

<style scoped>
.pagination {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 6px;
    padding: 24px 0;
    flex-wrap: wrap;
}

.pagination__btn {
    min-width: 40px;
    padding: 8px 12px;
    border: 1px solid #ddd;
    border-radius: 8px;
    background: #fff;
    cursor: pointer;
    font-size: 14px;
    color: #333;
    transition: all 0.2s;
}

.pagination__btn:hover:not(:disabled) {
    border-color: #4a90d9;
    color: #4a90d9;
}

.pagination__btn:disabled {
    opacity: 0.4;
    cursor: default;
}

.pagination__btn--active {
    background: #4a90d9;
    color: #fff;
    border-color: #4a90d9;
}

.pagination__ellipsis {
    padding: 8px 4px;
    color: #999;
}
</style>
