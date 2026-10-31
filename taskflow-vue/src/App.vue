<script setup lang="ts">
import { watch } from 'vue'
import { useAppStore } from '@/stores/app'
const store = useAppStore()
let pending: ReturnType<typeof setTimeout> | undefined
watch(() => store.toast, () => {
  if (pending) clearTimeout(pending)
  if (store.toast) pending = setTimeout(() => { store.toast = '' }, 3000)
})
</script>

<template>
  <RouterView />
  <Transition name="toast"><div v-if="store.toast" class="app-toast" role="status">✓ {{ store.toast }}</div></Transition>
</template>
