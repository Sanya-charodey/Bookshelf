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

<style scoped lang="scss">
@use '@/assets/styles/variables' as *;

.sidebar {
    display: flex;
    flex-direction: column;
    gap: 10px;
    padding: 0 $spacing-base;
}

.sidebar__text {
    font-size: $font-size-sm;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    color: $color-text-light;
    padding-top: $spacing-md;
    border-top: 1px solid $color-border;
}

.sidebar__genres {
    display: flex;
    flex-direction: column;
    gap: $spacing-sm;
    padding-bottom: 16px;
}

.sidebar__genre {
    display: block;
    padding: 8px 12px;
    border: 1px solid $color-border;
    border-radius: $radius-sm;
    cursor: pointer;
    font-size: $font-size-btn;
    color: $color-text-primary;
    background: $color-white;
    transition: border-color $transition-fast, background $transition-fast;
}

.sidebar__genre:hover {
    border-color: $color-primary;
    background: rgba($color-primary, 0.04);
}

.sidebar__genre--checked {
    border-color: $color-primary;
    color: $color-primary;
    font-weight: 500;
    background: rgba($color-primary, 0.06);
}

.sidebar__checkbox {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border: 0;
}

.sidebar__wrap-btn {
    display: flex;
    flex-direction: column;
    gap: 10px;
}

.sidebar__search {
    display: flex;
}

.sidebar__input {
    flex: 1;
    padding: 8px 12px;
    border: 1px solid $color-border;
    border-radius: $radius-sm;
    font-size: $font-size-btn;
    color: $color-text-primary;
    background: $color-white;
    outline: none;
    transition: border-color $transition-fast;

    &::placeholder {
        color: $color-placeholder;
    }

    &:focus {
        border-color: $color-primary;
    }

    &::-webkit-search-cancel-button {
        cursor: pointer;
    }
}

.sidebar__my-book {
    display: block;
    padding: 8px 16px;
    border: 1px solid $color-primary;
    border-radius: $radius-sm;
    color: $color-primary;
    font-size: $font-size-btn;
    font-weight: 500;
    text-align: center;
    text-decoration: none;
    background: transparent;
    transition: all $transition-fast;

    &:hover {
        background: rgba($color-primary, 0.06);
    }
}

.sidebar__clear {
    display: block;
    padding: 8px 12px;
    border: 1px solid $color-border;
    border-radius: $radius-sm;
    font-size: $font-size-btn;
    color: $color-text-muted;
    background: $color-white;
    cursor: pointer;
    transition: border-color $transition-fast, background $transition-fast, color $transition-fast;

    &:hover {
        border-color: $color-primary;
        color: $color-primary;
        background: rgba($color-primary, 0.04);
    }
}
</style>