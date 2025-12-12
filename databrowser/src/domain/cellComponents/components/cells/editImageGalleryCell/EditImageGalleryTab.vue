<!--
SPDX-FileCopyrightText: NOI Techpark <digital@noi.bz.it>

SPDX-License-Identifier: AGPL-3.0-or-later
-->

<template>
  <EditListTab :items="items">
    <template #tabLabel="{ item, index }">
      <img
        :src="
          getImageSrc((item as ImageGalleryEntry).src, {
            resize: shouldResize(isFullscreen, resizeImages),
            preferredWidth: 30,
          })
        "
        :alt="(item as ImageGalleryEntry).alt"
        class="h-5"
      />
      <span>Image {{ index + 1 }}</span>
    </template>

    <template #addItems>
      <EditListAddButton :text="'Add new image'" @click="navigateToAdd" />
    </template>

    <template #body="{ item, index }">
      <div class="flex flex-wrap gap-8 md:flex-nowrap">
        <div v-if="isUploadError" class="basis-full bg-red-200">
          {{ uploadError }}
        </div>
        <div class="basis-full md:order-1 md:basis-1/3">
          <SubCategoryItem title="Name">
            <StringCell
              :text="item.name"
              :editable="editable"
              @input="updateItem(index, { name: $event.target.value })"
            />
          </SubCategoryItem>
          <SubCategoryItem title="Title">
            <StringCell
              :text="item.title"
              :editable="editable"
              @input="updateItem(index, { title: $event.target.value })"
            />
          </SubCategoryItem>
          <SubCategoryItem title="Description">
            <StringCell
              :text="item.description"
              :editable="editable"
              @input="updateItem(index, { description: $event.target.value })"
            />
          </SubCategoryItem>
          <SubCategoryItem title="Alt Text">
            <StringCell
              :text="item.alt"
              :editable="editable"
              @input="updateItem(index, { alt: $event.target.value })"
            />
          </SubCategoryItem>
          <SubCategoryItem title="Copyright">
            <StringCell
              :text="item.copyright"
              :editable="editable"
              @input="updateItem(index, { copyright: $event.target.value })"
            />
          </SubCategoryItem>
          <SubCategoryItem title="License">
            <SelectWithOptionsCell
              :value="item.license"
              :editable="editable"
              :show-empty-value="true"
              value_001="CC0"
              label_001="CC0"
              value_002="Proprietary"
              label_002="Proprietary"
              value_003="LTS"
              label_003="Proprietary LTS"
              @update="updateItem(index, { license: $event.value })"
            />
          </SubCategoryItem>
          <SubCategoryItem title="Source">
            <StringCell
              :text="item.source"
              :editable="editable"
              @input="updateItem(index, { source: $event.target.value })"
            />
          </SubCategoryItem>
          <SubCategoryItem title="Is in gallery">
            <ToggleTriStateCell
              :enabled="booleanOrStringToBoolean(item.isInGallery)"
              :editable="editable"
              @input="updateItem(index, { source: $event.value })"
            />
          </SubCategoryItem>
          <SubCategoryItem title="Valid From">
            <DateCell
              :date="item.validFrom"
              :editable="editable"
              type="datetime"
              @input="updateItem(index, { validFrom: $event.value })"
            />
          </SubCategoryItem>
          <SubCategoryItem title="Valid To">
            <DateCell
              :date="item.validTo"
              :editable="editable"
              type="datetime"
              @input="updateItem(index, { validTo: $event.value })"
            />
          </SubCategoryItem>
          <SubCategoryItem title="Tags">            
            <ArrayEditableCell 
            :items="item.imageTags"  
            :editable="editable"            
            />
          </SubCategoryItem>
        </div>
        <div class="basis-full md:order-3 md:basis-1/3">
          <div class="rounded border">
            <div class="flex items-center justify-between bg-gray-50 px-4 py-3">
              <span class="font-semibold">Info &amp; action</span>
            </div>
            <div class="divide-y p-4">
              <div class="mb-3 font-semibold">
                <div>Resolution</div>
                <div class="text-black">
                  {{ getResolutionAsText(item) }} (W/H)
                </div>
              </div>
              <div v-if="editable">
                <button
                  class="m-3 flex items-center gap-3"
                  @click="changeImage"
                >
                  <IconUpload class="text-green-500" />
                  <span>Change image</span>
                </button>
              </div>
              <div>
                <button
                  class="m-3 flex items-center gap-3"
                  @click="downloadFile(item.src, item.title)"
                >
                  <IconDownload class="text-green-500" />
                  <span>Download image</span>
                </button>
              </div>
              <div v-if="editable">
                <button
                  class="m-3 flex items-center gap-3"
                  @click="duplicateItem(index)"
                >
                  <IconCopy class="text-green-500" />
                  <span>Duplicate</span>
                </button>
              </div>
              <div v-if="editable">
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
          <div class="rounded border">
            <div class="flex items-center justify-between bg-gray-50 px-4 py-3">
              <span class="font-semibold">Preview of image</span>
              <button @click="toggle()">
                <IconExpanded
                  class="cursor-pointer text-green-500 transition-all hover:scale-125"
                />
              </button>
            </div>

            <div ref="target" class="flex justify-center">
              <img
                :src="
                  getImageSrc(item.src, {
                    resize: shouldResize(isFullscreen, resizeImages),
                    preferredWidth: 30,
                  })
                "
                :alt="item.alt"
                :class="{
                  'object-contain': isFullscreen,
                  'rounded-b': !isFullscreen,
                }"
              />
            </div>
          </div>
        </div>
      </div>
    </template>
  </EditListTab>
