<script setup>
import { computed, onMounted, reactive, ref } from 'vue'

import { getProfile, updatePassword, updateProfile } from '../services/profile'
import { useAuthStore } from '../stores/auth'

const authStore = useAuthStore()

// ─── State ───────────────────────────────────────────────────────────────────
const isLoading = ref(true)
const isSaving = ref(false)
const isSavingPw = ref(false)

const profile = ref(null)
const loadError = ref('')
const saveMsg = reactive({ type: '', text: '' })  // { type: 'success'|'error', text }
const savePwMsg = reactive({ type: '', text: '' })

const avatarPreview = ref(null)
const avatarFile = ref(null)

// ─── Form state ──────────────────────────────────────────────────────────────
const form = reactive({ name: '', email: '' })
const pwForm = reactive({ current_password: '', password: '', password_confirmation: '' })
const showPw = reactive({ current: false, new: false, confirm: false })

// ─── Computed ─────────────────────────────────────────────────────────────────
/**
 * Deteksi OAuth user: user login via Google jika field `google_id` pada
 * tabel users bernilai non-null dan non-empty.
 */
// const isOAuthUser = computed(() =>
//   !!profile.value?.google_id
// )

const isOAuthUser = computed(() => {
  console.log('profile:', profile.value)
  console.log('google_id:', profile.value?.google_id)

  return !!profile.value?.google_id
})


const displayAvatar = computed(() =>
  avatarPreview.value ||
  profile.value?.avatar ||
  null
)

const initials = computed(() => {
  const name = profile.value?.name || ''
  return name.split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase() || '?'
})

// ─── Load profile ─────────────────────────────────────────────────────────────
async function loadProfile() {
  isLoading.value = true
  loadError.value = ''
  try {
    const data = await getProfile()
    // Normalise berbagai struktur response Laravel
    profile.value = data?.data ?? data
    form.name = profile.value?.name ?? ''
    form.email = profile.value?.email ?? ''
  } catch (e) {
    loadError.value = e instanceof Error ? e.message : 'Gagal memuat profil.'
  } finally {
    isLoading.value = false
  }
}

// ─── Avatar picker ────────────────────────────────────────────────────────────
function onAvatarChange(event) {
  const file = event.target.files?.[0]
  if (!file) return
  avatarFile.value = file
  avatarPreview.value = URL.createObjectURL(file)
}

function triggerAvatarPicker() {
  document.getElementById('avatar-input')?.click()
}

// ─── Save profile ─────────────────────────────────────────────────────────────
async function handleSaveProfile() {
  saveMsg.type = ''
  saveMsg.text = ''
  isSaving.value = true
  try {
    const payload = {
      name: form.name,
      email: form.email,
    }
    if (avatarFile.value) payload.avatar = avatarFile.value

    const res = await updateProfile(payload)
    profile.value = res?.data ?? res
    form.name = profile.value?.name ?? form.name
    form.email = profile.value?.email ?? form.email

    // Reset avatar file setelah upload sukses
    avatarFile.value = null
    avatarPreview.value = null

    authStore.updateUser(profile.value)

    saveMsg.type = 'success'
    saveMsg.text = 'Profil berhasil diperbarui.'
  } catch (e) {
    saveMsg.type = 'error'
    saveMsg.text = e instanceof Error ? e.message : 'Gagal menyimpan profil.'
  } finally {
    isSaving.value = false
    setTimeout(() => { saveMsg.text = '' }, 4000)
  }
}

// ─── Save password ────────────────────────────────────────────────────────────
async function handleSavePassword() {
  savePwMsg.type = ''
  savePwMsg.text = ''
  isSavingPw.value = true
  try {
    await updatePassword({
      current_password: pwForm.current_password,
      new_password: pwForm.password,
      new_password_confirmation: pwForm.password_confirmation,
    })
    // Reset form
    pwForm.current_password = ''
    pwForm.password = ''
    pwForm.password_confirmation = ''

    savePwMsg.type = 'success'
    savePwMsg.text = 'Password berhasil diubah.'
  } catch (e) {
    savePwMsg.type = 'error'
    savePwMsg.text = e instanceof Error ? e.message : 'Gagal mengubah password.'
  } finally {
    isSavingPw.value = false
    setTimeout(() => { savePwMsg.text = '' }, 4000)
  }
}

