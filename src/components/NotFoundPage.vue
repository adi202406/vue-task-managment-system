<script setup>
import { computed } from 'vue'
import { RouterLink } from 'vue-router'

import { useAuthStore } from '../stores/auth'

defineProps({
  message: {
    type: String,
    default: 'Halaman yang Anda cari tidak tersedia atau telah dipindahkan.',
  },
})

const authStore = useAuthStore()
const backTo = computed(() => (authStore.isAuthenticated ? '/workspaces' : '/login'))
const backLabel = computed(() => (authStore.isAuthenticated ? 'Kembali ke Workspaces' : 'Kembali ke Login'))
</script>

<template>
  <main class="flex min-h-screen items-center justify-center bg-[#030712] px-6 text-white">
    <div class="w-full max-w-lg rounded-[28px] border border-white/10 bg-white/[0.04] px-8 py-14 text-center shadow-[0_30px_80px_rgba(0,0,0,0.28)]">
      <div class="mx-auto grid h-20 w-20 place-items-center rounded-full border border-slate-400/30 bg-slate-400/10 text-2xl font-bold tracking-tight text-slate-300">
        404
      </div>
      <h2 class="mt-6 text-2xl font-semibold">Halaman Tidak Ditemukan</h2>
      <p class="mt-3 text-sm leading-6 text-slate-400">{{ message }}</p>
      <RouterLink
        :to="backTo"
        class="mt-6 inline-flex h-11 items-center rounded-xl bg-white px-5 text-sm font-semibold text-slate-950 transition hover:bg-white/90"
      >
        {{ backLabel }}
      </RouterLink>
    </div>
  </main>
</template>
