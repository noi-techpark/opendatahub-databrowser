<!--
SPDX-FileCopyrightText: NOI Techpark <digital@noi.bz.it>

SPDX-License-Identifier: AGPL-3.0-or-later
-->

<template>
  <ToolBoxPanel>
    <ToolBoxSectionLabel>{{
      t('datasets.editView.toolBox.settings.defineViewPreferences')
    }}</ToolBoxSectionLabel>
    <ToolBoxCard>
      <ShowDeprecatedFields
        custom-text-classes="font-semibold"
        has-description
      />
    </ToolBoxCard>
    <ToolBoxCard>
      <ToolBoxCardHeader>
        {{ t('datasets.editView.toolBox.editHints.obligatory.header') }}
      </ToolBoxCardHeader>
      <ToolBoxCardBody>
        {{ t('datasets.editView.toolBox.editHints.obligatory.body') }}
      </ToolBoxCardBody>
    </ToolBoxCard>
  </ToolBoxPanel>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import ShowDeprecatedFields from '../../common/showDeprecatedFields/ShowDeprecatedFields.vue';
import ToolBoxCard from '../../toolBox/ToolBoxCard.vue';
import ToolBoxCardBody from '../../toolBox/ToolBoxCardBody.vue';
import ToolBoxCardHeader from '../../toolBox/ToolBoxCardHeader.vue';
import ToolBoxPanel from '../../toolBox/ToolBoxPanel.vue';
import ToolBoxSectionLabel from '../../toolBox/ToolBoxSectionLabel.vue';

const { t } = useI18n();
</script>
