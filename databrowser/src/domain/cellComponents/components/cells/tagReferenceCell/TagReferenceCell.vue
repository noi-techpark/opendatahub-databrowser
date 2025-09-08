<!--
SPDX-FileCopyrightText: NOI Techpark <digital@noi.bz.it>

SPDX-License-Identifier: AGPL-3.0-or-later
-->

<template>
  <EditListCell :items="tags" :editable="editable">
    <template #table="{ items }">
      <AlertError
        v-if="url == null"
        title="Can not display tags, no URL defined"
      >
        This seems to be a configuration problem. Please contact
        <ContactSupportLink />
      </AlertError>
      <AlertError
        v-else-if="keySelector == null"
        title="Can not display tags, no key selector defined"
      >
        This seems to be a configuration problem. Please contact
        <ContactSupportLink />
      </AlertError>
      <AlertError
        v-else-if="labelSelector == null"
        title="Can not display tags, no label selector defined"
      >
        This seems to be a configuration problem. Please contact
        <ContactSupportLink />
      </AlertError>

      <LoadingState
        :is-loading="isLoading"
        :is-error="isError"
        :error="error"
      />
      <TagReferenceTable
        v-if="isSuccess || !editable"
        :tags="items"
        :options="options"
        :unique="uniqueValue"
        :tags-data="computedTagsData"
        :show-additional-data="showAdditionalDataValue"
      />
    </template>
  </EditListCell>
</template>

<script setup lang="ts">
import { computed, toRefs } from 'vue';
import AlertError from '../../../../../components/alert/AlertError.vue';
import ContactSupportLink from '../../../../../components/contact/ContactSupportLink.vue';
import LoadingState from '../../../../../components/loading/LoadingState.vue';
import { booleanOrStringToBoolean } from '../../../../utils/convertType';
import EditListCell from '../../utils/editList/EditListCell.vue';
import {
  useRemoteSelectOptionsWithMapper,
  withSelectors,
} from '../../utils/remoteSelectOptions/useRemoteSelectOptions';
import TagReferenceTable from './TagReferenceTable.vue';

type TagId = string;
interface TagData {
  Id: TagId;
  Type?: string | null;
  Source?: string | null;
}

const props = withDefaults(
  defineProps<{
    tags?: string[] | null;
    tagsData?: TagData[];
    url?: string;
    keySelector?: string;
    labelSelector?: string;
    unique?: boolean | string;
    sortByLabel?: boolean | string;
    editable?: boolean;
    showAdditionalData?: boolean | string;
  }>(),
  {
    tags: () => [],
    tagsData: () => [],
    url: undefined,
    keySelector: undefined,
    labelSelector: undefined,
    unique: true,
    sortByLabel: true,
    editable: true,
    showAdditionalData: false,
  }
);

const { tags, url, keySelector, labelSelector, unique, sortByLabel, editable, showAdditionalData } =
  toRefs(props);

const computedTagsData = computed(() => {
  if (props.tagsData && Array.isArray(props.tagsData)) {
    return props.tagsData;
  }
  
  return [];
});

const uniqueValue = computed(() =>
  booleanOrStringToBoolean(unique.value, true)
);

const showAdditionalDataValue = computed(() =>
  booleanOrStringToBoolean(showAdditionalData.value, false)
);

const { isLoading, isSuccess, isError, error, options } =
  useRemoteSelectOptionsWithMapper(
    url,
    sortByLabel,
    withSelectors(keySelector, labelSelector)
  );
</script>
