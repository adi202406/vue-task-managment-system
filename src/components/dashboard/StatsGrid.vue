<script setup>
import DashboardCard from './DashboardCard.vue'
import IconGlyph from './IconGlyph.vue'

defineProps({
  stats: {
    type: Array,
    default: () => [],
  },
  loading: {
    type: Boolean,
    default: false,
  },
})

const tones = {
  blue: 'from-blue-600/90 to-sky-500/40 text-sky-100 shadow-blue-500/20',
  violet: 'from-violet-600/90 to-fuchsia-500/40 text-violet-100 shadow-violet-500/20',
  green: 'from-emerald-600/90 to-green-500/35 text-emerald-100 shadow-emerald-500/20',
  amber: 'from-amber-600/90 to-orange-500/35 text-amber-100 shadow-amber-500/20',
}
</script>

<template>
  <div class="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
    <DashboardCard v-for="item in loading ? Array.from({ length: 5 }, (_, index) => ({ label: index })) : stats" :key="item.label" class="p-4">
      <div v-if="loading" class="flex items-center gap-4">
        <div class="h-14 w-14 shrink-0 animate-pulse rounded-2xl bg-white/10" />
        <div class="min-w-0 flex-1">
          <div class="h-3 w-24 animate-pulse rounded-full bg-white/10" />
          <div class="mt-3 h-7 w-14 animate-pulse rounded-full bg-white/10" />
          <div class="mt-3 h-3 w-32 animate-pulse rounded-full bg-white/8" />
        </div>
      </div>
      <div v-else class="flex items-center gap-4">
        <div class="grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-gradient-to-br shadow-2xl" :class="tones[item.tone]">
          <IconGlyph :name="item.icon" class="h-7 w-7" />
        </div>
        <div class="min-w-0">
          <p class="truncate text-sm text-slate-400">{{ item.label }}</p>
          <p class="mt-1 text-3xl font-semibold tracking-tight text-white">{{ item.value }}</p>
          <p class="mt-1 truncate text-xs" :class="item.change.startsWith('-') ? 'text-rose-300' : 'text-emerald-300'">{{ item.change }}</p>
        </div>
      </div>
    </DashboardCard>
  </div>
</template>
