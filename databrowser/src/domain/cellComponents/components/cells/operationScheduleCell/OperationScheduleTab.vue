<!--
SPDX-FileCopyrightText: NOI Techpark <digital@noi.bz.it>

SPDX-License-Identifier: AGPL-3.0-or-later
-->

<template>
  <EditListTab :items="items">
    <template #tabLabel="{ index }">
      <div class="w-full">
        {{
          t('components.operationSchedule.tab.seasonWithIndex', {
            index: index + 1,
          })
        }}
      </div>
    </template>

    <template #addItems>
      <EditListAddButton
        :text="t('components.operationSchedule.addSeason')"
        @click="addItems([{ type: operationScheduleTypeDefaultValue }])"
      />
    </template>

    <template
      #body="{ item, index }: { item: OperationScheduleEntry; index: number }"
    >
      <div class="flex flex-wrap gap-8 md:flex-nowrap">
        <div class="basis-full md:order-1 md:basis-1/3">
          <div class="my-3 font-semibold text-black">
            {{ t('components.operationSchedule.tab.insertSeasonData') }}
          </div>
          <SubCategoryItem
            :title="t('components.operationSchedule.tab.seasonName')"
          >
            <StringCell
              :text="item.name"
              :editable="editable"
              @input="updateItem(index, { name: $event.target.value })"
            />
          </SubCategoryItem>
          <SubCategoryItem
            :title="t('components.operationSchedule.tab.seasonStart')"
          >
            <!-- title="Season Start" -->
            <DateCell
              :date="item.start"
              :editable="editable"
              type="datetime"
              @update="updateItem(index, { ...item, start: $event.value })"
            />
          </SubCategoryItem>
          <SubCategoryItem
            :title="t('components.operationSchedule.tab.seasonEnd')"
          >
            <DateCell
              :date="item.stop"
              :editable="editable"
              type="datetime"
              @update="updateItem(index, { ...item, stop: $event.value })"
            />
          </SubCategoryItem>
          <SubCategoryItem
            :title="t('components.operationSchedule.tab.seasonType')"
          >
            <SelectWithOptionsCell
              v-if="editable"
              :value="item.type"
              :editable="editable"
              :options="operationScheduleTypeOptions"
              @update="updateItem(index, { ...item, type: $event.value })"
            />
            <span v-else>{{ getOperationScheduleTypeLabel(item.type) }}</span>
          </SubCategoryItem>

          <div class="my-3 font-semibold text-black">
            {{ t('components.operationSchedule.tab.insertOpeningHours') }}
          </div>
          <div ref="operationScheduleTimesRef" class="flex flex-col gap-3">
            <div
              v-for="(time, scheduleTimeIndex) in item.operationScheduleTimes"
              :key="scheduleTimeIndex"
              class="rounded border p-2"
            >
              <div v-if="editable" class="flex justify-end text-delete">
                <button
                  @click="
                    deleteOperationScheduleTime(item, index, scheduleTimeIndex)
                  "
                >
                  <IconDelete />
                </button>
              </div>
              <SubCategoryItem
                :title="t('components.operationSchedule.tab.timeState')"
              >
                <SelectWithOptionsCell
                  v-if="editable"
                  class="opening-hours-state"
                  :value="time.State"
                  :editable="editable"
                  :options="operationScheduleTimeStateOptions"
                  @update="
                    updateOperationScheduleTime(
                      item,
                      index,
                      scheduleTimeIndex,
                      'State',
                      $event.value
                    )
                  "
                />
                <span v-else>{{
                  getOperationScheduleTimeStateLabel(time.State)
                }}</span>
              </SubCategoryItem>
              <SubCategoryItem
                :title="t('components.operationSchedule.tab.timeTimecode')"
              >
                <SelectWithOptionsCell
                  v-if="editable"
                  :value="time.Timecode"
                  :editable="editable"
                  :options="operationScheduleTimeCodeOptions"
                  @update="
                    updateOperationScheduleTime(
                      item,
                      index,
                      scheduleTimeIndex,
                      'Timecode',
                      $event.value
                    )
                  "
                />
                <span v-else>{{
                  getOperationScheduleTimeCodeLabel(time.Timecode)
                }}</span>
              </SubCategoryItem>
              <SubCategoryItem
                :title="t('components.operationSchedule.tab.timeStart')"
              >
                <DateCell
                  :date="time.Start"
                  :editable="editable"
                  type="time"
                  @update="
                    updateOperationScheduleTime(
                      item,
                      index,
                      scheduleTimeIndex,
                      'Start',
                      $event.value
                    )
                  "
                />
              </SubCategoryItem>
              <SubCategoryItem
                :title="t('components.operationSchedule.tab.timeEnd')"
              >
                <DateCell
                  :date="time.End"
                  :editable="editable"
                  type="time"
                  @update="
                    updateOperationScheduleTime(
                      item,
                      index,
                      scheduleTimeIndex,
                      'End',
                      $event.value
                    )
                  "
                />
              </SubCategoryItem>
              <SubCategoryItem
                :title="t('components.operationSchedule.tab.timeSelectDays')"
              >
                <div class="flex gap-1">
                  <ToggleButtonCell
                    v-for="day in operationScheduleTimeDays"
                    :key="day.key"
                    :text="day.label"
                    :enabled="(time as Record<string, boolean>)[day.key]"
                    :editable="editable"
                    @update="
                      updateOperationScheduleTime(
                        item,
                        index,
                        scheduleTimeIndex,
                        day.key,
                        $event.value
                      )
                    "
                  />
                </div>
              </SubCategoryItem>
            </div>
          </div>
          <EditListAddButton
            v-if="editable"
            class="mt-6"
            :text="t('components.operationSchedule.tab.timeAdd')"
            @click="addOperationScheduleTime(item, index)"
          />
        </div>
        <div class="basis-full md:order-3 md:basis-1/3">
          <div v-if="editable" class="rounded border">
            <div class="flex items-center justify-between bg-gray-50 px-4 py-3">
              <span class="font-semibold">Info &amp; action</span>
            </div>
            <div class="divide-y p-4">
              <div>
                <button
                  class="m-3 flex items-center gap-3"
                  @click="duplicateItem(index)"
                >
                  <IconCopy class="text-green-500" />
                  <span>Duplicate</span>
                </button>
              </div>
              <div>
                <button
                  class="mx-3 mt-3 flex items-center gap-3"
                  @click="deleteItems([index])"
                >
                  <IconDelete class="text-delete" />
                  <span>Delete</span>
                </button>
              </div>
            </div>
          </div>
        </div>
        <div class="basis-full md:order-2 md:basis-1/3">
          <div class="mb-3 rounded border">
            <div class="flex items-center justify-between bg-gray-50 px-4 py-3">
              <span class="font-semibold">
                {{ t('components.operationSchedule.tab.season') }}
              </span>
            </div>

            <div class="px-4 py-3">
              <div>
                {{ t('components.operationSchedule.tab.seasonName') }}:
                {{ item.name }}
              </div>
              <div>
                {{ t('components.operationSchedule.tab.seasonDate') }}:
                {{ formatSeasonDate(item.start, item.stop) }}
              </div>
              <div>
                {{ t('components.operationSchedule.tab.seasonType') }}:
                {{ getOperationScheduleTypeLabel(item.type) }}
              </div>
            </div>
          </div>

          <div
            v-for="(
              scheduleTime, scheduleTimeIndex
            ) in item.operationScheduleTimes ?? []"
            :key="scheduleTimeIndex"
            class="mb-3 rounded border"
          >
            <div class="flex items-center justify-between bg-gray-50 px-4 py-3">
              <span class="font-semibold">
                {{ getOperationScheduleTimeCodeLabel(scheduleTime.Timecode) }}
              </span>
              <div class="flex gap-3">
                <button @click="focusOpeningHour(scheduleTimeIndex)">
                  <IconEdit class="text-green-500" />
                </button>
                <button
                  @click="
                    deleteOperationScheduleTime(item, index, scheduleTimeIndex)
                  "
                >
                  <IconDelete class="text-delete" />
                </button>
              </div>
            </div>

            <div class="flex flex-col gap-2 px-4 py-3 md:flex-row">
              <OperationScheduleDayInfo :schedule-time="scheduleTime" />
            </div>
          </div>
        </div>
      </div>
    </template>
  </EditListTab>
