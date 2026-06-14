<template>
    <main>
        <h1 class="title">Каталог книг</h1>

        <div v-if="store.isFetching">Загрузка...</div>
        <div v-else-if="store.error">
            {{ store.error }}
            <button @click="store.fetchBooks()">Попробовать снова</button>
        </div>

        <div class="books" v-else>
            <BookCard v-for="book in store.filteredBooks" :key="book.id" :book="book" />
        </div>
    </main>
</template>

<script setup lang='ts'>
import { useBookStore } from '@/stores/books';
import BookCard from '@/components/book/BookCard.vue';
import { onMounted } from 'vue';

const store = useBookStore()

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