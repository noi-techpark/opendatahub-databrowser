<!--
SPDX-FileCopyrightText: NOI Techpark <digital@noi.bz.it>

SPDX-License-Identifier: AGPL-3.0-or-later
-->

<template>
  <ToolBoxPanel>
    <ToolBoxCard>
      <ToolBoxCardBody>
        <ColumnConfigurator />
      </ToolBoxCardBody>
    </ToolBoxCard>

    <ToolBoxCard>
      <ToolBoxCardBody>
        <ShowDeprecatedFields
          custom-wrapper-classes="flex justify-between"
          :use-container-classes="false"
          :use-wrapper-classes="false"
        />
      </ToolBoxCardBody>
    </ToolBoxCard>
  </ToolBoxPanel>
</template>

<script setup lang="ts">
import ShowDeprecatedFields from '../../common/showDeprecatedFields/ShowDeprecatedFields.vue';
import ToolBoxCard from '../../toolBox/ToolBoxCard.vue';
import ToolBoxCardBody from '../../toolBox/ToolBoxCardBody.vue';
import ToolBoxPanel from '../../toolBox/ToolBoxPanel.vue';
import ColumnConfigurator from './configureTableColumns/ColumnConfigurator.vue';
</script>
