<template>
  <TabList
    unstyled
    :pt="theme"
    :pt-options="{
      mergeProps: ptViewMerge,
    }"
  >
    <slot />
  </TabList>
</template>

<script setup lang="ts">
import type { TabListPassThroughOptions, TabListProps } from 'primevue/tablist'
import TabList from 'primevue/tablist'
import { ref } from 'vue'
import { ptViewMerge } from './utils'

interface Props extends /* @vue-ignore */ TabListProps {}
defineProps<Props>()

const theme = ref<TabListPassThroughOptions>({
  root: `inline-flex items-center rounded-lg border border-surface-200 bg-surface-100 p-1 dark:border-surface-700 dark:bg-surface-800`,
})
</script>
