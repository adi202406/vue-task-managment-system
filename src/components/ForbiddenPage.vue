<script setup>
import { RouterLink } from 'vue-router'

defineProps({
  message: {
    type: String,
    default: 'Anda tidak memiliki akses ke halaman ini.',
  },
})
</script>

<template>
  <main class="flex min-h-screen items-center justify-center bg-[#030712] px-6 text-white">
    <div class="w-full max-w-lg rounded-[28px] border border-white/10 bg-white/[0.04] px-8 py-14 text-center shadow-[0_30px_80px_rgba(0,0,0,0.28)]">
      <div class="mx-auto grid h-20 w-20 place-items-center rounded-full border border-amber-400/30 bg-amber-400/10 text-4xl text-amber-300">!</div>
      <h2 class="mt-6 text-2xl font-semibold">Akses Ditolak</h2>
      <p class="mt-3 text-sm leading-6 text-slate-400">{{ message }}</p>
      <RouterLink
        to="/workspaces"
        class="mt-6 inline-flex h-11 items-center rounded-xl bg-white px-5 text-sm font-semibold text-slate-950 transition hover:bg-white/90"
      >
        Kembali ke Workspaces
      </RouterLink>
    </div>
  </main>
</template>
