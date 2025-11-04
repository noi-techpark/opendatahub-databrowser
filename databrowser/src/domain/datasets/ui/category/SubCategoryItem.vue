<!--
SPDX-FileCopyrightText: NOI Techpark <digital@noi.bz.it>

SPDX-License-Identifier: AGPL-3.0-or-later
-->

<template>
  <div
    class="relative pb-2"
    :class="{
      'has-error': hasError,
      'my-1 rounded-lg border p-2': hasDeprecationInfo || referenceInfo != null,
      'border-deprecated': hasDeprecationInfo,
      'border-reference': referenceInfo != null,
    }"
  >
    <div
      v-if="hasTitleOrTooltip"
      class="relative flex items-center justify-between py-1"
    >
      <div
        class="font-semibold"
        :class="[{ 'text-hint-error': hasEmptyValue }]"
      >
        {{ title }}
        <span v-if="required">*</span>
      </div>
      <div
        v-if="tooltip != null"
        class="size-4 text-green-400"
        :title="tooltip"
      >
        <IconInfo />
      </div>
    </div>
    <span v-if="hasEmptyValue" class="text-hint-error">/</span>
    <slot v-else></slot>
    <ul v-if="hasError" class="mt-1 text-error">
      <li v-for="(err, index) in errors" :key="index">
        {{ err }}
      </li>
    </ul>

    <div
      v-if="hasDeprecationInfo || !!referenceInfo"
      class="mt-2 flex flex-col gap-2"
    >
      <div
        v-for="(item, i) in availableInfo"
        :key="i"
        class="flex flex-wrap items-center justify-between gap-3 rounded px-2 py-3 text-sm"
        :class="{
          'bg-deprecated/10 text-deprecated': item.type === 'deprecation',
          'bg-reference/10 text-reference': item.type === 'reference',
        }"
      >
        <div v-if="item.type === 'reference' && referenceInfo">
          <p class="mb-3 text-black">
            {{ item.description }}

            <a :href="referenceInfo!.url" class="text-hint-info">
              {{ referenceInfo!.url }}
            </a>
          </p>

          <p
            v-for="refDetail in referenceInfo.referenceDetailViewUrls"
            :key="refDetail.url"
          >
            <span
              class="cursor-pointer uppercase text-hint-info underline"
              @click="
                onGoToReference(
                  refDetail.url,
                  referenceInfo.origin,
                  refDetail.reference
                )
              "
            >
              {{ t('datasets.navigation.detailView') }}
              <span v-if="refDetail.reference"
                >({{ refDetail.reference }})</span
              >
            </span>
          </p>
        </div>
        <p v-else>{{ item.description }}</p>
        <TagCustom
          :type="item.type === 'reference' ? 'reference' : 'purple'"
          :text="item.type === 'reference' ? 'Reference' : 'Deprecated'"
          has-dot
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ComputedRef } from 'vue';
import IconInfo from '../../../../components/svg/IconInfo.vue';
import TagCustom from '../../../../components/tag/TagCustom.vue';

import { DeprecationInfo, ReferenceInfo } from '../../config/types';
import { useI18n } from 'vue-i18n';
import { useGoToReferenceAttributeDialogStore } from '../common/dialogs/goToReferenceAttributeDialog/goToReferenceAttributeDialogStore';

const { t } = useI18n();

const goToReferenceAttributeDialogStore =
  useGoToReferenceAttributeDialogStore();

enum AvailableInfoType {
  reference = 'reference',
  deprecation = 'deprecation',
}

const props = defineProps<{
  title?: string;
  tooltip?: string;
  required?: boolean;
  deprecationInfo?: DeprecationInfo[];
  errors?: string[];
  hasEmptyValue?: boolean;
  referenceInfo?: ReferenceInfo;
}>();

const hasTitleOrTooltip = computed(
  () => (props.title != null && props.title.length > 0) || props.tooltip != null
);

const hasError = computed(
  () => props.errors != null && props.errors.length > 0
);

const hasDeprecationInfo = computed(
  () => props.deprecationInfo != null && props.deprecationInfo.length > 0
);

const availableDeprecationInfo = computed(() => {
  return props.deprecationInfo
    ? props.deprecationInfo.map((item) => item.deprecations).flat() || []
    : [];
});

const availableInfo: ComputedRef<
  {
    type: AvailableInfoType;
    description: string;
    pathToDeprecation?: string;
  }[]
> = computed(() => {
  const referenceInfo = props.referenceInfo
    ? [
        {
          type: AvailableInfoType.reference,
          description: t('datasets.detailView.thisIsAReferenceOfDataset'),
        },
      ]
    : [];

  return [
    ...availableDeprecationInfo.value.map((item) => ({
      ...item,
      description: item.description || 'This field is deprecated',
      type: AvailableInfoType.deprecation,
    })),
    ...referenceInfo,
  ];
});

const onGoToReference = (
  url: string,
  origin: string,
  referenceName?: string
) => {
  goToReferenceAttributeDialogStore.referenceUrl = url;
  goToReferenceAttributeDialogStore.attributeName = `${origin}${
    referenceName ? ' (' + referenceName + ')' : ''
  }`;
  goToReferenceAttributeDialogStore.show();
};
</script>
