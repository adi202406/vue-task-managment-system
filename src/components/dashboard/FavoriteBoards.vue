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

defineEmits(['toggle-favorite', 'open-board'])
</script>

<template>
  <DashboardCard class="p-4 sm:p-5">
    <div class="mb-5 flex items-center justify-between">
      <h2 class="text-base font-semibold text-white">Favorite Boards</h2>
      <a href="#" class="text-sm text-sky-400 transition hover:text-sky-300">View all</a>
    </div>

    <div v-if="loading" class="grid gap-4 md:grid-cols-3">
      <div v-for="index in 3" :key="index" class="overflow-hidden rounded-2xl border border-white/10 bg-white/[0.04]">
        <div class="h-28 animate-pulse bg-white/10" />
        <div class="p-4">
          <div class="h-4 w-32 animate-pulse rounded-full bg-white/10" />
          <div class="mt-3 h-3 w-16 animate-pulse rounded-full bg-white/8" />
        </div>
      </div>
    </div>

    <div v-else-if="!boards.length" class="rounded-2xl border border-dashed border-white/10 bg-white/[0.03] px-5 py-9 text-center">
      <p class="text-sm font-medium text-white">No favorite boards yet</p>
      <p class="mt-1 text-sm text-slate-400">Mark boards as favorite and they will appear here.</p>
    </div>

    <div v-else class="grid gap-4 md:grid-cols-3">
      <article
        v-for="board in boards"
        :key="board.title"
        class="group overflow-hidden rounded-2xl border border-white/10 bg-white/[0.04] transition duration-300 hover:-translate-y-1 hover:border-sky-400/35 hover:bg-white/[0.06]"
        @click="$emit('open-board', board)"
      >
        <div class="relative h-28 overflow-hidden" :style="{ background: board.image }">
          <div class="absolute inset-0 bg-[radial-gradient(circle_at_20%_10%,rgba(255,255,255,0.45),transparent_4%),radial-gradient(circle_at_35%_22%,rgba(255,255,255,0.24),transparent_3%),linear-gradient(180deg,transparent,rgba(2,6,17,0.78))]" />
          <div class="absolute bottom-3 left-3">
            <MemberStack :members="board.members" :extra="board.extraMembers" />
          </div>
        </div>
        <div class="flex items-start justify-between gap-3 p-4">
          <div class="min-w-0">
            <h3 class="truncate text-sm font-semibold text-white">{{ board.title }}</h3>
            <p class="mt-1 text-xs text-slate-400">{{ board.tasks }} tasks</p>
          </div>
          <button class="shrink-0 text-amber-400 transition hover:scale-110" type="button" aria-label="Toggle favorite" @click.stop="$emit('toggle-favorite', board)">
            <IconGlyph name="star" class="h-5 w-5 fill-amber-400" />
          </button>
        </div>
      </article>
    </div>
  </DashboardCard>
</template>
