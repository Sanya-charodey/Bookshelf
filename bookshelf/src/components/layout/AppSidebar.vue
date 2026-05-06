<template>
    <aside class="sidebar">

        <div class="sidebar__wrap-btn">
            <button class="sidebar__my-book">Мои книги</button>
            <form class="sidebar__search">
                <input class="sidebar__input" type="search" placeholder="Поиск">
            </form>
        </div>

        <span class="sidebar__text">Библиотека</span>

        <nav class="sidebar__nav" aria-label="Навигация по жанрам">
            <ul class="sidebar__list">
                <li class="sidebar__item" v-for="genre in store.allGenres" :key="genre">
                    {{ genre }}
                </li>
            </ul>
        </nav>

    </aside>
</template>

<script setup lang='ts'>
import { useBookStore } from '@/stores/books';

const store = useBookStore()
</script>

<style scoped>
.sidebar {
    display: flex;
    flex-direction: column;
    gap: 10px;
}
</style>