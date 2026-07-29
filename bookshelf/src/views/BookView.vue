<template>
    <main class="book-view">
        <button class="back-btn" @click="router.back()">← Назад</button>

        <div v-if="store.isFetching" class="state">Загрузка...</div>
        <div v-else-if="store.error" class="state">{{ store.error }}</div>

        <div v-else-if="store.selectBook" class="book">
            <div class="book__wrap">
                <div class="book__cover">
                    <img v-if="thumbnail" :src="thumbnail" :alt="store.selectBook.volumeInfo.title" class="book__img" />
                    <div v-else class="book__no-img">Нет обложки</div>
                </div>

                <div class="book__status">
                    <button class="status-btn" :class="{ 'status-btn--active': selectedStatus }"
                        @click.stop="toggleDropdown">
                        <span>{{ selectedStatus ? statusLabel : '+ В список' }}</span>
                        <StatusArrow :open="dropdownOpen" />
                    </button>

                    <div v-if="dropdownOpen" class="status-dropdown">
                        <template v-if="!authStore.isAuthenticated && !selectedStatus">
                            <div class="status-dropdown__prompt">
                                Войдите, чтобы добавлять книги на полку
                            </div>
                            <button class="status-dropdown__login" @click="authStore.login(); dropdownOpen = false">
                                Войти
                            </button>
                        </template>

                        <template v-else>
                            <button v-for="option in statusOptions" :key="option.value" class="status-dropdown__item"
                                :class="{ 'status-dropdown__item--active': selectedStatus === option.value }"
                                @click="selectStatus(option.value)">
                                <component :is="option.icon" class="status-dropdown__icon" />
                                {{ option.label }}
                                <span v-if="selectedStatus === option.value" class="status-dropdown__check">✓</span>
                            </button>

                            <div v-if="selectedStatus" class="status-dropdown__divider"></div>
                            <button v-if="selectedStatus" class="status-dropdown__remove" @click="removeStatus">
                                Удалить из списка
                            </button>
                        </template>
                    </div>
                </div>
            </div>

            <div class="book__info">
                <h1 class="book__title">{{ store.selectBook.volumeInfo.title }}</h1>
                <p class="book__authors">{{ authors }}</p>

                <div class="book__meta">
                    <span v-if="store.selectBook.volumeInfo.publishedDate">
                        <IconCalendar />{{ store.selectBook.volumeInfo.publishedDate.slice(0, 4) }}
                    </span>
                    <span v-if="store.selectBook.volumeInfo.pageCount">
                        <IconPages /> {{ store.selectBook.volumeInfo.pageCount }} стр.
                    </span>
                    <span v-if="rating">
                        <IconStar /> {{ rating }}
                    </span>
                </div>

                <div class="book__categories" v-if="store.selectBook.volumeInfo.categories?.length">
                    <RouterLink 
                        class="book__category" 
                        v-for="cat in store.selectBook.volumeInfo.categories" 
                        :key="cat"
                        :to="{ name: 'Home' }" 
                        @click="goToCategory(cat)"
                    >
                        {{ cat }}
                    </RouterLink>
                </div>

                <p class="book__description">{{ description }}</p>

                <a v-if="store.selectBook.volumeInfo.previewLink" :href="store.selectBook.volumeInfo.previewLink"
                    target="_blank" class="book__link">
                    Читать превью →
                </a>
            </div>
        </div>
    </main>
</template>

<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useBookStore } from '@/stores/books'
import { useGenreStore } from '@/stores/genres'
import { useBookInfo } from '@/composables/useBookInfo'
import type { StatusValue, StatusOption } from '@/types/status'
import { IconCalendar, IconFinished, IconPages, IconPlanned, IconReading, StatusArrow, IconStar } from '@/components/icons/'
import { useStatusStore } from '@/stores/status'
import { useShelfStore } from '@/stores/shelf'
import { useAuthStore } from '@/stores/auth'

const store = useBookStore()
const genreStore = useGenreStore()
const route = useRoute()
const router = useRouter()
const { thumbnail, authors, description, rating } = useBookInfo(() => store.selectBook)
const statusStore = useStatusStore()
const shelfStore = useShelfStore()
const authStore = useAuthStore()

const statusOptions: StatusOption[] = [
    { value: 'planned', label: 'Планирую прочесть', icon: IconPlanned },
    { value: 'reading', label: 'Читаю', icon: IconReading },
    { value: 'finished', label: 'Прочитано', icon: IconFinished },
]

const id = typeof route.params.id === 'string' ? route.params.id : ''

const dropdownOpen = ref(false)

const selectedStatus = computed(() => statusStore.getStatus(id))

const statusLabel = computed(() =>
    statusOptions.find(o => o.value === selectedStatus.value)?.label ?? ''
)

function goToCategory(cat: string) {
    genreStore.clear()
    store.setQuery(`subject:${cat}`)
    router.push({ name: 'Home' })
}