</template>

<script setup lang="ts">
import { useFullscreen } from '@vueuse/core';
import { ref, toRefs, watch } from 'vue';
import IconCopy from '../../../../../components/svg/IconCopy.vue';
import IconDelete from '../../../../../components/svg/IconDelete.vue';
import IconDownload from '../../../../../components/svg/IconDownload.vue';
import IconExpanded from '../../../../../components/svg/IconExpanded.vue';
import IconUpload from '../../../../../components/svg/IconUpload.vue';
import { useImageUpload } from '../../../../api/useUpload';
import SubCategoryItem from '../../../../datasets/ui/category/SubCategoryItem.vue';
import { getImageSrc, getResolutionAsText } from '../../../../image';
import EditListAddButton from '../../utils/editList/EditListAddButton.vue';
import { useInjectActionTriggers } from '../../utils/editList/actions/useActions';
import { useInjectEditMode } from '../../utils/editList/actions/useEditMode';
import { useInjectNavigation } from '../../utils/editList/actions/useNavigation';
import { downloadFile } from '../../utils/editList/download/fileDownload';
import EditListTab from '../../utils/editList/tab/EditListTab.vue';
import { useFileDialogForType } from '../../utils/upload/useFileDialogForType';
import SelectWithOptionsCell from '../selectWithOptionsCell/SelectWithOptionsCell.vue';
import StringCell from '../stringCell/StringCell.vue';
import DateCell from '../dateCell/DateCell.vue';
import ArrayEditableCell from '../arrayCell/ArrayEditableCell.vue';
import ToggleTriStateCell from '../toggleCell/ToggleTriStateCell.vue';
import { ImageGalleryEntry } from './types';
import { shouldResize } from './utils';
import { booleanOrStringToBoolean } from '../../../../utils/convertType';

const props = defineProps<{
  items: ImageGalleryEntry[];
  resizeImages: boolean;
}>();

const { items, resizeImages } = toRefs(props);

const { activeTab, navigateToAdd } = useInjectNavigation();

const { deleteItems, duplicateItem, updateItem, updateItems } =
  useInjectActionTriggers<ImageGalleryEntry>();

const { editable } = useInjectEditMode();

const target = ref();
const { toggle, isFullscreen } = useFullscreen(target);

const { files, open } = useFileDialogForType({
  multiple: false,
  type: 'image',
});

const {
  isUploadError,
  isUploadSuccess,
  uploadError,
  uploadResponse,
  uploadFiles,
} = useImageUpload();

watch(files, (filesFromFileDialog) => {
  if (filesFromFileDialog == null) {
    return;
  }

  const filesToUpload = Array.from(filesFromFileDialog);

  // Trigger file upload
  uploadFiles(filesToUpload);
});

watch([isUploadSuccess, uploadResponse], ([isSuccess, fileUrls]) => {
  if (isSuccess) {
    const currentImages = items.value;
    const currentImage = currentImages[activeTab.value];
    const nextImage = { ...currentImage, src: fileUrls[0] };
    const nextImages = [...currentImages];
    nextImages[activeTab.value] = nextImage;
    updateItems(nextImages);
  }
});

const changeImage = () => open();
</script>
