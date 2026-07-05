<template>
    <main>
        <h1 class="title">Каталог книг</h1>

        <div v-if="store.isFetching">Загрузка...</div>
        <div v-else-if="store.error">
            {{ store.error }}
            <button @click="store.fetchBooks()">Попробовать снова</button>
        </div>

        <div class="books" v-else>
            <BookCard v-for="book in store.displayBooks" :key="book.id" :book="book" />
        </div>

        <Pagination
            v-if="!store.isFetching && store.totalPages > 1"
            :current-page="store.currentPage"
            :total-pages="store.totalPages"
            @page-change="store.setPage"
        />
    </main>
</template>

<script setup lang='ts'>
import { useBookStore } from '@/stores/books';
import BookCard from '@/components/book/BookCard.vue';
import Pagination from '@/components/pagination/Pagination.vue';
import { onMounted, watch } from 'vue';
import { useRoute } from 'vue-router';

const store = useBookStore()
const route = useRoute()

watch(() => route.query.genre, (genre) => {
    store.selectedGenre = typeof genre === 'string' ? genre : null
    store.setPage(1)
}, { immediate: true })

onMounted(() => store.fetchBooks())
</script>

<style scoped>
.books {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
    gap: 24px;
    padding: 24px 0;
}
</style>