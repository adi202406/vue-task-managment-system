<script setup>
import DashboardCard from './DashboardCard.vue'

defineProps({
  activities: {
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
      <h2 class="text-base font-semibold text-white">Activity Feed</h2>
      <a href="#" class="text-sm text-sky-400 transition hover:text-sky-300">View all</a>
    </div>
    <div v-if="loading" class="space-y-4">
      <div v-for="index in 4" :key="index" class="flex gap-3">
        <div class="h-9 w-9 shrink-0 animate-pulse rounded-full bg-white/10" />
        <div class="min-w-0 flex-1">
          <div class="h-4 w-full animate-pulse rounded-full bg-white/10" />
          <div class="mt-2 h-3 w-24 animate-pulse rounded-full bg-white/8" />
        </div>
      </div>
    </div>

    <div v-else-if="!activities.length" class="rounded-2xl border border-dashed border-white/10 bg-white/[0.03] px-5 py-8 text-center">
      <p class="text-sm font-medium text-white">No activity yet</p>
      <p class="mt-1 text-sm text-slate-400">Comments, movement, reminders, and member events will appear here.</p>
    </div>

    <div v-else class="space-y-4">
      <article v-for="activity in activities" :key="activity.person + activity.time" class="flex gap-3">
        <div class="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-gradient-to-br from-orange-200 to-blue-700 text-[11px] font-black text-white">{{ activity.avatar }}</div>
        <div class="min-w-0">
          <p class="text-sm leading-5 text-slate-200">
            <span class="font-medium text-white">{{ activity.person }}</span>
            {{ ' ' + activity.action }}
          </p>
          <p class="mt-1 text-xs text-slate-500">{{ activity.time }}</p>
        </div>
      </article>
    </div>
  </DashboardCard>
</template>
