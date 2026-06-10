<template>
    <main>
        <h1 class="title">Моя полка ({{ shelfStore.totalBooks }})</h1>

        <div v-if="shelfStore.books.length === 0" class="empty">
            Здесь пока нет книг
        </div>

        <div class="books" v-else>
            <BookCard
                v-for="book in shelfStore.books"
                :key="book.id"
                :book="book"
            />
        </div>
    </main>
</template>

<script setup lang='ts'>
import { useShelfStore } from '@/stores/shelf';
import BookCard from '@/components/book/BookCard.vue';

const shelfStore = useShelfStore()
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
