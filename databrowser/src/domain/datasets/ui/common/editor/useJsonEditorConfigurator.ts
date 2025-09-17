// SPDX-FileCopyrightText: NOI Techpark <digital@noi.bz.it>
// SPDX-License-Identifier: AGPL-3.0-or-later

import { ref, watch, type Ref, nextTick, computed, onUnmounted } from 'vue'
import type * as monaco from 'monaco-editor'
import { DiffEditMode } from '@/domain/datasets/view/types'

type Params = {
  diffEditMode: Ref<DiffEditMode>
  isEditEnabled: Ref<boolean>
  isDiffEditing?: Ref<boolean>
  onDiffStatsChange?: (added: number, deleted: number) => void
  onDiffStatsReset?: () => void
}

export function useJsonEditorConfigurator({
                                            diffEditMode,
                                            isEditEnabled,
                                            isDiffEditing,
                                            onDiffStatsChange,
                                            onDiffStatsReset,
                                          }: Params) {
  const diffEditorInstance = ref<monaco.editor.IStandaloneDiffEditor | null>(null)
  let diffListener: monaco.IDisposable | null = null

  const recomputeDiffStats = () => {
    const changes = diffEditorInstance.value?.getLineChanges?.() ?? []
    let added = 0
    let deleted = 0

    for (const c of changes) {
      const orig =
        (c.originalEndLineNumber ?? 0) - (c.originalStartLineNumber ?? 0) + 1
      const mod =
        (c.modifiedEndLineNumber ?? 0) - (c.modifiedStartLineNumber ?? 0) + 1
      deleted += Math.max(0, orig)
      added += Math.max(0, mod)
    }

    onDiffStatsChange?.(added, deleted)
  }

  const onDiffMounted = (editor: monaco.editor.IStandaloneDiffEditor) => {
    diffListener?.dispose()
    diffEditorInstance.value = editor
    diffListener = editor.onDidUpdateDiff(recomputeDiffStats)
    recomputeDiffStats()
  }

  const editorOptions = computed(() => ({
    fontSize: 14,
    minimap: {
      enabled: false,
    },
    automaticLayout: true,
    readOnly: !isEditEnabled.value,
  }))

  const diffEditorOptions = computed(() => ({
    renderSideBySide: diffEditMode.value === DiffEditMode.HORIZONTAL,
    renderSideBySideInlineBreakpoint: 0,
    automaticLayout: true,
    fontSize: 14,
    readOnly: !isEditEnabled.value,
  }))

  watch(diffEditMode, (mode) => {
    if (!diffEditorInstance.value) return
    diffEditorInstance.value.updateOptions({
      renderSideBySide: mode === DiffEditMode.HORIZONTAL,
    })
    nextTick(() => diffEditorInstance.value?.layout())
  })

  if (isDiffEditing) {
    watch(isDiffEditing, (v) => {
      if (!v) {
        onDiffStatsReset?.()
      }
    })
  }

  onUnmounted(() => {
    diffListener?.dispose()
    diffEditorInstance.value = null
    onDiffStatsReset?.()
  })

  return {
    editorOptions,
    diffEditorOptions,
    onDiffMounted,
  }
}
