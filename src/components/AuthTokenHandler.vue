<script setup>
import { computed, onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'

import { useAuthStore } from '../stores/auth'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()

const errorMessage = ref('')

function getHashParams(hash) {
  const normalizedHash = hash.startsWith('#') ? hash.slice(1) : hash
  return Object.fromEntries(new URLSearchParams(normalizedHash))
}

/**
 * Laravel kadang mengirim redirect URL yang malformed:
 *   /login?redirect=/workspaces?token=xxx
 * sehingga `token` ikut masuk ke nilai `route.query.redirect`.
 * Fungsi ini mengekstrak token dari semua kemungkinan lokasi di URL.
 */
function extractPayloadFromUrl() {
  // 1. Coba dari hash fragment (#token=... atau #access_token=...)
  const hashParams = getHashParams(route.hash)

  // 2. Query params langsung (?token=... atau ?access_token=...)
  const queryParams = { ...route.query }

  // 3. Token tersembunyi di dalam nilai redirect (?redirect=/workspaces?token=xxx)
  let embeddedParams = {}
  const redirectValue = route.query.redirect
  if (typeof redirectValue === 'string' && redirectValue.includes('?')) {
    const embeddedSearch = redirectValue.slice(redirectValue.indexOf('?'))
    embeddedParams = Object.fromEntries(new URLSearchParams(embeddedSearch))
  }

  return { ...embeddedParams, ...hashParams, ...queryParams }
}

function resolveRedirectTarget(payload) {
  // Jika redirect mengandung token yang embedded, ambil path-nya saja
  const redirectValue = payload.redirect ?? route.query.redirect
  if (typeof redirectValue === 'string' && redirectValue) {
    const cleanPath = redirectValue.includes('?')
      ? redirectValue.slice(0, redirectValue.indexOf('?'))
      : redirectValue
    if (cleanPath && cleanPath.startsWith('/')) {
      return cleanPath
    }
  }
  return '/workspaces'
}

async function captureToken() {
  const payload = extractPayloadFromUrl()

  if (!payload.token && !payload.access_token) {
    errorMessage.value = 'Token login tidak ditemukan pada callback.'
    return
  }

  try {
    authStore.captureTokenLogin(payload, payload.remember)
    const target = resolveRedirectTarget(payload)
    await router.replace(target)
  } catch (error) {
    errorMessage.value =
      error instanceof Error ? error.message : 'Token login gagal diproses.'
  }
}

onMounted(() => {
  captureToken()
})
</script>

<template>
  <main class="flex min-h-screen items-center justify-center bg-[#030712] px-6 text-white">
    <div class="w-full max-w-lg rounded-[28px] border border-white/10 bg-white/[0.04] px-8 py-10 text-center shadow-[0_30px_80px_rgba(0,0,0,0.28)]">
      <div v-if="errorMessage" class="space-y-4">
        <h1 class="text-2xl font-semibold">Login callback gagal</h1>
        <p class="text-sm leading-6 text-rose-200">{{ errorMessage }}</p>
        <RouterLink
          to="/login"
          class="inline-flex items-center rounded-2xl bg-white px-5 py-3 text-sm font-medium text-slate-950"
        >
          Kembali ke login
        </RouterLink>
      </div>

      <div v-else class="space-y-4">
        <div class="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-white/15 border-t-cyan-300"></div>
        <h1 class="text-2xl font-semibold">Memproses login</h1>
        <p class="text-sm leading-6 text-slate-300">
          Token sedang ditangkap dan sesi login kamu sedang disiapkan.
        </p>
      </div>
    </div>
  </main>
</template>
