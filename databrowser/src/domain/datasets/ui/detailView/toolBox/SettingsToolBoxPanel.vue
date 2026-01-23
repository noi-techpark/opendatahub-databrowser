<!--
SPDX-FileCopyrightText: NOI Techpark <digital@noi.bz.it>

SPDX-License-Identifier: AGPL-3.0-or-later
-->

<template>
  <div class="flex flex-col gap-2 bg-white p-3 mx-2 my-3 border rounded border-gray-250">
    <ShowEmptyFields
      custom-wrapper-classes="flex justify-between"
      custom-text-classes="font-semibold"
      :use-container-classes="false"
      :use-wrapper-classes="false"
    />
  </div>
  <div class="flex flex-col gap-2 bg-white p-3 mx-2 my-3 border rounded border-gray-250">
    <ShowDeprecatedFields
      custom-wrapper-classes="flex justify-between"
      custom-text-classes="font-semibold"
      :use-container-classes="false"
      :use-wrapper-classes="false"
    />
  </div>
  <div class="flex flex-col gap-2 bg-white p-3 mx-2 my-3 border rounded border-gray-250">
    <ShowReferencesFields
      custom-wrapper-classes="flex justify-between"
      custom-text-classes="font-semibold"
      :use-container-classes="false"
      :use-wrapper-classes="false"
    />
  </div>
</template>

<script setup lang="ts">
import ShowDeprecatedFields from '../../common/showDeprecatedFields/ShowDeprecatedFields.vue';
import ShowEmptyFields from '../../common/showEmptyFields/ShowEmptyFields.vue';
import ShowReferencesFields from '../../common/showReferencesFields/ShowReferencesFields.vue';
</script>
