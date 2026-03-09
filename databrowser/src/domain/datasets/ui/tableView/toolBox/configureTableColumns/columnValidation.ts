// SPDX-FileCopyrightText: NOI Techpark <digital@noi.bz.it>
//
// SPDX-License-Identifier: AGPL-3.0-or-later

import { computed, ref } from 'vue';
import { AlertType } from '../../../../../../components/alert/types';
import { registeredComponents } from '../../../../../cellComponents/plugins/registerCellComponents';
import { PropertyConfig } from '../../../../config/types';

export const validateColumnConfiguration = (
  columns: PropertyConfig[]
): {
  violations: string[];
} => {
  const violations: string[] = [];

  const availableColumnComponents = new Set<string>();
  registeredComponents.forEach(([name, , meta]) => {
    if (meta.supportsTableView) {
      availableColumnComponents.add(name);
    }
  });

  columns.forEach((column, index) => {
    if (column.component) {
      if (!availableColumnComponents.has(column.component)) {
        violations.push(
          `Unsupported component "${column.component}" in column ${index + 1}`
        );
      }
    }
  });

  return { violations };
};

export const useColumnConfigurationValidation = () => {
  const configErrors = ref<string[]>([]);
  const configWarnings = ref<string[]>([]);

  const configIssues = computed<string[]>(() => {
    if (configErrors.value.length > 0) {
      return configErrors.value;
    } else {
      return configWarnings.value;
    }
  });

  const configIssueType = computed<
    Extract<AlertType, 'error' | 'warning'> | undefined
  >(() => {
    if (configErrors.value.length > 0) {
      return 'error';
    } else if (configWarnings.value.length > 0) {
      return 'warning';
    }
    return undefined;
  });

  const setConfigIssues = (errors: string[], warnings: string[]) => {
    configErrors.value = errors;
    configWarnings.value = warnings;
  };

  return {
    configIssues,
    configIssueType,
    setConfigIssues,
  };
};
