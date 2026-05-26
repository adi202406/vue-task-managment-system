<script setup>
import { reactive } from 'vue'

import IconGlyph from './IconGlyph.vue'

defineProps({
  open: {
    type: Boolean,
    default: false,
  },
  saving: {
    type: Boolean,
    default: false,
  },
  error: {
    type: String,
    default: '',
  },
})

const emit = defineEmits(['close', 'submit'])

const form = reactive({
  email: '',
  role: 'editor',
})

function submit() {
  emit('submit', { ...form })
}
</script>

<template>
  <teleport to="body">
    <transition
      enter-active-class="transition duration-200 ease-out"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition duration-150 ease-in"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div v-if="open" class="fixed inset-0 z-50 grid place-items-center overflow-hidden bg-black/60 px-4 py-4 backdrop-blur-sm sm:py-6" @click.self="$emit('close')">
        <form class="flex max-h-[90vh] w-full max-w-md flex-col overflow-hidden rounded-2xl border border-white/10 bg-[rgba(5,10,24,0.92)] shadow-[0_24px_90px_rgba(0,0,0,0.48)] backdrop-blur-2xl" @submit.prevent="submit">
          <div class="flex shrink-0 items-center justify-between border-b border-white/10 p-5">
            <div>
              <p class="text-xs uppercase tracking-[0.28em] text-sky-300/70">Workspace Invite</p>
              <h2 class="mt-2 text-xl font-semibold text-white">Invite Member</h2>
            </div>
            <button class="grid h-9 w-9 place-items-center rounded-xl border border-white/10 bg-white/[0.04] text-slate-300 transition hover:border-sky-400/40 hover:text-sky-300" type="button" @click="$emit('close')">x</button>
          </div>

          <div class="min-h-0 flex-1 overflow-y-auto p-5">
            <div v-if="error" class="mb-4 rounded-2xl border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-200">
              {{ error }}
            </div>

            <div class="space-y-4">
              <div>
                <label class="mb-1.5 block text-sm text-slate-300">Email</label>
                <input v-model="form.email" required type="email" class="w-full rounded-2xl border border-white/10 bg-white/[0.05] px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-sky-400/60 focus:ring-2 focus:ring-sky-400/20 disabled:cursor-not-allowed disabled:opacity-60" placeholder="teammate@example.com" :disabled="saving" />
              </div>

              <div>
                <label class="mb-1.5 block text-sm text-slate-300">Role</label>
                <select v-model="form.role" class="w-full rounded-2xl border border-white/10 bg-[#07111f] px-4 py-3 text-sm text-white outline-none transition focus:border-sky-400/60 focus:ring-2 focus:ring-sky-400/20 disabled:cursor-not-allowed disabled:opacity-60" :disabled="saving">
                  <option value="editor">Editor</option>
                  <option value="viewer">Viewer</option>
                </select>
              </div>
            </div>
          </div>

          <div class="shrink-0 border-t border-white/10 p-5">
            <button class="inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-sky-500 px-5 text-sm font-medium text-white shadow-[0_0_30px_rgba(37,99,235,0.3)] transition hover:-translate-y-0.5 hover:shadow-[0_0_38px_rgba(14,165,233,0.45)] disabled:cursor-not-allowed disabled:opacity-60" type="submit" :disabled="saving">
              <IconGlyph name="invite" class="h-4 w-4" />
              {{ saving ? 'Sending invite...' : 'Send Invite' }}
            </button>
          </div>
        </form>
      </div>
    </transition>
  </teleport>
</template>
