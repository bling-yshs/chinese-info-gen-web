<template>
  <Tab
    unstyled
    :pt="theme"
    :pt-options="{
      mergeProps: ptViewMerge,
    }"
  >
    <slot />
  </Tab>
</template>

<script setup lang="ts">
import type { TabPassThroughOptions, TabProps } from 'primevue/tab'
import Tab from 'primevue/tab'
import { ref } from 'vue'
import { ptViewMerge } from './utils'

interface Props extends /* @vue-ignore */ TabProps {}
defineProps<Props>()

const theme = ref<TabPassThroughOptions>({
  root: `inline-flex cursor-pointer select-none items-center justify-center rounded-md px-3 py-1.5 font-medium text-surface-600 transition data-[p-active=true]:bg-surface-0 data-[p-active=true]:text-surface-900 data-[p-active=true]:shadow-sm hover:text-surface-900 dark:text-surface-300 dark:data-[p-active=true]:bg-surface-900 dark:data-[p-active=true]:text-surface-0 dark:hover:text-surface-0`,
})
</script>
