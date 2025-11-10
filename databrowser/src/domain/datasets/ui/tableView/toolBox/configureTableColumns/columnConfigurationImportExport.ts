// SPDX-FileCopyrightText: NOI Techpark <digital@noi.bz.it>
//
// SPDX-License-Identifier: AGPL-3.0-or-later

import { Ref } from 'vue';
import { PropertyConfig } from '../../../../config/types';
import { injectColumnConfiguration } from './columnConfiguration';

export const useColumnConfigurationImportExport = (
  columns: Ref<PropertyConfig[]>,
  applyChangesWithCheckpoint: ReturnType<
    typeof injectColumnConfiguration
  >['applyChangesWithCheckpoint']
) => {
  const exportConfiguration = () => {
    const dataStr =
      'data:text/json;charset=utf-8,' +
      encodeURIComponent(JSON.stringify(columns.value, null, 2));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute('href', dataStr);
    downloadAnchorNode.setAttribute('download', 'column-configuration.json');
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  };

  const importConfiguration = () => {
    const inputElement = document.createElement('input');
    inputElement.type = 'file';
    inputElement.accept = '.json,application/json';
    inputElement.onchange = (event: Event) => {
      const target = event.target as HTMLInputElement;
      if (target.files && target.files.length > 0) {
        const file = target.files[0];
        const reader = new FileReader();
        reader.onload = (e: ProgressEvent<FileReader>) => {
          if (e.target && typeof e.target.result === 'string') {
            try {
              const importedColumns = JSON.parse(e.target.result);
              if (Array.isArray(importedColumns)) {
                columns.value = importedColumns;
                applyChangesWithCheckpoint();
              } else {
                alert(
                  'Invalid column configuration format, expected an array.'
                );
              }
            } catch (error) {
              alert('Error parsing JSON file: ' + error);
            }
          }
        };
        reader.readAsText(file);
      }
    };
    inputElement.click();
    inputElement.remove();
  };

  return {
    exportConfiguration,
    importConfiguration,
  };
};
