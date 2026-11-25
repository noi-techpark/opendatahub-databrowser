<!--
SPDX-FileCopyrightText: NOI Techpark <digital@noi.bz.it>

SPDX-License-Identifier: AGPL-3.0-or-later
-->

<template>
  <div
    class="overflow-hidden rounded-md border border-gray-300 px-2"
    :class="{ 'h-full': height === 'fill' }"
    :style="contentStyle"
  >
    <CodeEditor
      :value="jsonText"
      language="json"
      theme="vs"
      height="100%"
      :options="editorOptions"
      @editor-did-mount="onEditorMounted"
    />
  </div>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, ref } from 'vue';
import type * as monaco from 'monaco-editor';
import { CodeEditor } from 'monaco-editor-vue3';

// Read-only Monaco editor for JSON data. Load it with defineAsyncComponent,
// so Monaco is only downloaded when JSON is actually shown.
const props = withDefaults(
  defineProps<{
    data: unknown;
    // content: grow with the content (up to maxHeight); fill: fill the parent
    height?: 'content' | 'fill';
    maxHeight?: string;
  }>(),
  { height: 'content', maxHeight: undefined }
);

const jsonText = computed(() => JSON.stringify(props.data, null, 2));

const editorOptions = {
  readOnly: true,
  domReadOnly: true,
  minimap: { enabled: false },
  lineNumbers: 'off' as const,
  glyphMargin: false,
  lineDecorationsWidth: 4,
  folding: true,
  showFoldingControls: 'always' as const,
  scrollBeyondLastLine: false,
  renderLineHighlight: 'none' as const,
  wordWrap: 'on' as const,
  fontSize: 13,
  automaticLayout: true,
  contextmenu: false,
  overviewRulerLanes: 0,
  padding: { top: 8, bottom: 8 },
  // Let the mouse wheel scroll the page once the editor reached its end
  scrollbar: { alwaysConsumeMouseWheel: false },
};

const editor = ref<monaco.editor.IStandaloneCodeEditor>();
const contentHeight = ref<number>();
let sizeListener: monaco.IDisposable | undefined;

const onEditorMounted = (instance: monaco.editor.IStandaloneCodeEditor) => {
  editor.value = instance;
  if (props.height === 'content') {
    contentHeight.value = instance.getContentHeight();
    sizeListener = instance.onDidContentSizeChange((e) => {
      if (e.contentHeightChanged) {
        contentHeight.value = e.contentHeight;
      }
    });
  }
};

const contentStyle = computed(() => {
  if (props.height !== 'content' || contentHeight.value == null) {
    return undefined;
  }
  // + 2px for the border
  const height = `${contentHeight.value + 2}px`;
  return props.maxHeight == null
    ? { height }
    : { height: `min(${height}, ${props.maxHeight})` };
});

onBeforeUnmount(() => sizeListener?.dispose());

defineExpose({
  foldAll: () => editor.value?.getAction('editor.foldAll')?.run(),
  unfoldAll: () => editor.value?.getAction('editor.unfoldAll')?.run(),
});
</script>
