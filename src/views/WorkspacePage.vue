<script setup>
import { computed, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'

import UserProfilePanel from '../components/UserProfilePanel.vue'
import { useAuthStore } from '../stores/auth'

const router    = useRouter()
const authStore = useAuthStore()

const isLoading    = ref(true)
const errorMessage = ref('')
const workspaces   = ref([])
const showProfile  = ref(false)

const workspaceCountLabel = computed(() => {
  const total = workspaces.value.length
  return `${total} workspace${total === 1 ? '' : 's'}`
})

function normalizeWorkspaces(payload) {
  if (Array.isArray(payload))            return payload
  if (Array.isArray(payload?.data))      return payload.data
  if (Array.isArray(payload?.data?.data)) return payload.data.data
  return []
}

function getWorkspaceTitle(workspace, index) {
  return workspace?.name || workspace?.title || workspace?.workspace_name || `Workspace ${index + 1}`
}

function getWorkspaceDescription(workspace) {
  return workspace?.description || workspace?.notes || workspace?.summary || 'Belum ada deskripsi.'
}

function getWorkspaceMeta(workspace) {
  return [
    workspace?.slug               ? `Slug: ${workspace.slug}`               : null,
    workspace?.owner?.name        ? `Owner: ${workspace.owner.name}`        : null,
    workspace?.members_count != null ? `${workspace.members_count} members` : null,
  ].filter(Boolean)
}

async function loadWorkspaces() {
  isLoading.value    = true
  errorMessage.value = ''
  try {
    const payload        = await authStore.loadWorkspaces()
    workspaces.value     = normalizeWorkspaces(payload)
  } catch (error) {
    if (error instanceof Error && error.status === 401) {
      await authStore.logout()
      await router.push('/login')
      return
    }
    errorMessage.value = error instanceof Error ? error.message : 'Workspace gagal dimuat.'
  } finally {
    isLoading.value = false
  }
}

async function handleLogout() {
  await authStore.logout()
  await router.push('/login')
}

onMounted(loadWorkspaces)
</script>

<template>
  <div class="min-h-screen bg-[#07111f] text-white">
    <div class="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-10">

      <!-- ══ HEADER ══════════════════════════════════════════════ -->
      <header class="mb-6 flex flex-col gap-4 rounded-[28px] border border-white/10
                     bg-[linear-gradient(135deg,rgba(11,24,44,0.96),rgba(8,14,27,0.98))]
                     px-5 py-5 shadow-[0_24px_80px_rgba(0,0,0,0.28)]
                     sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <div>
          <p class="text-xs uppercase tracking-[0.32em] text-cyan-300/70">Workspace Hub</p>
          <h1 class="mt-2 text-2xl font-semibold tracking-tight text-white sm:text-3xl">
            Daftar Workspace
          </h1>
        </div>

        <div class="flex items-center gap-2 sm:gap-3">
          <button type="button"
            class="inline-flex items-center gap-2 rounded-2xl border border-cyan-400/25 bg-cyan-400/10 px-4 py-2.5 text-sm font-medium text-cyan-100 transition hover:bg-cyan-400/15"
            @click="loadWorkspaces">
            <svg viewBox="0 0 24 24" class="h-4 w-4" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M4 4v5h.582m15.356 2A8.001 8.001 0 0 0 4.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 0 1-15.357-2m15.357 2H15"/>
            </svg>
            Refresh
          </button>

          <!-- Profile avatar button -->
          <button
            type="button"
            title="Profil saya"
            class="flex h-10 w-10 items-center justify-center overflow-hidden rounded-full border border-white/15 bg-[#3b6cff]/20 ring-2 ring-transparent transition hover:ring-[#3b6cff]/40"
            :class="{ 'ring-[#3b6cff]/50': showProfile }"
            @click="showProfile = !showProfile"
          >
            <!-- Avatar -->
            <img
              v-if="authStore.user?.avatar"
              :src="authStore.user.avatar"
              :alt="authStore.user?.name"
              class="h-full w-full object-cover"
            />

            <!-- Fallback initials -->
            <span
              v-else
              class="text-sm font-semibold text-white"
            >
              {{
                (authStore.user?.name || 'U')
                  .split(' ')
                  .map(w => w[0])
                  .slice(0, 2)
                  .join('')
                  .toUpperCase()
              }}
            </span>
          </button>

          <button type="button"
            class="inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm font-medium text-slate-100 transition hover:bg-white/10"
            @click="handleLogout">
            <svg viewBox="0 0 24 24" class="h-4 w-4" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9"/>
            </svg>
            Logout
          </button>
        </div>
      </header>

      <pre>{{ authStore.user }}</pre>

      <!-- ══ MAIN LAYOUT ═══════════════════════════════════════════ -->
      <div class="flex gap-5 lg:gap-6" :class="showProfile ? 'items-start' : ''">

        <!-- ── Left: workspace list ─────────────────────────────── -->
        <div class="min-w-0 flex-1 space-y-4">

          <!-- Stats row -->
          <div class="grid grid-cols-3 gap-3">
            <div class="rounded-[22px] border border-white/10 bg-white/[0.04] p-4 text-center">
              <p class="text-xs text-slate-400">Status</p>
              <p class="mt-2 text-lg font-semibold text-white">
                {{ isLoading ? 'Memuat…' : 'Terhubung' }}
              </p>
            </div>
            <div class="rounded-[22px] border border-white/10 bg-white/[0.04] p-4 text-center">
              <p class="text-xs text-slate-400">Workspace</p>
              <p class="mt-2 text-lg font-semibold text-white">{{ workspaceCountLabel }}</p>
            </div>
            <div class="rounded-[22px] border border-white/10 bg-white/[0.04] p-4 text-center">
              <p class="text-xs text-slate-400">Auth</p>
              <p class="mt-2 text-lg font-semibold text-white">Sanctum</p>
            </div>
          </div>

          <!-- Workspace cards -->
          <section class="rounded-[28px] border border-white/10 bg-[rgba(8,13,24,0.92)] p-4 shadow-[0_20px_70px_rgba(0,0,0,0.24)] sm:p-5">

            <div v-if="errorMessage"
              class="rounded-2xl border border-rose-500/30 bg-rose-500/10 px-5 py-4 text-sm text-rose-200">
              {{ errorMessage }}
            </div>

            <div v-else-if="isLoading" class="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              <div v-for="i in 6" :key="i"
                class="h-44 animate-pulse rounded-[22px] border border-white/8 bg-white/[0.04]">
              </div>
            </div>

            <div v-else-if="workspaces.length" class="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              <article v-for="(ws, index) in workspaces"
                :key="ws.id || ws.uuid || ws.slug || index"
                class="rounded-[22px] border border-white/10 bg-[linear-gradient(180deg,rgba(14,24,41,0.96),rgba(8,14,26,0.96))]
                       p-5 transition hover:-translate-y-1 hover:border-cyan-400/30">
                <div class="flex items-start justify-between gap-3">
                  <div>
                    <p class="text-xs uppercase tracking-[0.28em] text-cyan-300/75">Workspace</p>
                    <h2 class="mt-2 text-xl font-semibold text-white">
                      {{ getWorkspaceTitle(ws, index) }}
                    </h2>
                  </div>
                  <span class="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-slate-300">
                    #{{ ws.id || index + 1 }}
                  </span>
                </div>

                <p class="mt-3 text-sm leading-6 text-slate-300">{{ getWorkspaceDescription(ws) }}</p>

                <div class="mt-4 flex flex-wrap gap-2">
                  <span v-for="item in getWorkspaceMeta(ws)" :key="item"
                    class="rounded-full border border-cyan-400/20 bg-cyan-400/10 px-3 py-1 text-xs text-cyan-100">
                    {{ item }}
                  </span>
                </div>
              </article>
            </div>

            <div v-else class="rounded-[22px] border border-dashed border-white/12 bg-white/[0.03] px-6 py-12 text-center">
              <h2 class="text-2xl font-semibold text-white">Belum ada workspace</h2>
              <p class="mt-3 text-sm text-slate-400">
                Endpoint berhasil dipanggil, tapi belum mengembalikan data workspace.
              </p>
            </div>
          </section>
        </div>

        <!-- ── Right: Profile panel (slide-in) ─────────────────── -->
        <transition
          enter-active-class="transition-all duration-300 ease-out"
          enter-from-class="opacity-0 translate-x-6"
          enter-to-class="opacity-100 translate-x-0"
          leave-active-class="transition-all duration-200 ease-in"
          leave-from-class="opacity-100 translate-x-0"
          leave-to-class="opacity-0 translate-x-6">
          <aside v-if="showProfile"
            class="w-80 flex-shrink-0 rounded-[28px] border border-white/10
                   bg-[linear-gradient(180deg,rgba(11,20,38,0.97),rgba(7,13,25,0.98))]
                   p-5 shadow-[0_24px_80px_rgba(0,0,0,0.35)]
                   lg:w-[22rem]">

            <!-- Panel header -->
            <div class="mb-5 flex items-center justify-between">
              <h2 class="text-sm font-semibold uppercase tracking-[0.28em] text-slate-400">Profil Saya</h2>
              <button type="button"
                class="flex h-7 w-7 items-center justify-center rounded-full text-slate-400 transition hover:bg-white/8 hover:text-white"
                @click="showProfile = false">
                <svg viewBox="0 0 24 24" class="h-4 w-4" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M18 6 6 18M6 6l12 12"/>
                </svg>
              </button>
            </div>

            <UserProfilePanel />
          </aside>
        </transition>

      </div>
    </div>
  </div>
</template>
