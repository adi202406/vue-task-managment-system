<script setup>
import { reactive, ref, watch } from 'vue'
import IconGlyph from './IconGlyph.vue'

const props = defineProps({
  show: { type: Boolean, default: false },
  status: { type: Object, default: null },
})

const emit = defineEmits(['close', 'save'])

const colors = [
  { hex: '#3b82f6', name: 'Blue' },
  { hex: '#8b5cf6', name: 'Violet' },
  { hex: '#10b981', name: 'Emerald' },
  { hex: '#f59e0b', name: 'Amber' },
  { hex: '#ef4444', name: 'Red' },
  { hex: '#ec4899', name: 'Pink' },
  { hex: '#14b8a6', name: 'Teal' },
  { hex: '#f97316', name: 'Orange' },
]

const form = reactive({
  name: '',
  color: '#3b82f6',
})

const formError = ref('')
const isSaving = ref(false)

function resetForm() {
  form.name = props.status?.name || ''
  form.color = props.status?.color || '#3b82f6'
  formError.value = ''
}

watch(() => props.show, (val) => {
  if (val) resetForm()
})

async function handleSave() {
  if (!form.name.trim()) {
    formError.value = 'Status name is required.'
    return
  }
  isSaving.value = true
  formError.value = ''
  try {
    emit('save', {
      name: form.name.trim(),
      color: form.color,
    })
  } catch (error) {
    formError.value = error instanceof Error ? error.message : 'Failed to save status.'
  } finally {
    isSaving.value = false
  }
}

function handleClose() {
  emit('close')
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
      <div v-if="show" class="fixed inset-0 z-50 grid place-items-center bg-black/60 px-4 py-4 backdrop-blur-sm" @click.self="handleClose">
        <form class="flex w-full max-w-md flex-col rounded-2xl border border-white/10 bg-[rgba(5,10,24,0.96)] shadow-[0_24px_90px_rgba(0,0,0,0.5)] backdrop-blur-md" @submit.prevent="handleSave">
          <div class="flex items-center justify-between border-b border-white/10 p-5">
            <div>
              <p class="text-[10px] uppercase tracking-[0.25em] text-blue-400">{{ status ? 'Update' : 'New' }} Status</p>
              <h2 class="mt-1 text-lg font-bold text-white">{{ status ? 'Edit Status' : 'Create Status' }}</h2>
            </div>
            <button class="grid h-8 w-8 place-items-center rounded-lg border border-white/10 bg-white/[0.03] text-slate-300 hover:border-slate-500 hover:text-white transition cursor-pointer" type="button" @click="handleClose">x</button>
          </div>

          <div class="p-5 space-y-4">
            <div v-if="formError" class="rounded-lg border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-200">
              {{ formError }}
            </div>

            <div>
              <label class="block text-sm font-semibold text-slate-300 mb-1.5" for="status-name-input">Status Name</label>
              <input
                v-model="form.name"
                required
                type="text"
                id="status-name-input"
                class="w-full rounded-lg border border-white/10 bg-white/[0.04] px-4 py-2.5 text-sm text-white placeholder-slate-600 outline-none focus:border-blue-500 transition"
                placeholder="e.g. To Do, In Progress, Done"
              />
            </div>

            <div>
              <label class="block text-sm font-semibold text-slate-300 mb-1.5">Color</label>
              <div class="flex flex-wrap gap-2.5">
                <button
                  v-for="color in colors"
                  :key="color.hex"
                  type="button"
                  @click="form.color = color.hex"
                  class="h-8 w-8 rounded-full border-2 transition cursor-pointer relative"
                  :style="{ backgroundColor: color.hex }"
                  :class="form.color === color.hex ? 'border-white scale-110 shadow-md' : 'border-transparent hover:scale-105'"
                  :title="color.name"
                >
                  <span v-if="form.color === color.hex" class="absolute inset-0 flex items-center justify-center text-white text-xs font-bold">&#10003;</span>
                </button>
              </div>
            </div>
          </div>

          <div class="border-t border-white/10 p-5">
            <button
              type="submit"
              :disabled="isSaving"
              class="w-full flex items-center justify-center h-10 rounded-lg bg-blue-600 hover:bg-blue-500 text-sm font-semibold text-white transition hover:-translate-y-0.5 disabled:opacity-50 cursor-pointer shadow-sm"
            >
              {{ isSaving ? 'Saving...' : status ? 'Save Changes' : 'Create Status' }}
            </button>
          </div>
        </form>
      </div>
    </transition>
  </teleport>
</template>
