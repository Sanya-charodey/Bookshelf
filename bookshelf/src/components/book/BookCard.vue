<template>
    <div class="card" @click="goToBook">
        <div class="card__cover">
            <img v-if="thumbnail" :src="thumbnail" :alt="book.volumeInfo.title" class="card__img" />
            <div v-else class="card__no-img">Нет обложки</div>
        </div>

        <div class="card__info">
            <h3 class="card__title">{{ book.volumeInfo.title }}</h3>
            <p class="card__authors">{{ authors }}</p>
            <p class="card__year">{{ year }}</p>

            <div class="card__rating" v-if="book.volumeInfo.averageRating">
                ⭐ {{ book.volumeInfo.averageRating }}
            </div>

            <p class="card__description">{{ description }}</p>
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import type { Book } from '@/types/book'
import { useBookInfo } from '@/composables/useBookInfo'


const props = defineProps<{ book: Book }>()
const router = useRouter()
const { thumbnail, authors, description } = useBookInfo(props.book)

const year = computed(() =>
    props.book.volumeInfo.publishedDate?.slice(0, 4) ?? ''
)

const goToBook = () => {
    router.push(`/book/${props.book.id}`)
}
</script>

<style scoped>
.card {
    cursor: pointer;
    border-radius: 12px;
    overflow: hidden;
    background: #fff;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
    transition: transform 0.2s, box-shadow 0.2s;
    display: flex;
    flex-direction: column;
}

.card:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.14);
}

.card__cover {
    height: 200px;
    background: #f0f0f0;
    display: flex;
    align-items: center;
    justify-content: center;
}

.card__img {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

.card__no-img {
    color: #aaa;
    font-size: 14px;
}

.card__info {
    padding: 16px;
    display: flex;
    flex-direction: column;
    gap: 6px;
    flex: 1;
}

.card__title {
    font-size: 15px;
    font-weight: 600;
    line-height: 1.3;
    margin: 0;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
    line-clamp: 2;
}

.card__authors {
    font-size: 13px;
    color: #666;
    margin: 0;
}

.card__year {
    font-size: 12px;
    color: #999;
    margin: 0;
}

.card__rating {
    font-size: 13px;
}

.card__description {
    font-size: 13px;
    color: #555;
    line-height: 1.5;
    margin: 0;
}
</style>