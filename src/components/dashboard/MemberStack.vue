<script setup>
defineProps({
  members: {
    type: Array,
    default: () => [],
  },
  extra: {
    type: Number,
    default: 0,
  },
})
</script>

<template>
  <div class="flex items-center">
    <span
      v-for="member in members"
      :key="member"
      class="-ml-2 first:ml-0 flex h-8 w-8 items-center justify-center rounded-full border-2 border-[#081225] bg-gradient-to-br from-sky-300 to-blue-700 text-[10px] font-bold text-white shadow-lg"
    >
      {{ member }}
    </span>
    <span v-if="extra" class="-ml-2 flex h-8 w-8 items-center justify-center rounded-full border-2 border-[#081225] bg-white/10 text-[10px] font-semibold text-slate-200">
      +{{ extra }}
    </span>
  </div>
</template>
