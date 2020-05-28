<template lang="pug">
</template>

<script lang="ts">
import Vue from 'vue';
import { RegisteredLayout } from '~/layouts/RegisteredLayout';

type Data = {};
type Methods = {};
type Computed = {};
type Props = {};

export default Vue.extend<Data, Methods, Computed, Props>({
  layout: 'dashboard' as RegisteredLayout,
});
</script>

<style lang="postcss" scoped></style>
