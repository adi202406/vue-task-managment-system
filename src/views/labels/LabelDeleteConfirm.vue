<script setup>
defineProps({
  show: { type: Boolean, default: false },
  label: { type: Object, default: null },
})

const emit = defineEmits(['close', 'confirm'])

function handleConfirm() {
  emit('confirm')
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
      <div v-if="show" class="fixed inset-0 z-50 grid place-items-center bg-black/60 px-4 backdrop-blur-sm" @click.self="handleClose">
        <div class="w-full max-w-md rounded-2xl border border-white/10 bg-[rgba(5,10,24,0.96)] p-5 shadow-[0_24px_90px_rgba(0,0,0,0.5)]">
          <h2 class="text-lg font-bold text-white">Delete Label</h2>
          <p class="mt-3 text-sm leading-6 text-slate-400">
            Are you sure you want to delete label <strong class="text-white">"{{ label?.name }}"</strong>? This action cannot be undone.
          </p>
          <div class="mt-6 flex justify-end gap-3">
            <button class="h-9 rounded-lg border border-white/10 bg-white/[0.04] px-4 text-xs font-semibold text-slate-200 hover:bg-white/[0.08] transition cursor-pointer" type="button" @click="handleClose">
              Cancel
            </button>
            <button class="h-9 rounded-lg bg-rose-600 hover:bg-rose-500 px-4 text-xs font-semibold text-white transition cursor-pointer" type="button" @click="handleConfirm">
              Delete Label
            </button>
          </div>
        </div>
      </div>
    </transition>
  </teleport>
</template>
