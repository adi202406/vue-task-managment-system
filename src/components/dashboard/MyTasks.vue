<script setup>
import DashboardCard from './DashboardCard.vue'

defineProps({
  tasks: {
    type: Array,
    default: () => [],
  },
  loading: {
    type: Boolean,
    default: false,
  },
})
</script>

<template>
  <DashboardCard class="p-4 sm:p-5">
    <div class="mb-4 flex items-center justify-between">
      <h2 class="text-base font-semibold text-white">My Tasks</h2>
      <a href="#" class="text-sm text-sky-400 transition hover:text-sky-300">View all</a>
    </div>
    <div v-if="loading" class="space-y-4">
      <div v-for="index in 5" :key="index" class="flex items-start gap-3">
        <div class="mt-1 h-4 w-4 shrink-0 animate-pulse rounded-full bg-white/10" />
        <div class="min-w-0 flex-1">
          <div class="h-4 w-40 animate-pulse rounded-full bg-white/10" />
          <div class="mt-2 h-3 w-28 animate-pulse rounded-full bg-white/8" />
        </div>
      </div>
    </div>

    <div v-else-if="!tasks.length" class="rounded-2xl border border-dashed border-white/10 bg-white/[0.03] px-5 py-8 text-center">
      <p class="text-sm font-medium text-white">No assigned tasks</p>
      <p class="mt-1 text-sm text-slate-400">Assigned cards will appear here.</p>
    </div>

    <div v-else class="space-y-4">
      <label v-for="task in tasks" :key="task.title" class="group flex cursor-pointer items-start gap-3 rounded-xl transition hover:bg-white/[0.04]">
        <span class="mt-1 h-4 w-4 shrink-0 rounded-full border border-slate-500 transition group-hover:border-sky-300 group-hover:shadow-[0_0_16px_rgba(56,189,248,0.35)]" />
        <span class="min-w-0 flex-1">
          <span class="block truncate text-sm font-medium text-white">{{ task.title }}</span>
          <span class="mt-1 flex items-center gap-2 text-xs text-slate-400">
            <span class="h-2 w-2 rounded-sm" :style="{ backgroundColor: task.color }" />
            {{ task.board }}
          </span>
          <span v-if="task.labels?.length" class="mt-2 flex flex-wrap gap-1.5">
            <span v-for="label in task.labels.slice(0, 2)" :key="label.id" class="rounded-full border border-white/10 bg-white/[0.04] px-2 py-0.5 text-[10px] text-slate-300">
              {{ label.name }}
            </span>
          </span>
        </span>
        <span class="flex shrink-0 flex-col items-end gap-1">
          <span class="text-sm" :class="task.urgent ? 'text-rose-300' : task.due === 'Tomorrow' ? 'text-amber-300' : 'text-slate-400'">{{ task.due }}</span>
          <span class="rounded-full border border-white/10 bg-white/[0.04] px-2 py-0.5 text-[10px] uppercase text-slate-400">{{ task.priority }}</span>
        </span>
      </label>
    </div>
  </DashboardCard>
</template>
