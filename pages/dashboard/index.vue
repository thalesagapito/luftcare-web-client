<template lang="pug">
  .dashboard-page-wrapper
    .text-gray-600.text-4xl.mt-6 Em construção...
</template>

<script lang="ts">
import Vue from 'vue';
import { RegisteredLayout, RegisteredMiddleware } from '@/enums';

export default Vue.extend({
  middleware: RegisteredMiddleware.isUserAuthenticated,
  layout: RegisteredLayout.dashboard,
});
</script>

<style lang="postcss" scoped>
</style>
