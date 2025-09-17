<!--
SPDX-FileCopyrightText: NOI Techpark <digital@noi.bz.it>

SPDX-License-Identifier: AGPL-3.0-or-later
-->

<template>
  <div class="flex items-center gap-1">
    <span class="text-md font-bold text-green-400">+{{ diffAdds }}</span>
    <span class="text-md font-bold text-red-500">-{{ diffDels }}</span>
    <div class="ml-2 flex">
      <DiffChangesSquare :color="c" v-for="(c, i) in diffSquares" :key="i" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useDatasetViewStore } from '@/domain/datasets/view/store/datasetViewStore.ts';
import { storeToRefs } from 'pinia';
import { useSingleRecordLoad } from '@/domain/datasets/ui/common/load/useSingleRecordLoad.ts';
import DiffChangesSquare from '@/domain/datasets/ui/common/editor/DiffChangesSquare.vue';

const { data } = useSingleRecordLoad();

const datasetViewStore = useDatasetViewStore();
const { diffAdds, diffDels } = storeToRefs(datasetViewStore);

const modifiedLineCount = computed(() => {
  const rows: number =
    (data.value ? JSON.stringify(data.value, null, 2) : '').split('\n')
      .length || 1;
  return Math.min(rows, 150);
});

const diffSquares = computed(() => {
  const adds = diffAdds.value;
  const dels = diffDels.value;
  const total = adds + dels;
  const lines = modifiedLineCount.value || 1;

  if (total === 0) return Array(5).fill('gray');

  // quante celle riempire (0..5), min 1 se c’è almeno 1 change
  const filled = Math.max(1, Math.min(5, Math.round((total / lines) * 5)));

  // quota verde/rosso tra le celle riempite
  const green = Math.round(filled * (adds / total));
  const red = filled - green;

  const cells: Array<'green' | 'red' | 'gray'> = [];
  for (let i = 0; i < green; i++) cells.push('green');
  for (let i = 0; i < red; i++) cells.push('red');
  while (cells.length < 5) cells.push('gray');
  return cells;
});
</script>
<style scoped>
/*noinspection CssUnusedSymbol*/
.diff-square {
  margin: 0 1px;
}
</style>
