<script setup>
import { ref } from 'vue'
import { useWorkspaceDashboardStore } from '@/stores/workspaceDashboard'

const emit = defineEmits(['created'])
const dashboardStore = useWorkspaceDashboardStore()

const name = ref('')
const color = ref('#3b82f6')
const isCreating = ref(false)

async function handleCreate() {
  if (!name.value.trim() || isCreating.value) return
  isCreating.value = true
  try {
    await dashboardStore.createLabel({
      name: name.value.trim(),
      color: color.value,
    })
    const created = dashboardStore.labels.find(
      (l) => l.name === name.value.trim()
    )
    if (created) {
      emit('created', created)
    }
    name.value = ''
    color.value = '#3b82f6'
  } catch (error) {
    console.error('Failed to create label:', error)
  } finally {
    isCreating.value = false
  }
}
</script>

<template>
  <div class="space-y-2">
    <div class="flex items-center gap-2">
      <input
        v-model="name"
        class="flex-1 rounded border border-white/10 bg-white/[0.04] px-2.5 py-1.5 text-xs text-white outline-none placeholder:text-slate-500 focus:border-blue-500"
        type="text"
        placeholder="Label name..."
        @keyup.enter="handleCreate"
      />
      <input
        v-model="color"
        class="h-7 w-7 cursor-pointer rounded border border-white/10 bg-transparent p-0"
        type="color"
        title="Choose color"
      />
      <button
        class="flex h-7 items-center gap-1 rounded bg-blue-600 px-2.5 text-xs font-semibold text-white transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-50"
        type="button"
        :disabled="!name.trim() || isCreating"
        @click="handleCreate"
      >
        {{ isCreating ? '...' : 'Add' }}
      </button>
    </div>
  </div>
</template>
