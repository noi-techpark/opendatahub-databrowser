<!--
SPDX-FileCopyrightText: NOI Techpark <digital@noi.bz.it>

SPDX-License-Identifier: AGPL-3.0-or-later
-->

<template>
  <BaseAlert
    :type="type"
    :title="title"
    :hideIcon="true"
    hasCloseButton
    @close="emit('close')"
  >
    <div class="mt-2">
      <span v-if="errors.length <= 0">{{ errors }}</span>
      <ul v-else>
        <li v-for="error in errors" :key="error" class="list-inside list-disc">
          {{ error }}
        </li>
      </ul>
    </div>
    <slot></slot>
  </BaseAlert>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import BaseAlert from '../../../../../../components/alert/BaseAlert.vue';
import { AlertType } from '../../../../../../components/alert/types';

const { t } = useI18n();

const emit = defineEmits<{ (e: 'close'): void }>();

const props = defineProps<{
  type: AlertType;
  errors: string[];
}>();

const title = computed<string>(() => {
  if (props.type === 'error') {
    return t(
      'datasets.listView.toolBox.columnConfiguration.configIssue.errorTitle'
    );
  } else if (props.type === 'warning') {
    return t(
      'datasets.listView.toolBox.columnConfiguration.configIssue.warningTitle'
    );
  }
  return '';
});
</script>
