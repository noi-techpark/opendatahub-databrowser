// SPDX-FileCopyrightText: NOI Techpark <digital@noi.bz.it>
//
// SPDX-License-Identifier: AGPL-3.0-or-later

import { useEventBus } from '@vueuse/core';
import { FilterLanguage } from '../../../../../datasets/language';
import { useEditStore } from '../../../../../datasets/ui/editView/store/editStore';
import { FileEntry } from '../../../cells/eventDocumentCell/types';
import { useDialogStore } from './dialogStore';
import { FileEntryWithLanguageAvailability, FileLanguageUpdate } from './types';

export const useEventSaveChanges = useEventBus<boolean>('saveChanges');
export const useEventDiscardChanges = useEventBus<boolean>('discardChanges');

export const getCurrentDocumentLanguageAvailability = (item: FileEntry) => {
  const { Documents } = JSON.parse(useEditStore().currentAsJson);

  const foundLanguages = [];
  for (const lang in Documents) {
    const currentLanguageDocuments = Documents[lang];
    for (const currentDocument of currentLanguageDocuments) {
      if (currentDocument.DocumentURL === item.src) {
        foundLanguages.push(lang);
      }
    }
  }

  return foundLanguages.join(', ');
};

export const setIgnoreDelete = (value: boolean) => {
  const dialogStore = useDialogStore();

  dialogStore.setIgnoreDelete(value);
};

export const removeAllCurrentItemNames = () => {
  const dialogStore = useDialogStore();

  const items = dialogStore.items;
  for (const item of items) {
    for (const documentData of item.data) {
      documentData.documentName = '';
    }
  }

  dialogStore.setItems(items);
};

export const getCurrentItemToSave = () => {
  const dialogStore = useDialogStore();

  const currentItem = dialogStore.ignoreDelete
    ? dialogStore.originalItems[dialogStore.activeTab]
    : dialogStore.items[dialogStore.activeTab];

  if (dialogStore.ignoreDelete) {
    for (const item of currentItem.data) {
      item.documentName = '';
    }
  }

  return {
    ...currentItem,
    data: currentItem.data.filter((item) => item.available),
  };
};

export const getCurrentItemDelete = () => {
  const dialogStore = useDialogStore();

  const currentItem = dialogStore.ignoreDelete
    ? dialogStore.originalItems[dialogStore.activeTab]
    : dialogStore.items[dialogStore.activeTab];

  return {
    ...currentItem,
    data: currentItem.data.filter((item) => !item.available),
  };
};

export const setDataForDocumentEdit = (item: FileEntry) => {
  const { Documents } = JSON.parse(useEditStore().currentAsJson);

  const dialogStore = useDialogStore();
  const dialogData = [] as FileEntryWithLanguageAvailability[];

  const supportedLanguages = Object.values(FilterLanguage);

  for (const language of supportedLanguages) {
    dialogData.push({
      documentName: '',
      language,
      available: false,
    });
  }

  for (const lang in Documents) {
    const currentLanguageDocuments = Documents[lang];
    for (const currentDocument of currentLanguageDocuments) {
      if (currentDocument.DocumentURL !== item.src) {
        continue;
      }

      const index = dialogData.findIndex((item) => item.language === lang);
      dialogData[index] = {
        ...dialogData[index],
        documentName: currentDocument.DocumentName,
        language: lang,
        available: true,
      };
    }
  }

  const data = [
    {
      name: item.src,
      src: item.src,
      data: dialogData,
    },
  ];

  dialogStore.setItems(data);

  dialogStore.setOriginalItems(data);
};

export const clearDialogStore = () => {
  const dialogStore = useDialogStore();
  dialogStore.setItems([]);
};

export const updateItem = (index: number, value: FileLanguageUpdate) => {
  const dialogStore = useDialogStore();

  const currentItem = dialogStore.items[dialogStore.activeTab].data[index];

  if (
    currentItem.documentName &&
    !value.documentName &&
    !currentItem.disableAvailabilityChange
  ) {
    value.available = false;
  }

  if (!currentItem.documentName && value.documentName) {
    value.available = true;
  }

  dialogStore.updateItem(index, value);
};

