// SPDX-FileCopyrightText: NOI Techpark <digital@noi.bz.it>
//
// SPDX-License-Identifier: AGPL-3.0-or-later

import { MaybeRef, computed, toValue } from 'vue';
import {
  DatasetDomain,
  DetailElements,
  EditElements,
  ListElements,
  PropertyConfig,
  SubCategoryElement,
} from '../../../config/types';
import {
  DetailViewConfigWithType,
  EditViewConfigWithType,
  ListViewConfigWithType,
  NewViewConfigWithType,
  ObjectValueReplacer,
  StringReplacer,
  ViewConfigWithType,
} from '../../types';

export const computeDynamicParamsReplacement = (
  datasetDomain: DatasetDomain | undefined,
  view: ViewConfigWithType | undefined,
  stringReplacer: StringReplacer,
  objectValueReplacer: ObjectValueReplacer
): ViewConfigWithType | undefined => {
  if (datasetDomain == null || view == null) {
    return undefined;
  }

  if (datasetDomain !== 'tourism') {
    return view;
  }

  switch (view.type) {
    case 'table': {
      return applyReplacementsToTableView(
        view,
        stringReplacer,
        objectValueReplacer
      );
    }
    case 'detail':
      return applyReplacementsToSingleRecordView(
        view,
        stringReplacer,
        objectValueReplacer
      );
    case 'edit':
      return applyReplacementsToSingleRecordView(
        view,
        stringReplacer,
        objectValueReplacer
      );
    case 'new':
      return applyReplacementsToSingleRecordView(
        view,
        stringReplacer,
        objectValueReplacer
      );
    case 'raw':
      return view;
  }
};

export const useDynamicParamsReplacement = (
  datasetDomain: MaybeRef<DatasetDomain | undefined>,
  view: MaybeRef<ViewConfigWithType | undefined>,
  stringReplacer: MaybeRef<StringReplacer>,
  objectValueReplacer: MaybeRef<ObjectValueReplacer>
) =>
  computed(() =>
    computeDynamicParamsReplacement(
      toValue(datasetDomain),
      toValue(view),
      toValue(stringReplacer),
      toValue(objectValueReplacer)
    )
  );

const applyReplacementsToTableView = (
  view: ListViewConfigWithType,
  stringReplacer: StringReplacer,
  objectValueReplacer: ObjectValueReplacer
): ListViewConfigWithType | undefined => ({
  ...view,
  elements: view.elements.map<ListElements>((element) => {
    if (element.objectMapping != null) {
      const objectMapping = objectValueReplacer(element.objectMapping);
      return {
        ...element,
        objectMapping,
      };
    } else {
      const arrayMapping = {
        ...element.arrayMapping,
        pathToParent: stringReplacer(element.arrayMapping.pathToParent),
        objectMapping: objectValueReplacer(element.arrayMapping.objectMapping),
      };
      return {
        ...element,
        arrayMapping,
      };
    }
  }),
});

const applyReplacementsToSingleRecordView = <
  T extends
    | DetailViewConfigWithType
    | NewViewConfigWithType
    | EditViewConfigWithType,
>(
  view: T,
  stringReplacer: StringReplacer,
  objectValueReplacer: ObjectValueReplacer
): T | undefined => ({
  ...view,
  elements: applyReplacementsToElements(
    view.elements,
    stringReplacer,
    objectValueReplacer
  ),
});

const applyReplacementsToElements = (
  elements: DetailElements[] | EditElements[],
  stringReplacer: StringReplacer,
  objectValueReplacer: ObjectValueReplacer
) => {
  return elements.map((element) => ({
    ...applyReplacementsToSubElements(
      element,
      stringReplacer,
      objectValueReplacer
    ),
    subcategories: applyReplacementsToSubCategories(
      element.subcategories,
      stringReplacer,
      objectValueReplacer
    ),
  }));
};

const applyReplacementsToSubCategories = (
  subcategories: SubCategoryElement[],
  stringReplacer: StringReplacer,
  objectValueReplacer: ObjectValueReplacer
) => {
  return subcategories.map((subcategory) => ({
    ...subcategory,
    properties: subcategory.properties.map((property) =>
      replaceMappings(property, stringReplacer, objectValueReplacer)
    ),
  }));
};

const applyReplacementsToSubElements = (
  element: DetailElements,
  stringReplacer: StringReplacer,
  objectValueReplacer: ObjectValueReplacer
) => {
  return element.subElements
    ? {
        ...element,
        subElements: [...element.subElements].map((subElement) => ({
          ...subElement,
          elements: {
            ...subElement.elements,
            subcategories: applyReplacementsToSubCategories(
              subElement.elements.subcategories,
              stringReplacer,
              objectValueReplacer
            ),
          },
        })),
      }
    : element;
};

const replaceMappings = (
  property: PropertyConfig,
  stringReplacer: StringReplacer,
  objectValueReplacer: ObjectValueReplacer
) => {
  if (property.objectMapping != null) {
    return {
      ...property,
      arrayMapping: undefined,
      objectMapping: objectValueReplacer(property.objectMapping),
    };
  } else if (property.arrayMapping != null) {
    return {
      ...property,
      objectMapping: undefined,
      arrayMapping: {
        ...property.arrayMapping,
        pathToParent: stringReplacer(property.arrayMapping.pathToParent),
        // Only set objectMapping if it exists (for backward compatibility)
        objectMapping: property.arrayMapping.objectMapping
          ? objectValueReplacer(property.arrayMapping.objectMapping)
          : undefined,
        // NEW: Recursively apply replacements to nested properties
        properties: property.arrayMapping.properties?.map((nestedProp) =>
          replaceMappings(nestedProp, stringReplacer, objectValueReplacer)
        ),
      },
    };
  }
  return property;
};
