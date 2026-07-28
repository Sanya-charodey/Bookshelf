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
                    <button class="btn btn-out" @click="auth.logout()">Выйти</button>
                </template>

                <template v-else>
                    <button class="btn btn-in" @click="auth.login()">Вход</button>
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
}

.btn-wrap {
    display: flex;
    gap: $spacing-xl;
}

.logo-link {
    text-decoration: none;
}
</style>