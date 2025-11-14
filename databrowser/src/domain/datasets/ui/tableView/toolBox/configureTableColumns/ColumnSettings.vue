<!--
SPDX-FileCopyrightText: NOI Techpark <digital@noi.bz.it>

SPDX-License-Identifier: AGPL-3.0-or-later
-->

<template>
  <div class="flex h-full flex-col overflow-y-auto">
    <div class="flex items-center justify-between">
      <ButtonCustom
        variant="ghost"
        size="xs"
        class="mr-2 flex h-6 w-fit items-center bg-white px-3 py-1 md:mr-9"
        @click="emit('back')"
      >
        <IconStrokedArrowDown
          class="-ml-1 mr-1 size-5 rotate-90 stroke-current"
        />
        <span class="line-height-1">{{
          t('datasets.listView.toolBox.columnConfiguration.columnSettings.back')
        }}</span>
      </ButtonCustom>
      <span class="mr-2 text-dialog"># {{ colIndex }}</span>
    </div>

    <div class="flex flex-col gap-6 divide-y divide-gray-250 px-1">
      <div class="flex flex-col gap-4 pt-4">
        <div class="flex flex-col">
          <label>{{
            t(
              'datasets.listView.toolBox.columnConfiguration.columnSettings.title'
            )
          }}</label>
          <InputCustom
            inputClasses="w-full"
            placeholder="Title"
            :model-value="col.title"
            @update:model-value="updateTitle"
          />
        </div>

        <div class="flex flex-col">
          <label>{{
            t(
              'datasets.listView.toolBox.columnConfiguration.columnSettings.component'
            )
          }}</label>
          <SelectCustom
            :model-value="col.component"
            :options="componentSelectOptions"
            @update:model-value="col = { ...col, component: String($event) }"
          />
        </div>

        <div class="flex flex-col">
          <label>{{
            t(
              'datasets.listView.toolBox.columnConfiguration.columnSettings.mappingType'
            )
          }}</label>
          <SelectCustom
            :model-value="mappingType"
            :options="mappingTypeSelectOptions"
            @update:model-value="
              mappingType =
                ($event as 'objectMapping' | 'arrayMapping') ?? 'objectMapping'
            "
          />
        </div>
      </div>

      <div
        v-if="mappingType === 'arrayMapping'"
        class="flex flex-col gap-4 pt-4"
      >
        <label class="text-lg font-bold">{{
          t(
            'datasets.listView.toolBox.columnConfiguration.columnSettings.arrayMapping'
          )
        }}</label>

        <div class="flex flex-col">
          <label>{{
            t(
              'datasets.listView.toolBox.columnConfiguration.columnSettings.targetPropertyName'
            )
          }}</label>
          <SelectCustom
            :model-value="col.arrayMapping?.targetPropertyName"
            :options="
              availableComponentKeys.map((key) => ({
                label: key,
                value: key,
              }))
            "
            @update:model-value="
              updateArrayMapping(
                String($event),
                col.arrayMapping?.pathToParent || ''
              )
            "
          />
        </div>

        <div class="flex flex-col">
          <label>{{
            t(
              'datasets.listView.toolBox.columnConfiguration.columnSettings.pathToParent'
            )
          }}</label>
          <InputSuggest
            :model-value="col.arrayMapping?.pathToParent"
            :suggestions="suggestions"
            deletable
            inputClasses="w-full"
            placeholder="Value"
            @update:model-value="
              updateArrayMapping(
                col.arrayMapping?.targetPropertyName || '',
                String($event)
              );
              checkAutocomplete(String($event));
            "
          />
        </div>
      </div>

      <div class="flex flex-col pt-4">
        <label class="text-lg font-bold">{{
          t(
            'datasets.listView.toolBox.columnConfiguration.columnSettings.objectMapping'
          )
        }}</label>
        <KeyValueEdit
          class="px-3"
          :availableKeys="
            mappingType === 'objectMapping' ? availableComponentKeys : []
          "
          :type="'objectMapping'"
          :data="
            col.objectMapping != null
              ? col.objectMapping
              : col.arrayMapping?.objectMapping
          "
          :addKeyLabel="
            t(
              'datasets.listView.toolBox.columnConfiguration.columnSettings.addObjectMapping'
            )
          "
          @update:data="debouncedUpdateData('objectMapping', $event)"
          @add:key="addKey('objectMapping', $event)"
          @delete:key="deleteKey('objectMapping', $event)"
        />
      </div>

      <div class="flex flex-col pt-4">
        <label>{{
          t(
            'datasets.listView.toolBox.columnConfiguration.columnSettings.params'
          )
        }}</label>
        <KeyValueEdit
          class="px-3"
          :availableKeys="availableComponentKeys"
          :type="'params'"
          :data="col.params"
          :addKeyLabel="
            t(
              'datasets.listView.toolBox.columnConfiguration.columnSettings.addParams'
            )
          "
          @update:data="debouncedUpdateData('params', $event)"
          @add:key="addKey('params', $event)"
          @delete:key="deleteKey('params', $event)"
        />
      </div>

      <div class="flex flex-col gap-4 py-4">
        <label class="text-lg font-bold">{{
          t(
            'datasets.listView.toolBox.columnConfiguration.columnSettings.styling'
          )
        }}</label>
        <div>
          <label>{{
            t(
              'datasets.listView.toolBox.columnConfiguration.columnSettings.widthInPx'
            )
          }}</label>
          <InputCustom
            inputClasses="w-full"
            type="number"
            :min="0"
            :model-value="col.style?.widthInPx"
            @update:model-value="updateWidthInPx"
          />
        </div>
        <div>
          <label>{{
            t(
              'datasets.listView.toolBox.columnConfiguration.columnSettings.class'
            )
          }}</label>
          <InputCustom
            inputClasses="w-full"
            :model-value="col.class"
            @update:model-value="updateClass"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useDebounceFn } from '@vueuse/core';
