<template lang="pug">
  h1 Dashboard
</template>

<script lang="ts">
import Vue from 'vue';
import { RegisteredLayout } from '~/layouts/RegisteredLayout';
import { RegisteredMiddleware } from '~/middleware/RegisteredMiddleware';

export default Vue.extend({
  middleware: ['isUserAuthenticated'] as RegisteredMiddleware,
  layout: 'dashboard' as RegisteredLayout,
});
</script>

<style lang="postcss" scoped>
</style>
