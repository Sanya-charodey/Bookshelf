<template>
    <main>
        <h1 class="title">Каталог книг</h1>

        <div v-if="loading">Загрузка...</div>
        <div v-else-if="error">{{ error }}</div>

        <div class="books" v-else>
            <BookCard v-for="book in store.books" :key="book.id" :book="book" />
        </div>
    </main>
</template>

<script setup lang='ts'>
import { useBookStore } from '@/stores/books';
import BookCard from '@/components/book/BookCard.vue';
import { onMounted, ref } from 'vue';

const store = useBookStore()
const loading = ref(false)
const error = ref<string | null>(null)

onMounted(async () => {
    loading.value = true
    try {
        await store.fetchBooks('subject:fantasy')
        console.log('количество книг:', store.books.length)
    } catch {
        error.value = 'Не удалось загрузить книги'
    } finally {
        loading.value = false
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
</style>