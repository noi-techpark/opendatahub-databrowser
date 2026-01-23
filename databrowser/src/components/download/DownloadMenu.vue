<!--
SPDX-FileCopyrightText: NOI Techpark <digital@noi.bz.it>

SPDX-License-Identifier: AGPL-3.0-or-later
-->

<template>
  <div
    class="flex items-center justify-between gap-2 rounded border bg-gray-50 py-px pl-4 pr-3"
    :class="widthClasses"
  >
    <PopoverCustom
      :offset="4"
      :left-offset="17"
      :z-index="1000"
      class="flex-1"
      trigger-container-classes="flex"
    >
      <template #trigger>
        <PopoverCustomButton
          class="flex flex-1 items-center focus-visible:outline-none md:justify-between"
          v-slot="{ open }"
        >
          <div
            class="flex w-[min(calc(100vw-245px),140px)] flex-col items-start"
          >
            <span
              class="max-w-full overflow-hidden text-ellipsis text-nowrap font-semibold"
            >
              {{ t('components.downloadMenu.title', { countActive }) }}
            </span>
            <span
              class="max-w-full overflow-hidden text-ellipsis text-nowrap text-xs text-dialog"
            >
              {{
                t('components.downloadMenu.subtitle', {
                  countCompleted,
                  countFailed,
                })
              }}
            </span>
          </div>

          <div class="flex items-center gap-1">
            <ButtonRounded :solid="false">
              <IconArrowDown class="size-7" :class="[{ 'rotate-180': open }]" />
            </ButtonRounded>

            <ButtonRounded :solid="false" @click="openDiscardDialog($event)">
              <IconClose class="size-7" />
            </ButtonRounded>
          </div>
        </PopoverCustomButton>
      </template>
      <template #container>
        <PopoverTransition>
          <PopoverPanel class="z-20">
            <ul
              class="flex max-h-[calc(100vh-100px)] w-[90vw] flex-col divide-y divide-gray-500 overflow-y-auto border bg-white md:w-[60vw]"
              :class="widthClasses"
            >
              <li
                v-for="download in downloadStore.downloads"
                :key="download.id"
                class="flex items-center justify-between gap-3 px-3 py-2"
              >
                <!-- Status icons -->
                <IconCheck
                  v-if="download.status === 'completed'"
                  class="size-5 shrink-0 rounded-full bg-green-500 text-white"
                />
                <IconErrorWarning
                  v-else-if="download.status === 'failed'"
                  class="size-5 shrink-0 rounded-full bg-hint-error text-white"
                />
                <InfiniteSpinner
                  v-else-if="download.status === 'in-progress'"
                  class="size-5 shrink-0"
                />

                <div class="flex grow items-center overflow-hidden">
                  <!-- Download name -->
                  <SimpleTooltip
                    :key="`${download.id}-filename`"
                    :text="(download.name  ?? '')"
                  >
                    <template #trigger>
                      <span
                        class="truncate"
                        :class="download.error ? 'w-1/2' : 'w-full'"
                      >
                        {{ download.name }}
                      </span>
                    </template>
                  </SimpleTooltip>
                  <!-- Download error -->
                  <SimpleTooltip
                    v-if="download.error"
                    :key="`${download.id}-error-message`"
                    :text="(download.error ?? '')"
                  >
                    <template #trigger>
                      <span
                        class="ml-2 w-1/2 shrink-0 truncate cursor-copy"
                        :class="copiedErrorId === download.id ? 'text-green-400' : 'text-hint-error'"
                        @click="copyError(download.id, download.error)"
                      >
                        {{ copiedErrorId === download.id ? t('components.downloadMenu.copied') : download.error }}
                      </span>
                    </template>
                  </SimpleTooltip>
                </div>

                <!-- Action buttons -->
                <ButtonRounded
                  v-if="download.status === 'completed'"
                  @click="saveDownload(download)"
                >
                  <IconDownload class="size-5" />
                </ButtonRounded>
                <ButtonRounded
                  v-else-if="download.status === 'failed'"
                  @click="downloadStore.retryDownload(download.id)"
                >
                  <IconReload class="size-5" />
                </ButtonRounded>
                <ButtonRounded
                  v-else-if="download.status === 'in-progress'"
                  @click="downloadStore.abortDownload(download.id)"
                >
                  <IconClose class="size-5" />
                </ButtonRounded>
              </li>
            </ul>
          </PopoverPanel>
        </PopoverTransition>
      </template>
    </PopoverCustom>

    <DiscardDownloadsDialog
      :is-open="isDiscardDialogOpen"
      @close="closeDiscardDialog"
      @discard="discardDownloads"
    />
  </div>
</template>

<script setup lang="ts">
import { PopoverPanel } from '@headlessui/vue';
import { computed, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { useDownloadStore } from '@/domain/download/downloadStore';
import ButtonRounded from '../button/ButtonRounded.vue';
import PopoverCustom from '../popover/PopoverCustom.vue';
import PopoverCustomButton from '../popover/PopoverCustomButton.vue';
import PopoverTransition from '../popover/PopoverTransition.vue';
import InfiniteSpinner from '../progress/InfiniteSpinner.vue';
import IconArrowDown from '../svg/IconArrowDown.vue';
import IconCheck from '../svg/IconCheck.vue';
import IconClose from '../svg/IconClose.vue';
import IconDownload from '../svg/IconDownload.vue';
import IconErrorWarning from '../svg/IconExclamationMark.vue';
import IconReload from '../svg/IconReload.vue';
import DiscardDownloadsDialog from './DiscardDownloadsDialog.vue';
import { saveDownload } from './utils';
import {useClipboard} from "@vueuse/core";
import SimpleTooltip from "@/components/tooltip/SimpleTooltip.vue";

const { t } = useI18n();

withDefaults(
  defineProps<{
    widthClasses?: string[];
  }>(),
  {
    widthClasses: () => [],
  }
);
const clipboard = useClipboard()
const downloadStore = useDownloadStore();

const countActive = computed(() => downloadStore.activeDownloads.length);
const countCompleted = computed(() => downloadStore.completedDownloads.length);
const countFailed = computed(() => downloadStore.failedDownloads.length);

const isDiscardDialogOpen = ref(false);
const copiedErrorId = ref<string | null>(null);

const copyError = (downloadId: string, error:string) => {
  clipboard.copy(error);
  copiedErrorId.value = downloadId;

  setTimeout(() => {
    if (copiedErrorId.value === downloadId) {
      copiedErrorId.value = null;
    }
  }, 3000);
}

const openDiscardDialog = (event: Event) => {
  isDiscardDialogOpen.value = true;
  event.stopPropagation();
  return false;
};

const closeDiscardDialog = () => {
  isDiscardDialogOpen.value = false;
};

const discardDownloads = () => {
  downloadStore.abortAllDownloads();
  downloadStore.removeAllDownloads();
};
</script>
