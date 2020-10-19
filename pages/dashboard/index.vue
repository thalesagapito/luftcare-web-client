<template lang="pug">
  .dashboard-page-wrapper
</template>

<script lang="ts">
import Vue from 'vue';

import { RegisteredLayout, RegisteredMiddleware } from '~/enums';

export const DASHBOARD_PATH = '/dashboard';

export default Vue.extend({
  middleware: RegisteredMiddleware.isUserAuthenticated,
  layout: RegisteredLayout.dashboard,
});
</script>

<style lang="postcss" scoped>
</style>
