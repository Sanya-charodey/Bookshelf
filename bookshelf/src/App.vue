<template>
    <div class="app">
        <AppHeader class="app__header" />

        <div class="app__body">
            <AppSidebar class="app__sidebar" />
            <main class="app__main">
                <RouterView />
            </main>
        </div>
    </div>
</template>

<script setup lang='ts'>
import AppHeader from './components/layout/AppHeader.vue';
import AppSidebar from './components/layout/AppSidebar.vue';



</script>

<style scoped>
.app {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    padding: 0 30px;
}

.app__header {
    height: 64px;
    flex-shrink: 0;
    padding: 20px 0 0 0;
}

.app__body {
    flex: 1;
    display: flex;
    overflow: hidden;
}

.app__sidebar {
    width: 240px;
    flex-shrink: 0;
    overflow-y: auto;
}

.app__main {
    flex: 1;
    padding: 24px 32px;
    overflow-y: auto;
}
</style>