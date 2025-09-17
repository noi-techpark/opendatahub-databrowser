<!--
SPDX-FileCopyrightText: NOI Techpark <digital@noi.bz.it>

SPDX-License-Identifier: AGPL-3.0-or-later
-->

<template>
  <InfoPopover>
    <PopoverCustomPanel>
      <PopoverContentHeader class="pb-0">
        {{
          t(
            'datasets.toolBox.exportDatasets.download.infoPopup.header'
          )
        }}
      </PopoverContentHeader>
      <PopoverContent class="flex max-w-sm flex-col gap-3 pt-2">
        {{
          t(
            'datasets.toolBox.exportDatasets.download.infoPopup.body'
          )
        }}
        <ButtonExternalLink
          class="flex items-center justify-center p-2"
          target="_blank"
          :href="
            t(
              'datasets.toolBox.exportDatasets.download.infoPopup.linkHref'
            )
          "
          :size="Size.xs"
          :variant="Variant.ghost"
        >
          {{
            t(
              'datasets.toolBox.exportDatasets.download.infoPopup.linkText'
            )
          }}
        </ButtonExternalLink>
      </PopoverContent>
    </PopoverCustomPanel>
  </InfoPopover>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import ButtonExternalLink from '../../../../../components/button/ButtonExternalLink.vue';
import { Size, Variant } from '@/components/button/types.ts';
import InfoPopover from '../../../../../components/popover/InfoPopover.vue';
import PopoverContent from '../../../../../components/popover/PopoverContent.vue';
import PopoverContentHeader from '../../../../../components/popover/PopoverContentHeader.vue';
import PopoverCustomPanel from '../../../../../components/popover/PopoverCustomPanel.vue';

const { t } = useI18n();
</script>