export const toggleAllItemsSelected = (value: boolean) => {
  const dialogStore = useDialogStore();

  const items = dialogStore.items;
  for (const item of items) {
    for (const documentData of item.data) {
      if (!documentData.disableAvailabilityChange) {
        documentData.available = value;
      }
    }
  }

  dialogStore.setItems(items);
};

export const setDialogItems = (
  items: {
    name: string;
    src: string;
    data?: unknown;
  }[],
  currentLanguage: string | undefined
) => {
  const dialogStore = useDialogStore();

  const data = [];

  const supportedLanguages = Object.values(FilterLanguage);

  for (const item of items) {
    const itemData = [];

    for (const language of supportedLanguages) {
      itemData.push({
        documentName: '',
        language,
        available: currentLanguage === language,
        disableAvailabilityChange: currentLanguage === language,
      });
    }

    data.push({
      name: item.name,
      src: item.src,
      data: itemData,
    });
  }

  dialogStore.setItems(data);
  dialogStore.setOriginalItems(data);
};

export const updateItemsInModalAndSave = () => {
  const editStore = useEditStore();
  const currentState = editStore.current;
  const itemInModalToSave = getCurrentItemToSave();
  const itemInModalToDelete = getCurrentItemDelete();

  const Documents = currentState.Documents as Record<
    string,
    { DocumentURL?: string; DocumentName?: string; Language?: string }[]
  >;

  for (const documentInModal of itemInModalToDelete.data) {
    const keyLangDocuments = documentInModal.language as keyof typeof Documents;
    const currentDocumentData = Documents[keyLangDocuments] || [];

    const currentSavedDocumentIndex = currentDocumentData.findIndex(
      (item) => item.DocumentURL === itemInModalToSave.src
    );

    if (currentSavedDocumentIndex >= 0) {
      Documents[keyLangDocuments].splice(currentSavedDocumentIndex, 1);
    }
  }

  for (const documentInModal of itemInModalToSave.data) {
    const keyLangDocuments = documentInModal.language as keyof typeof Documents;
    let currentDocumentData = Documents[keyLangDocuments];

    if (!currentDocumentData) {
      currentDocumentData = [];
      Documents[keyLangDocuments] = currentDocumentData;
    }

    const currentSavedDocument = currentDocumentData.find(
      (item) => item.DocumentURL === itemInModalToSave.src
    );

    if (currentSavedDocument) {
      currentSavedDocument.DocumentName = documentInModal.documentName;
    } else {
      currentDocumentData.push({
        DocumentName: documentInModal.documentName,
        DocumentURL: itemInModalToSave.src,
        Language: documentInModal.language,
      });
    }
  }

  editStore.setCurrent({ ...currentState, Documents });
};

export const addItemsInModalAndSave = () => {
  const editStore = useEditStore();
  const currentState = editStore.current;
  const dialogStore = useDialogStore();
  const items = dialogStore.items;

  const Documents = currentState.Documents as Record<
    string,
    { DocumentURL?: string; DocumentName?: string; Language?: string }[]
  >;

  for (const item of items) {
    for (const itemData of item.data.filter((v) => v.available)) {
      if (!itemData.language) continue;

      Documents[itemData.language] ??= [];
      const uploadedDocumentIndex = Documents[itemData.language].findIndex(
        (documentData) => documentData.DocumentURL === item.src
      );

      if (uploadedDocumentIndex >= 0) {
        Documents[itemData.language][uploadedDocumentIndex].DocumentName =
          itemData.documentName;
      } else {
        Documents[itemData.language].push({
          DocumentName: itemData.documentName,
          Language: itemData.language,
          DocumentURL: item.src,
        });
      }
    }
  }

  editStore.setCurrent({ ...currentState, Documents });
};
