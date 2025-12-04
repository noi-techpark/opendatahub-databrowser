// SPDX-FileCopyrightText: NOI Techpark <digital@noi.bz.it>
//
// SPDX-License-Identifier: AGPL-3.0-or-later

import { inject, provide } from 'vue';
import { createEventHook } from '@vueuse/core';

export const useActions = <T>() => {
  const addItemsEventHook = createEventHook<T[]>();
  const deleteAllItemsEventHook = createEventHook<void>();
  const deleteItemsEventHook = createEventHook<number[]>();
  const duplicateItemEventHook = createEventHook<number>();
  const pushItemEventHook = createEventHook<number>();
  const updateItemEventHook = createEventHook<{
    index: number;
    item: T;
  }>();
  const updateItemsEventHook = createEventHook<T[]>();

  const addItem = (item: T) => addItemsEventHook.trigger(item);
  const addItems = (items: T[]) => addItemsEventHook.trigger(...items);
  const deleteAllItems = () => deleteAllItemsEventHook.trigger();
  const deleteItems = (indexes: number[]) =>
    deleteItemsEventHook.trigger(...indexes);
  const duplicateItem = (index: number) =>
    duplicateItemEventHook.trigger(index);
  const pushItem = (index: number) => pushItemEventHook.trigger(index);
  const updateItem = (index: number, item: T) =>
    updateItemEventHook.trigger({ index, item });
  const updateItems = (items: T[]) => updateItemsEventHook.trigger(...items);

  return {
    addItem,
    addItems,
    deleteAllItems,
    deleteItems,
    duplicateItem,
    pushItem,
    updateItem,
    updateItems,
    onAddItems: addItemsEventHook.on,
    onDeleteAllItems: deleteAllItemsEventHook.on,
    onDeleteItems: deleteItemsEventHook.on,
    onDuplicateItem: duplicateItemEventHook.on,
    onPushItem: pushItemEventHook.on,
    onUpdateItem: updateItemEventHook.on,
    onUpdateItems: updateItemsEventHook.on,
  };
};

type Actions<T> = ReturnType<typeof useActions<T>>;
type ActionTriggers<T> = Omit<
  Actions<T>,
  | 'onAddItems'
  | 'onDeleteAllItems'
  | 'onDeleteItems'
  | 'onDuplicateItem'
  | 'onPushItem'
  | 'onUpdateItem'
  | 'onUpdateItems'
>;
type ActionHooks<T> = Omit<
  Actions<T>,
  | 'addItem'
  | 'addItems'
  | 'deleteAllItemsEventHook'
  | 'deleteItems'
  | 'duplicateItem'
  | 'pushItem'
  | 'updateItem'
  | 'updateItems'
>;

const actionKey = Symbol('edit-list-action-key');

export const useProvideActions = <T>() => {
  const actions = useActions<T>();
  provide(actionKey, actions);
  return actions;
};

export const useInjectActions = <T>() => inject<Actions<T>>(actionKey)!;

export const useInjectActionTriggers = <T>(): ActionTriggers<T> =>
  useInjectActions<T>();

export const useInjectActionHooks = <T>(): ActionHooks<T> =>
  useInjectActions<T>();
