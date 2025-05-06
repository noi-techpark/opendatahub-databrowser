<!--
SPDX-FileCopyrightText: NOI Techpark <digital@noi.bz.it>

SPDX-License-Identifier: AGPL-3.0-or-later
-->

<!-- eslint-disable vue/no-v-html -->
<template>
  <div
    v-if="editor"
    class="rounded border border-gray-400 text-black focus-within:border-green-500"
  >
    <div class="control-group border-b border-gray-400 p-2">
      <div class="button-group flex flex-wrap gap-2">
        <button
          title="Bold"
          @click="editor.chain().focus().toggleBold().run()"
          :disabled="
            isHtmlMode || !editor.can().chain().focus().toggleBold().run()
          "
          :class="{ 'is-active': editor.isActive('bold') }"
        >
          <IconEditorBold />
        </button>
        <button
          title="Italic"
          @click="editor.chain().focus().toggleItalic().run()"
          :disabled="
            isHtmlMode || !editor.can().chain().focus().toggleItalic().run()
          "
          :class="{ 'is-active': editor.isActive('italic') }"
        >
          <IconEditorItalic />
        </button>
        <button
          title="Underline"
          @click="editor.chain().focus().toggleUnderline().run()"
          :disabled="
            isHtmlMode || !editor.can().chain().focus().toggleUnderline().run()
          "
          :class="{ 'is-active': editor.isActive('underline') }"
        >
          <IconEditorUnderline />
        </button>
        <button
          title="Strikethrough"
          @click="editor.chain().focus().toggleStrike().run()"
          :disabled="
            isHtmlMode || !editor.can().chain().focus().toggleStrike().run()
          "
          :class="{ 'is-active': editor.isActive('strike') }"
        >
          <IconEditorStrikethrough />
        </button>

        <button
          title="H1"
          @click="editor.chain().focus().toggleHeading({ level: 1 }).run()"
          :disabled="isHtmlMode"
          :class="{ 'is-active': editor.isActive('heading', { level: 1 }) }"
        >
          <IconEditorH1 />
        </button>
        <button
          title="H2"
          @click="editor.chain().focus().toggleHeading({ level: 2 }).run()"
          :disabled="isHtmlMode"
          :class="{ 'is-active': editor.isActive('heading', { level: 2 }) }"
        >
          <IconEditorH2 />
        </button>
        <button
          title="H3"
          @click="editor.chain().focus().toggleHeading({ level: 3 }).run()"
          :disabled="isHtmlMode"
          :class="{ 'is-active': editor.isActive('heading', { level: 3 }) }"
        >
          <IconEditorH3 />
        </button>
        <button
          title="H4"
          @click="editor.chain().focus().toggleHeading({ level: 4 }).run()"
          :disabled="isHtmlMode"
          :class="{ 'is-active': editor.isActive('heading', { level: 4 }) }"
        >
          <IconEditorH4 />
        </button>
        <button
          title="H5"
          @click="editor.chain().focus().toggleHeading({ level: 5 }).run()"
          :disabled="isHtmlMode"
          :class="{ 'is-active': editor.isActive('heading', { level: 5 }) }"
        >
          <IconEditorH5 />
        </button>
        <button
          title="H6"
          @click="editor.chain().focus().toggleHeading({ level: 6 }).run()"
          :disabled="isHtmlMode"
          :class="{ 'is-active': editor.isActive('heading', { level: 6 }) }"
        >
          <IconEditorH6 />
        </button>

        <button
          title="Blockquote"
          @click="editor.chain().focus().toggleBlockquote().run()"
          :disabled="isHtmlMode"
          :class="{ 'is-active': editor.isActive('blockquote') }"
        >
          <IconEditorQuoteText />
        </button>

        <button
          title="Ordered List"
          @click="editor.chain().focus().toggleOrderedList().run()"
          :disabled="isHtmlMode"
          :class="{ 'is-active': editor.isActive('orderedList') }"
        >
          <IconEditorListOrdered />
        </button>
        <button
          title="Unordered List"
          @click="editor.chain().focus().toggleBulletList().run()"
          :disabled="isHtmlMode"
          :class="{ 'is-active': editor.isActive('bulletList') }"
        >
          <IconEditorListUnordered />
        </button>
        <button
          title="Subscript"
          @click="editor.chain().focus().toggleSubscript().run()"
          :disabled="isHtmlMode"
          :class="{ 'is-active': editor.isActive('subscript') }"
        >
          <IconEditorSubscript />
        </button>
        <button
          title="Superscript"
          @click="editor.chain().focus().toggleSuperscript().run()"
          :disabled="isHtmlMode"
          :class="{ 'is-active': editor.isActive('superscript') }"
        >
          <IconEditorSuperscript />
        </button>

        <button
          title="Undo"
          @click="editor.chain().focus().undo().run()"
          :disabled="isHtmlMode || !editor.can().chain().focus().undo().run()"
        >
          <IconEditorUndo />
        </button>
        <button
          title="Redo"
          @click="editor.chain().focus().redo().run()"
          :disabled="isHtmlMode || !editor.can().chain().focus().redo().run()"
        >
          <IconEditorRedo />
        </button>

        <button
          title="Clear formatting"
          @click="editor.chain().focus().unsetAllMarks().run()"
          :disabled="isHtmlMode"
        >
          Clear formatting
        </button>
        <button
          title="Clear nodes"
          @click="editor.chain().focus().clearNodes().run()"
          :disabled="isHtmlMode"
        >
          Clear nodes
        </button>

        <button
          :title="isHtmlMode ? 'Switch to Editor' : 'Switch to HTML'"
          @click="isHtmlMode = !isHtmlMode"
        >
          <IconHtml5Line v-if="isHtmlMode" />
          <IconCodeLine v-else />
        </button>
      </div>
    </div>

    <editor-content v-if="!isHtmlMode" :editor="editor" class="p-2" />
    <textarea
      v-else
      :value="modelValue"
      @input="
        emit('update:modelValue', ($event.target as HTMLTextAreaElement).value)
      "
      class="w-full resize border-none"
      rows="15"
    ></textarea>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';

