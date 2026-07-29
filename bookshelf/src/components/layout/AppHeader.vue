<template>
    <header>
        <div class="wrap">
            <div class="logo">
                <router-link to="/" class="logo-link">
                    <Applogo />
                </router-link>
            </div>
            <div class="btn-wrap">
                <template v-if="auth.isAuthenticated">
                    <span class="user-name">Привет, {{ auth.user?.name }}</span>
                    <button class="btn btn--secondary" @click="auth.logout()">Выйти</button>
                </template>

                <template v-else>
                    <button class="btn btn--primary" @click="auth.login()">Вход</button>
                </template>
            </div>
        </div>
    </header>
</template>

<script setup lang='ts'>
import { useAuthStore } from '@/stores/auth';
import Applogo from '../icons/Applogo.vue';

const auth = useAuthStore()
</script>

<style scoped lang="scss">
@use '@/assets/styles/variables' as *;

.wrap {
    display: flex;
    justify-content: space-between;
    padding: 0 $spacing-base;
}

.btn-wrap {
    display: flex;
    gap: $spacing-xl;
    align-items: center;
}

.logo-link {
    text-decoration: none;
}

.btn {
    padding: $spacing-sm $spacing-md;
    border-radius: $radius-sm;
    font-size: $font-size-btn;
    cursor: pointer;
    background: transparent;
    transition: border-color $transition-fast, color $transition-fast, background $transition-fast;
}

.btn--primary {
    border: 1px solid $color-primary;
    color: $color-primary;

    &:hover {
        background: $hover-bg;
    }
}

.btn--secondary {
    border: 1px solid $color-border;
    color: $color-text-muted;

    &:hover {
        border-color: $color-primary;
        color: $color-primary;
        background: $hover-bg-subtle;
    }
}
</style>