onMounted(loadProfile)
</script>

<template>
  <!-- Loading skeleton -->
  <div v-if="isLoading" class="space-y-4">
    <div class="h-24 w-24 animate-pulse rounded-full bg-white/10 mx-auto"></div>
    <div class="h-4 w-48 animate-pulse rounded-full bg-white/10 mx-auto"></div>
    <div class="h-3 w-36 animate-pulse rounded-full bg-white/8 mx-auto"></div>
  </div>

  <!-- Load error -->
  <div v-else-if="loadError"
    class="rounded-2xl border border-rose-500/30 bg-rose-500/10 px-5 py-4 text-sm text-rose-200 text-center">
    {{ loadError }}
    <button class="mt-2 block w-full text-xs underline opacity-70 hover:opacity-100" @click="loadProfile">
      Coba lagi
    </button>
  </div>

  <!-- Profile content -->
  <div v-else-if="profile" class="space-y-6">

    <!-- ── Avatar + header info ───────────────────────────────── -->
    <div class="flex flex-col items-center gap-4 text-center">
      <!-- Avatar -->
      <div class="relative">
        <!-- Image avatar atau initials fallback -->
        <div class="h-24 w-24 overflow-hidden rounded-full ring-2 ring-white/15 ring-offset-2 ring-offset-transparent">
          <img v-if="displayAvatar" :src="displayAvatar" :alt="profile.name" class="h-full w-full object-cover" />
          <div v-else
            class="flex h-full w-full items-center justify-center bg-gradient-to-br from-[#3b6cff] to-[#5a40d9] text-2xl font-semibold text-white">
            {{ initials }}
          </div>
        </div>

        <!-- Edit button khusus non-OAuth -->
        <button v-if="!isOAuthUser" type="button" title="Ganti foto profil"
          class="absolute bottom-0 right-0 flex h-7 w-7 items-center justify-center rounded-full bg-[#3b6cff] shadow-lg ring-2 ring-[#07111f] transition hover:bg-[#5278ff]"
          @click="triggerAvatarPicker">
          <svg viewBox="0 0 24 24" class="h-3.5 w-3.5 text-white" fill="none" stroke="currentColor" stroke-width="2.2">
            <path d="M12 20h9M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5Z" />
          </svg>
        </button>
        <input id="avatar-input" type="file" accept="image/*" class="hidden" @change="onAvatarChange" />
      </div>

      <div>
        <h3 class="text-xl font-semibold text-white">{{ profile.name }}</h3>
        <p class="mt-1 text-sm text-slate-400">{{ profile.email }}</p>

        <!-- Badge provider -->
        <span v-if="isOAuthUser"
          class="mt-2 inline-flex items-center gap-1.5 rounded-full border border-[#4285F4]/30 bg-[#4285F4]/10 px-3 py-1 text-xs text-[#8ab4f8]">
          <!-- Google icon -->
          <svg viewBox="0 0 48 48" class="h-3 w-3" aria-hidden="true">
            <path fill="#FFC107"
              d="M43.6 20.5H42V20H24v8h11.3C33.7 32.7 29.3 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3 0 5.7 1.1 7.8 3l5.7-5.7C34.1 6.1 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.4-.4-3.5Z" />
            <path fill="#FF3D00"
              d="M6.3 14.7 12.9 19.5C14.7 15 19 12 24 12c3 0 5.7 1.1 7.8 3l5.7-5.7C34.1 6.1 29.3 4 24 4 16.3 4 9.7 8.3 6.3 14.7Z" />
            <path fill="#4CAF50"
              d="M24 44c5.2 0 10-2 13.5-5.2l-6.2-5.2C29.4 35.1 26.8 36 24 36c-5.3 0-9.7-3.3-11.3-8l-6.5 5C9.5 39.6 16.2 44 24 44Z" />
            <path fill="#1976D2"
              d="M43.6 20.5H42V20H24v8h11.3c-1.1 3.1-3.2 5.2-4 5.8l6.2 5.2C37.1 38.7 44 34 44 24c0-1.3-.1-2.4-.4-3.5Z" />
          </svg>
          Login via Google
        </span>
        <span v-else
          class="mt-2 inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-slate-400">
          Email & Password
        </span>
      </div>
    </div>

    <!-- ── Form OAuth: hanya nama yang bisa diubah ──────────────── -->
    <form v-if="isOAuthUser" class="space-y-4" @submit.prevent="handleSaveProfile">
      <h4 class="text-xs font-semibold uppercase tracking-[0.28em] text-slate-500">Informasi Profil</h4>

      <!-- Feedback -->
      <transition name="fade">
        <div v-if="saveMsg.text" :class="saveMsg.type === 'success'
          ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-200'
          : 'border-rose-500/30 bg-rose-500/10 text-rose-200'" class="rounded-2xl border px-4 py-3 text-sm">
          {{ saveMsg.text }}
        </div>
      </transition>

      <!-- Nama (editable) -->
      <div>
        <label class="mb-1.5 block text-sm text-slate-300">Nama</label>
        <input v-model="form.name" type="text" required
          class="w-full rounded-2xl border border-white/10 bg-white/[0.05] px-4 py-3 text-sm text-white placeholder:text-slate-600 outline-none transition focus:border-[#3b6cff]/60 focus:ring-2 focus:ring-[#3b6cff]/20"
          placeholder="Nama lengkap" />
      </div>

      <!-- Email (read-only) -->
      <div>
        <label class="mb-1.5 block text-sm text-slate-300">Email</label>
        <div class="flex items-center gap-2 rounded-2xl border border-white/8 bg-white/[0.03] px-4 py-3">
          <p class="flex-1 text-sm text-slate-400">{{ profile.email }}</p>
          <span
            class="rounded-full border border-white/10 bg-white/5 px-2 py-0.5 text-[10px] text-slate-500">Read-only</span>
        </div>
        <p class="mt-1.5 text-xs text-slate-600">Email dikelola oleh Google.</p>
      </div>

      <button type="submit" :disabled="isSaving"
        class="flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-[#3b6cff] to-[#5040d9] px-4 py-3 text-sm font-medium text-white shadow-[0_8px_30px_rgba(59,108,255,0.3)] transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60">
        <svg v-if="isSaving" class="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="3" stroke-dasharray="31.4"
            stroke-linecap="round" />
        </svg>
        {{ isSaving ? 'Menyimpan...' : 'Simpan Nama' }}
      </button>
    </form>

    <!-- ── Edit form (non-OAuth) ──────────────────────────────── -->
    <template v-else>

      <!-- Edit Profile -->
      <form class="space-y-4" @submit.prevent="handleSaveProfile">
        <h4 class="text-xs font-semibold uppercase tracking-[0.28em] text-slate-500">Informasi Profil</h4>

        <!-- Feedback -->
        <transition name="fade">
          <div v-if="saveMsg.text" :class="saveMsg.type === 'success'
            ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-200'
            : 'border-rose-500/30 bg-rose-500/10 text-rose-200'" class="rounded-2xl border px-4 py-3 text-sm">
            {{ saveMsg.text }}
          </div>
        </transition>

        <!-- Avatar preview strip (jika ada file dipilih) -->
        <div v-if="avatarPreview"
          class="flex items-center gap-3 rounded-2xl border border-cyan-400/20 bg-cyan-400/5 px-4 py-3">
          <img :src="avatarPreview" class="h-10 w-10 rounded-full object-cover ring-1 ring-white/15" alt="Preview" />
          <div class="min-w-0 flex-1">
            <p class="truncate text-sm text-cyan-200">{{ avatarFile?.name }}</p>
            <p class="text-xs text-slate-500">Siap diunggah</p>
          </div>
          <button type="button" class="text-slate-400 hover:text-white"
            @click="avatarFile = null; avatarPreview = null">
            <svg viewBox="0 0 24 24" class="h-4 w-4" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M18 6 6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        <!-- Nama -->
        <div>
          <label class="mb-1.5 block text-sm text-slate-300">Nama</label>
          <input v-model="form.name" type="text" required
            class="w-full rounded-2xl border border-white/10 bg-white/[0.05] px-4 py-3 text-sm text-white placeholder:text-slate-600 outline-none transition focus:border-[#3b6cff]/60 focus:ring-2 focus:ring-[#3b6cff]/20"
            placeholder="Nama lengkap" />
        </div>

        <!-- Email -->
        <div>
          <label class="mb-1.5 block text-sm text-slate-300">Email</label>
          <input v-model="form.email" type="email" required
            class="w-full rounded-2xl border border-white/10 bg-white/[0.05] px-4 py-3 text-sm text-white placeholder:text-slate-600 outline-none transition focus:border-[#3b6cff]/60 focus:ring-2 focus:ring-[#3b6cff]/20"
            placeholder="email@example.com" />
        </div>

        <!-- Avatar upload button -->
        <div>
          <label class="mb-1.5 block text-sm text-slate-300">Foto Profil</label>
          <button type="button"
            class="flex w-full items-center justify-center gap-2 rounded-2xl border border-dashed border-white/15 bg-white/[0.03] px-4 py-3 text-sm text-slate-400 transition hover:border-white/25 hover:text-white"
            @click="triggerAvatarPicker">
            <svg viewBox="0 0 24 24" class="h-4 w-4" fill="none" stroke="currentColor" stroke-width="1.8">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12" />
            </svg>
            {{ avatarFile ? 'Ganti foto' : 'Upload foto' }}
          </button>
        </div>

        <button type="submit" :disabled="isSaving"
          class="flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-[#3b6cff] to-[#5040d9] px-4 py-3 text-sm font-medium text-white shadow-[0_8px_30px_rgba(59,108,255,0.3)] transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60">
          <svg v-if="isSaving" class="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="3" stroke-dasharray="31.4"
              stroke-linecap="round" />
          </svg>
          {{ isSaving ? 'Menyimpan...' : 'Simpan Profil' }}
        </button>
      </form>

      <div class="h-px bg-white/8"></div>

      <!-- Change Password -->
      <form class="space-y-4" @submit.prevent="handleSavePassword">
        <h4 class="text-xs font-semibold uppercase tracking-[0.28em] text-slate-500">Ubah Password</h4>

        <transition name="fade">
          <div v-if="savePwMsg.text" :class="savePwMsg.type === 'success'
            ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-200'
            : 'border-rose-500/30 bg-rose-500/10 text-rose-200'" class="rounded-2xl border px-4 py-3 text-sm">
            {{ savePwMsg.text }}
          </div>
        </transition>

        <!-- Password field helper -->
        <div v-for="field in [
          { key: 'current_password', label: 'Password Saat Ini', model: 'current' },
          { key: 'password', label: 'Password Baru', model: 'new' },
          { key: 'password_confirmation', label: 'Konfirmasi Password Baru', model: 'confirm' },
        ]" :key="field.key">
          <label class="mb-1.5 block text-sm text-slate-300">{{ field.label }}</label>
          <div
            class="flex items-center gap-2 rounded-2xl border border-white/10 bg-white/[0.05] px-4 py-3 transition focus-within:border-[#3b6cff]/60 focus-within:ring-2 focus-within:ring-[#3b6cff]/20">
            <input v-model="pwForm[field.key]" :type="showPw[field.model] ? 'text' : 'password'" required
              class="min-w-0 flex-1 border-0 bg-transparent text-sm text-white outline-none placeholder:text-slate-600"
              :placeholder="field.label" />
            <button type="button" class="flex-shrink-0 text-slate-500 hover:text-white"
              @click="showPw[field.model] = !showPw[field.model]">
              <svg viewBox="0 0 24 24" class="h-4 w-4" fill="none" stroke="currentColor" stroke-width="1.8">
                <path d="M2 12s3.5-6 10-6 10 6 10 6-3.5 6-10 6S2 12 2 12Z" />
                <circle cx="12" cy="12" r="3" />
              </svg>
            </button>
          </div>
        </div>

        <button type="submit" :disabled="isSavingPw"
          class="flex w-full items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/[0.05] px-4 py-3 text-sm font-medium text-slate-200 transition hover:bg-white/[0.09] disabled:cursor-not-allowed disabled:opacity-60">
          <svg v-if="isSavingPw" class="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="3" stroke-dasharray="31.4"
              stroke-linecap="round" />
          </svg>
          {{ isSavingPw ? 'Menyimpan...' : 'Ubah Password' }}
        </button>
      </form>
    </template>

  </div>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.25s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
