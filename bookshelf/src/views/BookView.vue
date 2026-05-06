<template>
    <main class="book-view">
        <button class="back-btn" @click="router.back()">← Назад</button>

        <div v-if="loading" class="state">Загрузка...</div>
        <div v-else-if="error" class="state">{{ error }}</div>

        <div v-else-if="store.selectBook" class="book">
            <div class="book__cover">
                <img v-if="thumbnail" :src="thumbnail" :alt="store.selectBook.volumeInfo.title" class="book__img" />
                <div v-else class="book__no-img">Нет обложки</div>
            </div>

            <div class="book__info">
                <h1 class="book__title">{{ store.selectBook.volumeInfo.title }}</h1>
                <p class="book__authors">{{ authors }}</p>

                <div class="book__meta">
                    <span v-if="store.selectBook.volumeInfo.publishedDate">
                        📅 {{ store.selectBook.volumeInfo.publishedDate.slice(0, 4) }}
                    </span>
                    <span v-if="store.selectBook.volumeInfo.pageCount">
                        📖 {{ store.selectBook.volumeInfo.pageCount }} стр.
                    </span>
                    <span v-if="store.selectBook.volumeInfo.averageRating">
                        ⭐ {{ store.selectBook.volumeInfo.averageRating }}
                    </span>
                </div>

                <div class="book__categories" v-if="store.selectBook.volumeInfo.categories?.length">
                    <span class="book__category" v-for="cat in store.selectBook.volumeInfo.categories" :key="cat">
                        {{ cat }}
                    </span>
                </div>

                <p class="book__description">{{ description }}</p>

                <a>
                    v-if="store.selectBook.volumeInfo.previewLink"
                    :href="store.selectBook.volumeInfo.previewLink"
                    target="_blank"
                    class="book__link"
                    >
                    Читать превью →
                </a>
            </div>
        </div>
    </main>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useBookStore } from '@/stores/books'
import { useBookInfo } from '@/composables/useBookInfo'

const store = useBookStore()
const route = useRoute()
const router = useRouter()
const { thumbnail, authors, description } = useBookInfo(store.selectBook!)

const loading = ref(false)
const error = ref<string | null>(null)

const id = route.params.id as string

onMounted(async () => {
    loading.value = true
    try {
        await store.fetchBookId(id)
    } catch {
        error.value = 'Не удалось загрузить книгу'
    } finally {
        loading.value = false
    }
})
</script>

<style scoped>
.book-view {
    padding: 24px 32px;
}

.back-btn {
    background: none;
    border: none;
    cursor: pointer;
    font-size: 14px;
    color: #666;
    margin-bottom: 24px;
    padding: 0;
}

.back-btn:hover {
    color: #000;
}

.state {
    text-align: center;
    color: #999;
    margin-top: 60px;
}

.book {
    display: flex;
    gap: 40px;
}

.book__cover {
    flex-shrink: 0;
    width: 200px;
    height: 300px;
    border-radius: 8px;
    overflow: hidden;
    background: #f0f0f0;
    display: flex;
    align-items: center;
    justify-content: center;
}

.book__img {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

.book__no-img {
    color: #aaa;
    font-size: 14px;
}

.book__info {
    display: flex;
    flex-direction: column;
    gap: 12px;
}

.book__title {
    font-size: 24px;
    font-weight: 700;
    margin: 0;
    line-height: 1.3;
}

.book__authors {
    font-size: 15px;
    color: #666;
    margin: 0;
}

.book__meta {
    display: flex;
    gap: 16px;
    font-size: 14px;
    color: #555;
}

.book__categories {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
}

.book__category {
    background: #f0f0f0;
    border-radius: 20px;
    padding: 4px 12px;
    font-size: 13px;
    color: #444;
}

.book__description {
    font-size: 15px;
    line-height: 1.7;
    color: #333;
    margin: 0;
    max-width: 600px;
}

.book__link {
    display: inline-block;
    margin-top: 8px;
    color: #2563eb;
    font-size: 14px;
    text-decoration: none;
}

.book__link:hover {
    text-decoration: underline;
}
</style>