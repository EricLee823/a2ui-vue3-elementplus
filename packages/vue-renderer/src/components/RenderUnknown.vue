<script setup lang="ts">
defineProps<{
  surfaceId: string;
  componentId: string;
  componentType?: unknown;
}>();
</script>

<template>
  <div class="a2-render-unknown" role="note">
    Unknown A2UI component: {{ String(componentType ?? componentId) }}
  </div>
</template>
