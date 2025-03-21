// SPDX-FileCopyrightText: NOI Techpark <digital@noi.bz.it>
//
// SPDX-License-Identifier: AGPL-3.0-or-later

import { CellComponent } from '../../../domain/cellComponents/types';
import {
  DetailViewConfig,
  EditViewConfig,
} from '../../../domain/datasets/config/types';
import { withOdhBaseUrl } from '../../utils';
import {
  contactCategory,
  dataStatesSubCategory,
  imageGalleryCategory,
  tagCategory,
  shortnameWithLogoAndMainImageSubCategory,
  sourceSubCategoryWithDistinct,
  textInfoCategory,
  idReadOnlyCell,
  licenseInfoCategory,
  mappingCategory,
  relatedcontentCategory,
  eventDocumentCategory,
} from '../../builder/tourism';
import { videoItemsCategory } from '../../builder/tourism/video';
import { updatehistoryCategory } from '../../builder/tourism/updatehistory';
import { DEFAULT_DATE_TIME_FORMAT } from '../../utils';

export const eventv2SharedView = (): DetailViewConfig | EditViewConfig => ({
  elements: [
    {
      name: 'Main data',
      slug: 'main-data',
      subcategories: [
        shortnameWithLogoAndMainImageSubCategory(),
        {
          name: 'IDs',
          properties: [idReadOnlyCell()],
        },
        dataStatesSubCategory({ hideODHActive: true }),
        sourceSubCategoryWithDistinct('event'),
      ],
    },
    textInfoCategory(),
    contactCategory(),
    imageGalleryCategory(),
    {
      name: 'Event details',
      slug: 'Event-details',
      subcategories: [
        {
          name: 'Time and date',
          properties: [
            {
              title: 'Date Begin',
              component: CellComponent.DateCell,
              objectMapping: { date: 'Begin' },
              params: { type: 'datetime', format: DEFAULT_DATE_TIME_FORMAT },
            },
            {
              title: 'Date End',
              component: CellComponent.DateCell,
              objectMapping: { date: 'End' },
              params: { type: 'datetime', format: DEFAULT_DATE_TIME_FORMAT },
            },
            {
              title: 'Capacity',
              component: CellComponent.StringCell,
              objectMapping: { text: 'Capacity' },
            },
            {
              title: 'Event Group Id',
              component: CellComponent.StringCell,
              objectMapping: { text: 'EventGroupId' },
            },
            {
              title: 'Is Root',
              component: CellComponent.ToggleCell,
              objectMapping: { enabled: 'IsRoot' },
            },
          ],
        },
      ],
    },
    {
      name: 'Venue',
      slug: 'Venue',
      subcategories: [
        {
          name: '',
          properties: [
            {
              title: '',
              component: CellComponent.InputReferenceCell,
              objectMapping: { value: 'VenueId' },
              params: {
                url: withOdhBaseUrl('/v2/Venue'),
                labelSelector: 'Detail.{language}.Title',
                keySelector: 'Id',
              },
            },
            {
              title: 'Venue ID',
              component: CellComponent.StringCell,
              objectMapping: { text: 'VenueId' },
              params: { readonly: 'true' },
              class: 'break-all',
            },
          ],
        },
      ],
    },
    tagCategory('event'),
    relatedcontentCategory(),
    mappingCategory(),
    eventDocumentCategory(),
    videoItemsCategory(),
    licenseInfoCategory(),
    updatehistoryCategory(),
  ],
});
