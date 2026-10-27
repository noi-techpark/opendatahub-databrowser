// SPDX-FileCopyrightText: NOI Techpark <digital@noi.bz.it>
//
// SPDX-License-Identifier: AGPL-3.0-or-later

import EditorWorker from 'monaco-editor/editor/editor.worker?worker';
import JsonWorker from 'monaco-editor/languages/features/json/json.worker?worker';

self.MonacoEnvironment = {
  getWorker(_m: string, label: string) {
    return label === 'json' ? new JsonWorker() : new EditorWorker();
  },
};
