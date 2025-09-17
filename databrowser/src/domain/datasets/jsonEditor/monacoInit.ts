// SPDX-FileCopyrightText: NOI Techpark <digital@noi.bz.it>
//
// SPDX-License-Identifier: AGPL-3.0-or-later

import EditorWorker from 'monaco-editor/esm/vs/editor/editor.worker?worker'
import JsonWorker from 'monaco-editor/esm/vs/language/json/json.worker?worker'

// @ts-expect-error monaco global variable
self.MonacoEnvironment = {
  getWorker(_m: string, label: string) {
    return label === 'json' ? new JsonWorker() : new EditorWorker()
  },
}
