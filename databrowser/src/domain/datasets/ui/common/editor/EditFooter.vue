<!--
SPDX-FileCopyrightText: NOI Techpark <digital@noi.bz.it>

SPDX-License-Identifier: AGPL-3.0-or-later
-->

<template>
  <div class="flex w-full justify-between bg-green-500 font-semibold">
    <EditFooterButton
      :class="[{ 'opacity-50': isSaving }]"
      :disabled="isSaving"
      @click="cancel"
    >
      <IconClose class="mr-1" />
      <span class="inline md:hidden">
        {{ t('datasets.editView.footer.cancelMobile') }}
      </span>
      <span class="hidden md:inline">
        {{ t('datasets.editView.footer.cancel') }}
      </span>
    </EditFooterButton>
    <EditFooterButton v-if="isSaving" :disabled="isSaving">
      <IconLoading class="mr-2 h-4" />
      {{ t('datasets.editView.footer.saving') }}
    </EditFooterButton>
    <EditFooterButton v-else @click="save" :disabled="isSaveDisabled">
      <IconCheck class="mr-1" />
      <span class="inline md:hidden">
        {{ t('datasets.editView.footer.saveMobile') }}
      </span>
      <span class="hidden md:inline">
        {{ t('datasets.editView.footer.save') }}
      </span>
    </EditFooterButton>
  </div>
</template>

<script setup lang="ts">
import { useMagicKeys } from '@vueuse/core';
import { watch } from 'vue';
import { useI18n } from 'vue-i18n';
import IconCheck from '../../../../../components/svg/IconCheck.vue';
import IconClose from '../../../../../components/svg/IconClose.vue';
import IconLoading from '../../../../../components/svg/IconLoading.vue';
import EditFooterButton from '../../editView/EditFooterButton.vue';

const { t } = useI18n();

const props = defineProps<{
  isSaving: boolean,
  isSaveDisabled: boolean
}>();

const emit = defineEmits(['cancel', 'save']);

const { alt_s, escape } = useMagicKeys();

const cancel = () => emit('cancel');
const save = () => emit('save');

watch(escape, (key) => {
  if (key && !props.isSaving) {
    cancel();
  }
});

watch(alt_s, (key) => {
  if (key && !props.isSaving) {
    save();
  }
});
</script>
