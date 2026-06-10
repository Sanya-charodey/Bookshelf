<template>
    <aside class="sidebar">

        <div class="sidebar__wrap-btn">
            <button v-if="authStore.isAuthenticated" class="sidebar__my-book">Мои книги</button>
            <form class="sidebar__search" @submit.prevent>
                <input class="sidebar__input" type="search" placeholder="Поиск" v-model="store.searchQuery"
                    @input="onSearch">
            </form>
        </div>

        <span class="sidebar__text">Жанры:</span>

        <nav class="sidebar__nav" aria-label="Навигация по жанрам">
            <ul class="sidebar__list">
                <li class="sidebar__item" v-for="genre in store.allGenres" :key="genre"
                    :class="{ 'sidebar__item--active': store.selectedGenre === genre }"
                    @click="store.selectGenre(genre)">
                    {{ genre }}
                </li>
            </ul>
        </nav>

    </aside>
</template>

<script setup lang='ts'>
import { useAuthStore } from '@/stores/auth';
import { useBookStore } from '@/stores/books';

const authStore = useAuthStore()
const store = useBookStore()

let debounceTimer: ReturnType<typeof setTimeout>

const onSearch = () => {
    clearTimeout(debounceTimer)
    debounceTimer = setTimeout(() => {
        store.fetchSearchBooks()
    }, 500)
}
</script>

<style scoped>
.sidebar {
    display: flex;
    flex-direction: column;
    gap: 10px;
}

.sidebar__item {
    cursor: pointer;
}

.sidebar__item--active {
    font-weight: bold;
    color: darkblue
}
</style>