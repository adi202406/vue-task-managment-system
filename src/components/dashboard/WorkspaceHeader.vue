<script setup>
import IconGlyph from './IconGlyph.vue'

defineProps({
  workspace: {
    type: Object,
    required: true,
  },
  loading: {
    type: Boolean,
    default: false,
  },
  readonly: {
    type: Boolean,
    default: false,
  },
})

defineEmits(['invite'])
</script>

<template>
  <section class="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
    <div v-if="loading" class="w-full max-w-2xl">
      <div class="h-3 w-48 animate-pulse rounded-full bg-white/10" />
      <div class="mt-4 h-10 w-80 max-w-full animate-pulse rounded-full bg-white/10" />
      <div class="mt-3 h-4 w-full animate-pulse rounded-full bg-white/8" />
    </div>

    <div v-else>
      <p class="text-xs uppercase tracking-[0.3em] text-sky-300/70">Workspace Command Center</p>
      <h1 class="mt-3 text-3xl font-semibold tracking-tight text-white sm:text-4xl">
        {{ workspace.name }}
      </h1>
      <p class="mt-2 max-w-2xl text-sm leading-6 text-slate-400">{{ workspace.description }}</p>
      <p class="mt-3 flex flex-wrap items-center gap-2 text-xs text-slate-400">
        <span class="rounded-full border border-sky-400/25 bg-sky-400/10 px-3 py-1 text-sky-200 capitalize">{{ workspace.visibility }}</span>
        <span class="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1">{{ workspace.members }} members</span>
      </p>
    </div>

    <div class="flex flex-wrap items-center gap-3">
      <button v-if="!readonly" class="inline-flex h-10 items-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-4 text-sm font-medium text-slate-200 transition hover:border-sky-400/40 hover:bg-sky-400/10 hover:text-sky-200" @click="$emit('invite')">
        <IconGlyph name="invite" class="h-4 w-4" />
        Invite Members
      </button>
      <button class="grid h-10 w-10 place-items-center rounded-xl border border-white/10 bg-white/[0.04] text-slate-300 transition hover:border-sky-400/40 hover:text-sky-300" aria-label="More actions">
        <IconGlyph name="dots" />
      </button>
    </div>
  </section>
</template>
