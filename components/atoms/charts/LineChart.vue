<script lang="ts">
import Vue from 'vue';
import { Line } from 'vue-chartjs';
import { RecordPropsDefinition } from 'vue/types/options';

type Data = {};
type Methods = {};
type Computed = {};
export type Props = {
  data: Chart.ChartData;
  options?: Chart.ChartOptions;
};
export type Events = {};

export default Vue.extend<Data, Methods, Computed, Props>({
  extends: Line,
  props: {
    data: {
      type: Object,
      required: true,
      default: () => ({ labels: [], datasets: [] }),
    },
    options: {
      type: Object,
      required: false,
      default: () => ({
        maintainAspectRatio: false,
        responsive: true,
        aspectRatio: 2,
      }),
    },
  } as RecordPropsDefinition<Props>,
  mounted() {
    (this as unknown as Line).renderChart(this.data, this.options);
  },
});
</script>
