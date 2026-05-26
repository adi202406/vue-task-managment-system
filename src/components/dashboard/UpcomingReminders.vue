<script setup>
import DashboardCard from './DashboardCard.vue'
import IconGlyph from './IconGlyph.vue'

defineProps({
  reminders: {
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
      <h2 class="text-base font-semibold text-white">Upcoming Reminders</h2>
      <a href="#" class="text-sm text-sky-400 transition hover:text-sky-300">View all</a>
    </div>
    <div v-if="loading" class="space-y-4">
      <div v-for="index in 4" :key="index" class="flex items-start gap-3">
        <div class="mt-1.5 h-3.5 w-3.5 shrink-0 animate-pulse rounded-full bg-white/10" />
        <div class="min-w-0 flex-1">
          <div class="h-4 w-40 animate-pulse rounded-full bg-white/10" />
          <div class="mt-2 h-3 w-24 animate-pulse rounded-full bg-white/8" />
        </div>
      </div>
    </div>

    <div v-else-if="!reminders.length" class="rounded-2xl border border-dashed border-white/10 bg-white/[0.03] px-5 py-8 text-center">
      <p class="text-sm font-medium text-white">No upcoming reminders</p>
      <p class="mt-1 text-sm text-slate-400">Card reminders and due dates will appear here.</p>
    </div>

    <div v-else class="space-y-4">
      <article v-for="reminder in reminders" :key="reminder.title" class="flex items-start gap-3 rounded-xl transition hover:bg-white/[0.04]">
        <span class="mt-1.5 h-3.5 w-3.5 shrink-0 rounded-full border-2" :style="{ borderColor: reminder.color }" />
        <div class="min-w-0 flex-1">
          <p class="truncate text-sm font-medium text-white">{{ reminder.title }}</p>
          <p class="mt-1 flex items-center gap-2 text-xs text-slate-400">
            <span class="h-2 w-2 rounded-sm bg-blue-500" />
            {{ reminder.board }}
          </p>
        </div>
        <span class="shrink-0 text-right text-sm text-slate-300">{{ reminder.time }}</span>
        <IconGlyph name="bell" class="hidden h-5 w-5 shrink-0 text-slate-500 sm:block" />
      </article>
    </div>
  </DashboardCard>
</template>
