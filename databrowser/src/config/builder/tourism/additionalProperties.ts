// SPDX-FileCopyrightText: NOI Techpark <digital@noi.bz.it>
//
// SPDX-License-Identifier: AGPL-3.0-or-later

import { CellComponent } from '../../../domain/cellComponents/types';
import { EditElements } from '../../../domain/datasets/config/types';
import { echargingdataCategory } from './additionalproperties/echargingdata';
import { poiagedataCategory } from './additionalproperties/poiagedata';
import { activityltsdataCategory } from './additionalproperties/activityltsdata';
import { poiltsdataCategory } from './additionalproperties/poiltsdata';
import { gastronomyltsdataCategory } from './additionalproperties/gastronomyltsdata';
import { suedtirolweincompanydataCategory } from './additionalproperties/suedtirolweincompanydata';
import { siagmuseumdataCategory } from './additionalproperties/siagmuseumdata';

export const additionalPropertiesCategory = (): EditElements => ({
  name: 'Additional properties',
  slug: 'additional-properties',
  subcategories: [
    {
      name: '',
      properties: [
        {
          title: '',
          component: CellComponent.AdditionalPropertiesCell,
          objectMapping: {
            additionalProperties: 'AdditionalProperties',
          },
        },
      ],
    },
  ],
  subElements: [
    {
      objectPath: 'AdditionalProperties.EchargingDataProperties',
      elements: echargingdataCategory(),
    },
    {
      objectPath: 'AdditionalProperties.PoiAgeDataProperties',
      elements: poiagedataCategory(),
    },
    {
      objectPath: 'AdditionalProperties.ActivityLtsDataProperties',
      elements: activityltsdataCategory(),
    },
    {
      objectPath: 'AdditionalProperties.PoiLtsDataProperties',
      elements: poiltsdataCategory(),
    },
    {
      objectPath: 'AdditionalProperties.GastronomyLtsDataProperties',
      elements: gastronomyltsdataCategory(),
    },
    {
      objectPath: 'AdditionalProperties.SuedtirolWeinCompanyDataProperties',
      elements: suedtirolweincompanydataCategory(),
    },
    {
      objectPath: 'AdditionalProperties.SiagMuseumDataProperties',
      elements: siagmuseumdataCategory(),
    },
  ],
});
