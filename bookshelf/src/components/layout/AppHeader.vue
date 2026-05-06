<template>
    <header>
        <div class="wrap">
            <div class="logo">
                <Applogo />
            </div>
            <div class="btn-wrap">
                <button class="btn btn-in">Вход</button>
                <button class="btn btn-reg">Регистрация</button>
            </div>
        </div>
    </header>
</template>

<script setup lang='ts'>
import Applogo from '../icons/Applogo.vue';


</script>

<style scoped>
.wrap {
    display: flex;
    justify-content: space-between;
}

.btn-wrap {
    display: flex;
    gap: 20px;
}
</style>