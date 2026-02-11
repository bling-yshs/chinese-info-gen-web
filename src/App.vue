<template>
  <div>
    <router-view />
    <Toaster position="bottom-right" rich-colors />
  </div>
</template>

<script setup lang="ts">
import { Toaster } from 'vue-sonner'
import 'vue-sonner/style.css'
</script>

<style scoped></style>
