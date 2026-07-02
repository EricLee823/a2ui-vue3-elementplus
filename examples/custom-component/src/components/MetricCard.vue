<script setup lang="ts">
defineProps<{
  title?: string;
  value?: number;
  trend?: number[];
  status?: string;
  format?: 'percent' | 'number';
}>();

function formatValue(value = 0, format = 'number') {
  return format === 'percent' ? `${Math.round(value * 1000) / 10}%` : String(value);
}
</script>

<template>
  <article class="metric-card">
    <div>
      <p>{{ title }}</p>
      <strong>{{ formatValue(value, format) }}</strong>
    </div>
    <el-tag :type="status === 'healthy' ? 'success' : 'warning'" effect="plain">
      {{ status || 'unknown' }}
    </el-tag>
    <div class="sparkline" aria-hidden="true">
      <span
        v-for="(point, index) in trend || []"
        :key="index"
        :style="{ height: `${Math.max(12, point * 2)}px` }"
      />
    </div>
  </article>
</template>
