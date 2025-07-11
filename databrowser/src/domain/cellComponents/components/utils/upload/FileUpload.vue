<!--
SPDX-FileCopyrightText: NOI Techpark <digital@noi.bz.it>

SPDX-License-Identifier: AGPL-3.0-or-later
-->

<template>
  <div>
    <div v-if="isUploadError" class="bg-red-200">
      {{ uploadError }}
    </div>
    <AlertError
      v-if="fileTypesNotAccepted != null"
      :title="fileTypesNotAccepted.title"
    >
      {{ fileTypesNotAccepted.content }}
    </AlertError>
    <div
      ref="dropZoneRef"
      class="hidden h-24 w-full items-center justify-center rounded border-2 border-dashed md:flex"
      :class="{ 'border-green-400': isOverDropZone, hidden: uploading }"
    >
      {{ uploadText }} or &nbsp;
      <button type="button" class="text-green-500" @click="open()">
        browse
      </button>
    </div>
    <div class="flex w-full justify-center md:hidden">
      <button
        type="button"
        class="inline-flex h-9 items-center gap-2 rounded border border-transparent bg-green-500 px-3 py-1 text-base leading-tight text-white no-underline hover:bg-green-700 focus-visible:bg-green-700 focus-visible:outline-none md:flex"
        @click="open()"
      >
        Add files
      </button>
    </div>
    <div
      v-if="uploading"
      class="flex h-24 w-full flex-col justify-between rounded border-2 p-3"
    >
      <div class="flex w-full items-center justify-between">
        <span class="font-semibold">{{ files?.length }} Files Uploading</span>
        <button title="Abort upload" @click="uploadAbortController.abort()">
          <IconDelete class="text-delete" />
        </button>
      </div>
      <div>{{ uploadProgress }}%</div>
      <div class="w-full">
        <ProgressBar :percentage="uploadProgress" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { toRefs, useDropZone } from '@vueuse/core';
import IconDelete from '../../../../../components/svg/IconDelete.vue';
import ProgressBar from '../../../../../components/progress/ProgressBar.vue';
import { FileType } from './types';
import {
  isFileTypeAccepted,
  useFileDialogForType,
} from './useFileDialogForType';
import AlertError from '../../../../../components/alert/AlertError.vue';
import { useUploadForType } from '../../../../api/useUpload';

const emit = defineEmits(['uploadSuccess', 'uploadError']);

const props = defineProps<{
  type: FileType;
  text?: string;
  multiple?: boolean;
}>();

const { type: uploadType } = toRefs(props);

const uploadText = computed(() => {
  if (props.text != null) {
    return props.text;
  }

  if (props.multiple === true) {
    return 'Drop your files here';
  }

  return 'Drop your file here';
});

const dropZoneRef = ref<HTMLDivElement>();
const fileTypesNotAccepted = ref<{ title: string; content: string }>();

const onDrop = (filesFromDropZone: File[] | null) => {
  if (filesFromDropZone == null) {
    return;
  }

  // Check if all files have the correct file type. This check is done here
  // because the drag & drop file selection does not support file type filters
  const notAccepted = filesFromDropZone.filter(
    (file) => !isFileTypeAccepted(props.type, file.type)
  );
  if (notAccepted.length > 0) {
    fileTypesNotAccepted.value = {
      title: `Some file have file types that are not accepted (accepted: ${props.type})`,
      content: notAccepted.map((f) => f.name).join(', '),
    };
    return;
  }

  fileTypesNotAccepted.value = undefined;

  fileNames.value = filesFromDropZone.map((item) => item.name);

  uploadFiles(filesFromDropZone);
};

const fileNames = ref([] as string[]);

const { isOverDropZone } = useDropZone(dropZoneRef, onDrop);

const { files, open } = useFileDialogForType({
  multiple: props.multiple,
  type: props.type,
});

const {
  isUploadError,
  uploading,
  uploadAbortController,
  uploadError,
  uploadProgress,
  uploadFiles,
  onUploadSuccess,
  onUploadError,
} = useUploadForType(uploadType);

watch(files, (filesFromFileDialog) => {
  if (filesFromFileDialog == null) {
    return;
  }

  const filesToUpload = Array.from(filesFromFileDialog);
  fileNames.value = filesToUpload.map((item) => item.name);

  // Trigger file upload
  uploadFiles(filesToUpload);
});

onUploadSuccess((...urls: string[]) =>
  emit('uploadSuccess', urls, fileNames.value)
);

onUploadError((message: string) => emit('uploadError', message));
</script>
