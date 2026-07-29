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

            <div class="card__rating" v-if="rating">
                <IconStar /> {{ rating }}
            </div>

            <p class="card__description">{{ shortDescription }}</p>
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import type { Book } from '@/types/book'
import { IconStar } from '@/components/icons'
import { useBookInfo } from '@/composables/useBookInfo'


const props = defineProps<{ book: Book }>()
const router = useRouter()
const { thumbnail, authors, description, rating } = useBookInfo(() => props.book)

const year = computed(() =>
    props.book.volumeInfo.publishedDate?.slice(0, 4) ?? ''
)

const goToBook = () => {
    router.push(`/book/${props.book.id}`)
}

const shortDescription = computed(() => description.value.length > 120 ? description.value.slice(0, 120) + '...' : description.value)
</script>

<style scoped lang="scss">
@use '@/assets/styles/variables' as *;
@use '@/assets/styles/mixins' as *;

.card {
    cursor: pointer;
    border-radius: $radius-md;
    overflow: hidden;
    background: $color-white;
    box-shadow: $shadow-card;
    transition: transform $transition-fast, box-shadow $transition-fast;
    display: flex;
    flex-direction: column;
}

.card:hover {
    transform: translateY(-4px);
    box-shadow: $shadow-card-hover;
}

.card__cover {
    height: 200px;
    background: $color-cover-bg;
    @include flex-center;
}

.card__img {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

.card__no-img {
    color: $color-placeholder;
    font-size: $font-size-base;
}

.card__info {
    padding: $spacing-md;
    display: flex;
    flex-direction: column;
    gap: $spacing-sm;
    flex: 1;
}

.card__title {
    font-size: $font-size-md;
    font-weight: $font-weight-semibold;
    line-height: 1.3;
    margin: 0;
    @include text-clamp(2);
}

.card__authors {
    font-size: $font-size-base;
    color: $color-text-muted;
    margin: 0;
}

.card__year {
    font-size: $font-size-sm;
    color: $color-text-light;
    margin: 0;
}

.card__rating {
    font-size: $font-size-base;
}

.card__description {
    font-size: $font-size-base;
    color: $color-text-secondary;
    line-height: 1.5;
    margin: 0;
}
</style>