<script setup>
import DashboardCard from './DashboardCard.vue'
import IconGlyph from './IconGlyph.vue'
import MemberStack from './MemberStack.vue'

defineProps({
  boards: {
    type: Array,
    default: () => [],
  },
  loading: {
    type: Boolean,
    default: false,
  },
})

defineEmits(['open-board'])
</script>

<template>
  <DashboardCard class="p-4 sm:p-5">
    <div class="mb-4 flex items-center justify-between">
      <h2 class="text-base font-semibold text-white">Recent Boards</h2>
      <a href="#" class="text-sm text-sky-400 transition hover:text-sky-300">View all</a>
    </div>
    <div v-if="loading" class="space-y-3">
      <div v-for="index in 4" :key="index" class="flex items-center gap-3 rounded-2xl p-2">
        <div class="h-10 w-10 shrink-0 animate-pulse rounded-xl bg-white/10" />
        <div class="min-w-0 flex-1">
          <div class="h-4 w-36 animate-pulse rounded-full bg-white/10" />
          <div class="mt-2 h-3 w-24 animate-pulse rounded-full bg-white/8" />
        </div>
      </div>
    </div>

    <div v-else-if="!boards.length" class="rounded-2xl border border-dashed border-white/10 bg-white/[0.03] px-5 py-8 text-center">
      <p class="text-sm font-medium text-white">No boards yet</p>
      <p class="mt-1 text-sm text-slate-400">Create your first board to start tracking work.</p>
    </div>

    <div v-else class="space-y-3">
      <article v-for="board in boards" :key="board.title" class="flex cursor-pointer items-center gap-3 rounded-2xl p-2 transition hover:bg-white/[0.05]" @click="$emit('open-board', board)">
        <div class="grid h-10 w-10 shrink-0 place-items-center rounded-xl text-xs font-black text-white" :style="{ backgroundColor: board.color }">{{ board.title.slice(0, 2).toUpperCase() }}</div>
        <div class="min-w-0 flex-1">
          <h3 class="truncate text-sm font-medium text-white">{{ board.title }}</h3>
          <p class="text-xs text-slate-400">{{ board.updated }}</p>
        </div>
        <MemberStack class="hidden sm:flex" :members="board.members" />
        <IconGlyph name="dots" class="h-5 w-5 text-slate-400" />
      </article>
    </div>
  </DashboardCard>
</template>
