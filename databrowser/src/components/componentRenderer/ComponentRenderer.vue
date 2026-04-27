<!--
SPDX-FileCopyrightText: NOI Techpark <digital@noi.bz.it>

SPDX-License-Identifier: AGPL-3.0-or-later
-->

<template>
  <component
    :is="tagName"
    v-bind="attributes"
    .data="attributes"
    :editable="editable"
    @update="handleUpdate"
  ></component>
</template>

<script setup lang="ts">
import { toRefs, watch } from 'vue';
import {
  ArrayMapping,
  ObjectMapping,
} from '../../domain/datasets/config/types';
import { loadWebComponent } from '../../domain/webComponents/lazyLoadedWebComponent';
import { isRegisteredWebComponent } from '../../domain/webComponents/webComponentRegistry';
import { useUpdate } from './useUpdate';
import { PropertyUpdate } from '../../domain/datasets/ui/editView/store/types';

const props = withDefaults(
  defineProps<{
    tagName: string;
    attributes: Record<string, unknown>;
    objectMapping?: ObjectMapping;
    arrayMapping?: ArrayMapping;
    editable?: boolean;
    emitOnly?: boolean;
  }>(),
  {
    tagName: '',
    attributes: () => ({}),
    objectMapping: undefined,
    arrayMapping: undefined,
    editable: false,
    emitOnly: false,
  }
);

const emit = defineEmits<{
  update: [value: PropertyUpdate];
}>();

const { tagName, attributes, objectMapping, arrayMapping } = toRefs(props);

watch(
  () => tagName.value,
  (name) => {
    if (isRegisteredWebComponent(name)) {
      loadWebComponent(name);
    }
  },
  { immediate: true }
);

const storeUpdate = useUpdate(tagName, objectMapping, arrayMapping);

const handleUpdate = (update: PropertyUpdate) => {
  if (props.emitOnly) {
    emit('update', update);
  } else {
    storeUpdate(update);
  }
};
</script>