</template>

<script setup lang="ts">
import { format as formatFn } from 'date-fns';
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';
import IconCopy from '../../../../../components/svg/IconCopy.vue';
import IconDelete from '../../../../../components/svg/IconDelete.vue';
import IconEdit from '../../../../../components/svg/IconEdit.vue';
import { DEFAULT_DATE_FORMAT } from '../../../../../config/utils';
import SubCategoryItem from '../../../../datasets/ui/category/SubCategoryItem.vue';
import EditListAddButton from '../../utils/editList/EditListAddButton.vue';
import { useInjectActionTriggers } from '../../utils/editList/actions/useActions';
import { useInjectEditMode } from '../../utils/editList/actions/useEditMode';
import EditListTab from '../../utils/editList/tab/EditListTab.vue';
import DateCell from '../dateCell/DateCell.vue';
import SelectWithOptionsCell from '../selectWithOptionsCell/SelectWithOptionsCell.vue';
import StringCell from '../stringCell/StringCell.vue';
import ToggleButtonCell from '../toggleCell/ToggleButtonCell.vue';
import OperationScheduleDayInfo from './OperationScheduleDayInfo.vue';
import {
  getOperationScheduleTimeCodeLabel,
  getOperationScheduleTimeStateLabel,
  getOperationScheduleTypeLabel,
  operationScheduleTimeCodeDefaultValue,
  operationScheduleTimeCodeOptions,
  operationScheduleTimeDays,
  operationScheduleTimeStateDefaultValue,
  operationScheduleTimeStateOptions,
  operationScheduleTypeDefaultValue,
  operationScheduleTypeOptions,
} from './operationScheduleOptions';
import { OperationScheduleEntry } from './types';

