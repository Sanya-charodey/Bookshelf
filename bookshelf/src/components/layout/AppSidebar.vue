<template>
    <aside class="sidebar">

        <div class="sidebar__wrap-btn">
            <RouterLink v-if="authStore.isAuthenticated" to="/shelf" class="sidebar__my-book">Мои книги</RouterLink>
            <form class="sidebar__search" @submit.prevent>
                <input class="sidebar__input" type="search" placeholder="Поиск" v-model="store.searchQuery"
                    @input="onSearch">
            </form>
        </div>

        <span class="sidebar__text">Жанры:</span>

        <div class="sidebar__genres">
            <label
                v-for="genre in GENRES"
                :key="genre.value"
                class="sidebar__genre"
                :class="{ 'sidebar__genre--checked': genreStore.isSelected(genre.value) }"
            >
                <input
                    type="checkbox"
                    class="sidebar__checkbox"
                    :checked="genreStore.isSelected(genre.value)"
                    @change="genreStore.toggle(genre.value)"
                />
                {{ genre.label }}
            </label>
        </div>

        <button
            v-if="genreStore.hasSelection"
            class="sidebar__clear"
            @click="genreStore.clear()"
        >
            Сбросить жанры
        </button>
    </aside>
</template>

<script setup lang='ts'>
import { useAuthStore } from '@/stores/auth';
import { useBookStore } from '@/stores/books';
import { useGenreStore, GENRES } from '@/stores/genres';

const authStore = useAuthStore()
const store = useBookStore()
const genreStore = useGenreStore()

let debounceTimer: ReturnType<typeof setTimeout>

const onSearch = () => {
    clearTimeout(debounceTimer)
    debounceTimer = setTimeout(async () => {
        await store.fetchSearchBooks()
    }, 500)
}
</script>

<style scoped>
.sidebar {
    display: flex;
    flex-direction: column;
    gap: 10px;
}

.sidebar__genres {
    display: flex;
    flex-direction: column;
    gap: 4px;
    padding-bottom: 16px;
}

.sidebar__genre {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 6px 8px;
    border-radius: 6px;
    cursor: pointer;
    font-size: 14px;
    color: #333;
    transition: background 0.15s;
}

.sidebar__genre:hover {
    background: #f0f4ff;
}

.sidebar__genre--checked {
    color: #4a90d9;
    font-weight: 500;
}

.sidebar__checkbox {
    accent-color: #4a90d9;
}

.sidebar__clear {
    background: none;
    border: 1px solid #ddd;
    border-radius: 6px;
    padding: 6px 12px;
    font-size: 13px;
    color: #666;
    cursor: pointer;
    transition: all 0.15s;
}

.sidebar__clear:hover {
    border-color: #999;
    color: #333;
}
</style>