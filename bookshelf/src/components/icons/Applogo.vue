<script setup lang="ts">
const props = withDefaults(defineProps<{
    size?: number
    showText?: boolean
}>(), {
    size: 36,
    showText: true
})
</script>

<template>
    <div class="logo" :style="{ gap: props.showText ? '10px' : '0' }">
        <svg :width="props.size" :height="props.size" viewBox="0 0 36 36" fill="none"
            xmlns="http://www.w3.org/2000/svg">

            <rect x="2" y="26" width="32" height="4" rx="1.5" fill="#8B6F47" />

            <rect x="3" y="10" width="6" height="16" rx="1.5" fill="#1a3a5c" />
            <rect x="3" y="10" width="2" height="16" rx="1" fill="#2a5a8c" />

            <rect x="11" y="6" width="6" height="20" rx="1.5" fill="#1d5c3a" />
            <rect x="11" y="6" width="2" height="20" rx="1" fill="#2a8a55" />

            <rect x="15" y="4" width="2" height="7" rx="0.5" fill="#e8c040" />
            <polygon points="15,11 16,9 17,11" fill="#e8c040" />

            <rect x="19" y="12" width="5" height="14" rx="1.5" fill="#5c1a6b" />
            <rect x="19" y="12" width="2" height="14" rx="1" fill="#8a2aa0" />

            <rect x="26" y="9" width="7" height="17" rx="1.5" fill="#8c1a1a" />
            <rect x="26" y="9" width="2" height="17" rx="1" fill="#c02a2a" />
        </svg>

        <span v-if="props.showText" class="logo-text">Bookshelf</span>
    </div>
</template>
<style scoped>
.logo {
    display: flex;
    align-items: center;
    text-decoration: none;
    cursor: pointer;
}

.logo-text {
    font-family: Georgia, 'Times New Roman', serif;
    font-size: 1.3rem;
    font-weight: 700;
    color: var(--color-text-primary, #1a1a1a);
    letter-spacing: 0.02em;
    user-select: none;
}
</style>