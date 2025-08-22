<!--
SPDX-FileCopyrightText: NOI Techpark <digital@noi.bz.it>

SPDX-License-Identifier: AGPL-3.0-or-later
-->

<template>
  <ToolBoxPanel>
    <ToolBoxSectionLabel>{{
      t('datasets.detailView.toolBox.settings.defineViewPreferences')
    }}</ToolBoxSectionLabel>

    <div class="flex flex-col gap-3">
      <ShowEmptyFields custom-text-classes="font-semibold" has-description />
      <ShowDeprecatedFields
        custom-text-classes="font-semibold"
        has-description
      />
      <ShowReferencesFields
        custom-text-classes="font-semibold"
        has-description
      />
    </div>
  </ToolBoxPanel>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import ShowDeprecatedFields from '../../common/showDeprecatedFields/ShowDeprecatedFields.vue';
import ShowEmptyFields from '../../common/showEmptyFields/ShowEmptyFields.vue';
import ShowReferencesFields from '../../common/showReferencesFields/ShowReferencesFields.vue';
import ToolBoxPanel from '../../toolBox/ToolBoxPanel.vue';
import ToolBoxSectionLabel from '../../toolBox/ToolBoxSectionLabel.vue';

const { t } = useI18n();
</script>
