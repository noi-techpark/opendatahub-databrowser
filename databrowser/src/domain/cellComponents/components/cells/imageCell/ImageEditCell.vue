<!--
SPDX-FileCopyrightText: NOI Techpark <digital@noi.bz.it>

SPDX-License-Identifier: AGPL-3.0-or-later
-->

<template>
  <div v-if="isWriteable">
    <div v-if="src != null" class="flex">
      <div class="flex items-start gap-3 rounded-sm border-2 p-2">
        <ImageCell :src="src" :alt="alt" />
        <button type="button" title="Delete image" @click="deleteImage">
          <IconDelete class="text-delete" />
        </button>
      </div>
    </div>
    <FileUpload
      v-else
      type="image"
      text="Drop your image here"
      @upload-success="uploadSuccess"
    />
  </div>
  <ImageCell v-else :src="src" :width="width" :alt="alt" />
</template>

<script setup lang="ts">
import { toRefs } from 'vue';
import IconDelete from '../../../../../components/svg/IconDelete.vue';
import FileUpload from '../../utils/upload/FileUpload.vue';
import { useWriteable } from '../../utils/writeable/useWriteable';
import ImageCell from './ImageCell.vue';

const emit = defineEmits(['update']);

const props = withDefaults(
  defineProps<{
    width?: string;
    alt?: string;
    src?: string;
    editable?: boolean;
    readonly?: string | boolean;
  }>(),
  {
    width: undefined,
    alt: undefined,
    src: undefined,
    editable: true,
    readonly: false,
  }
);

const { src, editable, readonly } = toRefs(props);
const isWriteable = useWriteable({ editable, readonly });

const deleteImage = () => update();

const uploadSuccess = (urls: string[]) => {
  if (urls == null || urls[0] == null) {
    return;
  }
  update(urls[0]);
};

const update = (value?: string | undefined) =>
  emit('update', { prop: 'src', value });
</script>
