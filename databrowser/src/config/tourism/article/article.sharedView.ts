// SPDX-FileCopyrightText: NOI Techpark <digital@noi.bz.it>
//
// SPDX-License-Identifier: AGPL-3.0-or-later

import { CellComponent } from '../../../domain/cellComponents/types';
import {
  DetailViewConfig,
  EditViewConfig,
} from '../../../domain/datasets/config/types';
import {
  contactCategory,
  dataStatesSubCategory,
  idReadOnlyCell,
  imageGalleryCategory,
  seasonCategory,
  shortnameCell,
  sourceSubCategoryWithDistinct,
  textInfoCategory,
  licenseInfoCategory,
  mappingCategory,
} from '../../builder/tourism';
import { videoItemsCategory } from '../../builder/tourism/video';
import { updatehistoryCategory } from '../../builder/tourism/updatehistory';
import { DEFAULT_DATE_FORMAT, withOdhBaseUrl } from '../../utils';

export const articleSharedView = (): DetailViewConfig | EditViewConfig => ({
  elements: [
    {
      name: 'Main data',
      slug: 'main-data',
      subcategories: [
        {
          name: 'General data',
          properties: [shortnameCell()],
        },
        {
          name: 'IDs',
          properties: [idReadOnlyCell()],
        },
        dataStatesSubCategory(),
        sourceSubCategoryWithDistinct('article'),
      ],
    },
    textInfoCategory(),
    contactCategory(),
    imageGalleryCategory(),
    videoItemsCategory(),
    seasonCategory(),
    {
      name: 'Additional Information',
      slug: 'additional-information',
      subcategories: [
        {
          name: '',
          properties: [
            {
              title: '',
              component: CellComponent.ArticleAdditionalInfoCell,
              objectMapping: {
                infos: 'AdditionalArticleInfos.{language}.Elements',
              },
            },
          ],
        },
      ],
    },
    {
      name: 'Links',
      slug: 'links',
      subcategories: [
        {
          name: '',
          properties: [
            {
              title: '',
              component: CellComponent.ArticleLinkInfoCell,
              objectMapping: {
                links: 'ArticleLinkInfo.{language}.Elements',
              },
            },
          ],
        },
      ],
    },
    {
      name: 'Tags',
      slug: 'Tags',
      subcategories: [
        {
          name: '',
          properties: [
            // {
            //   title: 'Assigned ODH Tags (Deprecated)',
            //   component: CellComponent.TagReferenceCell,
            //   arrayMapping: {
            //     targetPropertyName: 'items',
            //     pathToParent: 'SmgTags',
            //   },
            //   params: {
            //     url: withOdhBaseUrl('/v1/ODHTag?mainentity=article'),
            //     keySelector: 'Id',
            //     labelSelector: 'TagName.{language}',
            //     editable: 'false',
            //   },
            // },
            {
              title: 'Tags (Deprecated)',
              component: CellComponent.ArrayCell,
              objectMapping: {
                items: 'SmgTags',
              },
              params: {
                separator: ', ',
              },
            },
            {
              title: 'Assigned Tags',
              component: CellComponent.TagReferenceCell,
              arrayMapping: {
                targetPropertyName: 'items',
                pathToParent: 'TagIds',
              },
              params: {
                url: withOdhBaseUrl(
                  '/v1/Tag?validforentity=article&fields=Id,TagName&pagesize=0'
                ),
                keySelector: 'Id',
                labelSelector: 'TagName.{language}',
              },
            },
          ],
        },
      ],
    },
    {
      name: 'Article Details',
      slug: 'article-details',
      subcategories: [
        {
          name: '',
          properties: [
            {
              title: 'Highlight',
              component: CellComponent.ToggleTriStateCell,
              objectMapping: { enabled: 'Highlight' },
            },
            {
              title: '',
              component: CellComponent.ArticleTypeCell,
              objectMapping: {
                type: 'Type',
                subType: 'SubType',
              },
              params: {
                lookupUrl: withOdhBaseUrl('/v1/ArticleTypes'),
                required: 'true',
              },
              required: true,
            },
            {
              title: 'Article Date',
              component: CellComponent.DateCell,
              objectMapping: { date: 'ArticleDate' },
              params: { format: DEFAULT_DATE_FORMAT },
            },
            {
              title: 'Article Date To',
              component: CellComponent.DateCell,
              objectMapping: { date: 'ArticleDateTo' },
              params: { format: DEFAULT_DATE_FORMAT },
            },
          ],
        },
      ],
    },
    licenseInfoCategory(),
    mappingCategory(),
    updatehistoryCategory(),
  ],
});