const { t } = useI18n();

defineProps<{ items: OperationScheduleEntry[] }>();

const { addItems, deleteItems, duplicateItem, updateItem } =
  useInjectActionTriggers<OperationScheduleEntry>();

const { editable } = useInjectEditMode();

const formatSeasonDate = (start?: string, stop?: string) => {
  if (start == null && stop != null) {
    return formatFn(new Date(stop), DEFAULT_DATE_FORMAT);
  }
  if (start != null && stop == null) {
    return formatFn(new Date(start), DEFAULT_DATE_FORMAT);
  }
  if (start != null && stop != null) {
    return `${formatFn(new Date(start), DEFAULT_DATE_FORMAT)} - ${formatFn(
      new Date(stop),
      DEFAULT_DATE_FORMAT
    )}`;
  }
  return '';
};

const updateOperationScheduleTime = (
  item: OperationScheduleEntry,
  itemIndex: number,
  timeIndex: number,
  key: string,
  value: string | number | boolean
) => {
  if (item.operationScheduleTimes == null) {
    item.operationScheduleTimes = [];
  }

  const result = item.operationScheduleTimes.map((time, index) =>
    timeIndex !== index ? time : { ...time, [key]: value }
  );

  item.operationScheduleTimes = result;

  updateItem(itemIndex, { ...item });
};

const addOperationScheduleTime = (
  item: OperationScheduleEntry,
  index: number
) => {
  if (item.operationScheduleTimes == null) {
    item.operationScheduleTimes = [];
  }

  const result = [
    ...item.operationScheduleTimes,
    {
      State: operationScheduleTimeStateDefaultValue,
      Timecode: operationScheduleTimeCodeDefaultValue,
      Start: '',
      End: '',
    },
  ];

  item.operationScheduleTimes = result;

  updateItem(index, { ...item });
};

const deleteOperationScheduleTime = (
  item: OperationScheduleEntry,
  itemIndex: number,
  scheduleTimeIndex: number
) => {
  if (item.operationScheduleTimes == null) {
    return;
  }

  const result = item.operationScheduleTimes.filter(
    (time, idx) => idx !== scheduleTimeIndex
  );

  item.operationScheduleTimes = result;

  updateItem(itemIndex, { ...item });
};

const operationScheduleTimesRef = ref<HTMLDivElement>();

const focusOpeningHour = (index: number) => {
  if (operationScheduleTimesRef.value != null) {
    const openingHoursStateElements =
      operationScheduleTimesRef.value.querySelectorAll('.opening-hours-state');
    if (openingHoursStateElements[index] != null) {
      openingHoursStateElements[index]
        .querySelector<HTMLElement>('button')
        ?.scrollIntoView({
          behavior: 'smooth',
          block: 'center',
          inline: 'center',
        });
    }
  }
};
</script>
