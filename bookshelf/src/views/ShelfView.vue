<template>
    <main>
        <h1 class="title">Моя полка ({{ shelfStore.totalBooks }})</h1>

        <div v-if="shelfStore.books.length === 0" class="empty">
            Здесь пока нет книг
        </div>

        <div class="books" v-else>
            <BookCard
                v-for="book in paginatedBooks"
                :key="book.id"
                :book="book"
            />
        </div>

        <Pagination
            v-if="shelfStore.books.length > pageSize"
            :current-page="shelfCurrentPage"
            :total-pages="shelfTotalPages"
            @page-change="setShelfPage"
        />
    </main>
</template>

<script setup lang='ts'>
import { useShelfStore } from '@/stores/shelf';
import BookCard from '@/components/book/BookCard.vue';
import Pagination from '@/components/pagination/Pagination.vue';
import { ref, computed, watch } from 'vue';

const shelfStore = useShelfStore()

const pageSize = 10
const shelfCurrentPage = ref(1)

const shelfTotalPages = computed(() =>
    Math.max(1, Math.ceil(shelfStore.books.length / pageSize))
)

const paginatedBooks = computed(() => {
    const start = (shelfCurrentPage.value - 1) * pageSize
    return shelfStore.books.slice(start, start + pageSize)
})

function setShelfPage(page: number) {
    if (page >= 1 && page <= shelfTotalPages.value) {
        shelfCurrentPage.value = page
    }
}

watch(() => shelfStore.books.length, () => {
    if (shelfCurrentPage.value > shelfTotalPages.value) {
        shelfCurrentPage.value = 1
    }
})
</script>

<style scoped>
.books {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
    gap: 24px;
    padding: 24px 0;
}

.empty {
    color: #999;
    font-size: 16px;
    padding: 48px 0;
    text-align: center;
}
</style>