import Subscript from '@tiptap/extension-subscript';
import Superscript from '@tiptap/extension-superscript';
import Underline from '@tiptap/extension-underline';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import { EditorContent, useEditor } from '@tiptap/vue-3';
import IconCodeLine from './icons/IconCodeLine.vue';
import IconEditorBold from './icons/IconEditorBold.vue';
import IconEditorH1 from './icons/IconEditorH1.vue';
import IconEditorH2 from './icons/IconEditorH2.vue';
import IconEditorH3 from './icons/IconEditorH3.vue';
import IconEditorH4 from './icons/IconEditorH4.vue';
import IconEditorH5 from './icons/IconEditorH5.vue';
import IconEditorH6 from './icons/IconEditorH6.vue';
import IconEditorItalic from './icons/IconEditorItalic.vue';
import IconEditorListOrdered from './icons/IconEditorListOrdered.vue';
import IconEditorListUnordered from './icons/IconEditorListUnordered.vue';
import IconEditorQuoteText from './icons/IconEditorQuoteText.vue';
import IconEditorRedo from './icons/IconEditorRedo.vue';
import IconEditorStrikethrough from './icons/IconEditorStrikethrough.vue';
import IconEditorSubscript from './icons/IconEditorSubscript.vue';
import IconEditorSuperscript from './icons/IconEditorSuperscript.vue';
import IconEditorUnderline from './icons/IconEditorUnderline.vue';
import IconEditorUndo from './icons/IconEditorUndo.vue';
import IconHtml5Line from './icons/IconHtml5Line.vue';

const emit = defineEmits(['update:modelValue']);

const props = withDefaults(
  defineProps<{
    modelValue?: string;
    defaultHtmlOnEmpty?: string | null | undefined;
  }>(),
  {
    modelValue: undefined,
    defaultHtmlOnEmpty: undefined,
  }
);

const isHtmlMode = ref(false);

const editor = useEditor({
  content: props.modelValue ?? '',
  extensions: [
    StarterKit,
    Underline,
    Subscript,
    Superscript,
    Link.configure({
      linkOnPaste: true, // auto‑link pasted URLs
      autolink:    true, // auto‑link written URLs
      openOnClick: true, // open links on click
      defaultProtocol: 'https',
      HTMLAttributes: {
        target: '_blank',
        rel: 'noopener noreferrer',
      }
    }),
  ],
  onUpdate: ({ editor }) => {
    const value = editor.isEmpty ? props.defaultHtmlOnEmpty : editor.getHTML();
    emit('update:modelValue', value);
  },
});

watch(
  () => props.modelValue,
  (newValue) => {
    if (
      editor.value != null &&
      newValue != null &&
      newValue !== editor.value.getHTML()
    ) {
      editor.value.commands.setContent(newValue, false);
    }
  },
  { immediate: true }
);
</script>

<style>
.tiptap:focus-visible {
  @apply outline-none;
}

.button-group button {
  @apply rounded px-2 py-1 text-gray-700 hover:bg-gray-100;
}

.button-group button:disabled {
  @apply pointer-events-none opacity-50;
}

.button-group svg {
  @apply h-4;
}

.button-group .is-active {
  @apply bg-blue-100 text-blue-600;
}
</style>
