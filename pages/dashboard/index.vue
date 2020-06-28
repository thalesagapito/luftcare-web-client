<template lang="pug">
  h1 Dashboard
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
