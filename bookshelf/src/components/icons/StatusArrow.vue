<template>
    <svg class="status-btn__arrow" :class="{ 'status-btn__arrow--open': open }" width="12" height="12"
        viewBox="0 0 12 12" fill="none">
        <path d="M2 4l4 4 4-4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"
            stroke-linejoin="round" />
    </svg>
</template>

<script setup lang="ts">
defineProps<{ open: boolean }>()
</script>