function toggleDropdown() {
    dropdownOpen.value = !dropdownOpen.value
}

function handleClickOutside(e: MouseEvent) {
    if (!(e.target instanceof Node)) return

    const target = e.target as Element
    if (!dropdownOpen.value || target.closest('.book__status')) {
        return
    }

    dropdownOpen.value = false
}

function selectStatus(value: StatusValue) {
    statusStore.setStatus(id, value)
    if (store.selectBook) {
        shelfStore.addBook(store.selectBook)
    }
    dropdownOpen.value = false
}

function removeStatus() {
    statusStore.removeStatus(id)
    shelfStore.removeBook(id)
    dropdownOpen.value = false
}

onMounted(async () => {
    store.fetchBookId(id)
    document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
    document.removeEventListener('click', handleClickOutside)
})
</script>

<style scoped lang="scss">
@use '@/assets/styles/variables' as *;
@use '@/assets/styles/mixins' as *;

.book-view {
    padding: $spacing-lg 32px;
}

.back-btn {
    background: none;
    border: none;
    cursor: pointer;
    font-size: $font-size-btn;
    color: $color-text-muted;
    margin-bottom: $spacing-lg;
    padding: 0;
}

.back-btn:hover {
    color: $color-black;
}

.state {
    text-align: center;
    color: $color-text-light;
    margin-top: 60px;
}

.book {
    display: flex;
    gap: 40px;
    align-items: flex-start;
}

.book__cover {
    flex-shrink: 0;
    width: 200px;
    height: 300px;
    border-radius: $radius-sm;
    overflow: hidden;
    background: $color-cover-bg;
    @include flex-center;
}

.book__img {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

.book__no-img {
    color: $color-placeholder;
    font-size: $font-size-btn;
}

.book__wrap {
    display: flex;
    flex-direction: column;
    gap: $spacing-base;
}

.book__info {
    display: flex;
    flex-direction: column;
    gap: $spacing-base;
    flex: 1;
    min-width: 0;
}

.book__title {
    font-size: $font-size-xl;
    font-weight: 700;
    margin: 0;
    line-height: 1.3;
}

.book__authors {
    font-size: $font-size-md;
    color: $color-text-muted;
    margin: 0;
}

.book__meta {
    display: flex;
    gap: $spacing-md;
    font-size: $font-size-btn;
    color: $color-text-secondary;
}

.book__categories {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
}

.book__category {
    background: $color-cover-bg;
    border-radius: $radius-lg;
    padding: 4px $spacing-base;
    font-size: $font-size-base;
    color: $color-text-tertiary;
}

.book__description {
    font-size: $font-size-md;
    line-height: 1.7;
    color: $color-text-primary;
    margin: 0;
    max-width: 600px;
}

.book__link {
    display: inline-block;
    margin-top: 8px;
    color: $color-link;
    font-size: $font-size-btn;
    text-decoration: none;
}

.book__link:hover {
    text-decoration: underline;
}

.status-btn {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 8px;
    padding: 8px $spacing-base;
    border: 1px solid $color-primary;
    border-radius: $radius-sm;
    font-size: $font-size-btn;
    color: $color-primary;
    background: transparent;
    cursor: pointer;
    transition: background $transition-fast;

    &:hover {
        background: rgba($color-primary, 0.06);
    }
}

.status-btn--active {
    background: rgba($color-primary, 0.06);
}

.status-dropdown {
    display: flex;
    flex-direction: column;
    border: 1px solid $color-border;
    border-radius: $radius-sm;
    overflow: hidden;
    background: $color-white;
}

.status-dropdown__item {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 8px $spacing-base;
    border: none;
    font-size: $font-size-btn;
    color: $color-text-primary;
    background: none;
    cursor: pointer;
    transition: background $transition-fast;

    &:hover {
        background: $color-cover-bg;
    }
}

.status-dropdown__item--active {
    color: $color-primary;
    font-weight: 500;
}

.status-dropdown__icon {
    flex-shrink: 0;
}

.status-dropdown__check {
    margin-left: auto;
    color: $color-primary;
}

.status-dropdown__divider {
    height: 1px;
    background: $color-border;
    margin: 4px 0;
}

.status-dropdown__remove {
    display: block;
    width: 100%;
    padding: 8px $spacing-base;
    border: none;
    font-size: $font-size-btn;
    color: #e74c3c;
    background: none;
    cursor: pointer;
    transition: background $transition-fast;

    &:hover {
        background: $color-cover-bg;
    }
}

.status-dropdown__prompt {
    padding: $spacing-base $spacing-md;
    color: $color-text-muted;
    font-size: $font-size-base;
    text-align: center;
}

.status-dropdown__login {
    width: 100%;
    padding: 10px $spacing-md;
    background: $color-link;
    color: $color-white;
    border: none;
    cursor: pointer;
    font-size: $font-size-btn;
    font-weight: 500;
}

.status-dropdown__login:hover {
    background: $color-link-hover;
}
</style>