import { computed, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import ButtonCustom from '../../../../../../components/button/ButtonCustom.vue';
import InputCustom from '../../../../../../components/input/InputCustom.vue';
import InputSuggest from '../../../../../../components/input/InputSuggest.vue';
import SelectCustom from '../../../../../../components/select/SelectCustom.vue';
import { SelectOption } from '../../../../../../components/select/types';
import IconStrokedArrowDown from '../../../../../../components/svg/IconStrokedArrowDown.vue';
import { registeredComponents } from '../../../../../cellComponents/plugins/registerCellComponents';
import { useMetaDataStore } from '../../../../../metaDataConfig/tourism/metaDataStore';
import { useOpenApi } from '../../../../../openApi';
import { AutocompleteGenerator } from '../../../../../openApi/autocomplete/openapi-autocomplete-generator';
import { ArrayMapping, PropertyConfig } from '../../../../config/types';
import KeyValueEdit, { KeyValueEditData } from './KeyValueEdit.vue';

const { t } = useI18n();

const emit = defineEmits<{ (e: 'back'): void }>();

const col = defineModel<PropertyConfig>('col', { required: true });

defineProps<{ colIndex: number }>();

const componentSelectOptions: SelectOption[] = registeredComponents
  .filter(([, , meta]) => meta.supportsTableView)
  .sort(([nameA], [nameB]) => nameA.localeCompare(nameB))
  .map(([name]) => ({ label: name, value: name }));

const availableComponentKeys = computed<string[]>(() => {
  const registeredComponent = registeredComponents.find(
    ([key]) => key === col.value.component
  );
  if (registeredComponent == null) {
    return [];
  }

  const componentProps: Record<string, unknown> =
    (registeredComponent[1] as { props: Record<string, unknown> }).props ?? {};

  // Exclude keys that are already used in objectMapping or params
  const availableKeys: string[] = Object.keys(componentProps)
    .filter((key) => !col.value.objectMapping?.hasOwnProperty(key))
    .filter((key) => !col.value.params?.hasOwnProperty(key));

  return availableKeys.sort();
});

const mappingTypeSelectOptions: SelectOption[] = [
  {
    label: t(
      'datasets.listView.toolBox.columnConfiguration.columnSettings.objectMapping'
    ),
    value: 'objectMapping',
  },
  {
    label: t(
      'datasets.listView.toolBox.columnConfiguration.columnSettings.arrayMapping'
    ),
    value: 'arrayMapping',
  },
];

const mappingType = ref<'objectMapping' | 'arrayMapping'>(
  col.value.arrayMapping ? 'arrayMapping' : 'objectMapping'
);

const updateTitle = (newTitle: Event) => {
  col.value = { ...col.value, title: stringOrEventToString(newTitle) };
};

const updateWidthInPx = (newWidth: Event) => {
  col.value = {
    ...col.value,
    style: { ...col.value.style, widthInPx: Number(newWidth) },
  };
};

const updateClass = (newClass: Event) => {
  col.value = { ...col.value, class: stringOrEventToString(newClass) };
};

const updateArrayMapping = (
  targetPropertyName: string,
  pathToParent: string
) => {
  const arrayMapping: ArrayMapping = {
    ...col.value.arrayMapping,
    targetPropertyName,
    pathToParent,
  };
  col.value = { ...col.value, arrayMapping, objectMapping: undefined };
};

const updateData = (
  from: 'objectMapping' | 'params',
  { key, newKey, value }: KeyValueEditData
) => {
  const newCol: PropertyConfig = { ...col.value };
  const newKeyValue = stringOrEventToString(newKey);

  if (key !== newKeyValue) {
    delete newCol[from]?.[key];
  }

  newCol[from] = {
    ...newCol[from],
    [newKeyValue]: stringOrEventToString(value),
  };

  col.value = newCol;
};

const debouncedUpdateData = useDebounceFn(updateData, 300);

const addKey = (from: 'objectMapping' | 'params', key: string) => {
  const newCol: PropertyConfig = { ...col.value };
  newCol[from] = { ...newCol[from], [key]: '' };
  col.value = newCol;
};

const deleteKey = (from: 'objectMapping' | 'params', key: string) => {
  const newCol: PropertyConfig = { ...col.value };
  if (newCol[from] != null) {
    delete newCol[from]?.[key];
    newCol[from] = { ...newCol[from] };
    col.value = newCol;
  }
};

const stringOrEventToString = (input: string | Event) => {
  return typeof input === 'string'
    ? input
    : (input.target as HTMLInputElement).value;
};

const path = `/${useMetaDataStore().currentMetaData?.pathSegments.join('/')}/{id}`;
console.log('Current path for autocomplete:', path);

let generator: AutocompleteGenerator | null = null;
useOpenApi()
  .loadDocument('tourism')
  .then((openApiSpec) => {
    generator = new AutocompleteGenerator(openApiSpec, path);
  });

const suggestions = ref<string[]>();

const checkAutocomplete = (input: string) => {
  if (!generator) {
    console.error('Autocomplete generator is not initialized');
    return;
  }

  suggestions.value = generator.generateSuggestions(input, 100);
};
</script>
