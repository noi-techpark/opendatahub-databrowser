// SPDX-FileCopyrightText: NOI Techpark <digital@noi.bz.it>
//
// SPDX-License-Identifier: AGPL-3.0-or-later

import { CellComponent } from '@/domain/cellComponents/types';
import { DetailElements } from '@/domain/datasets/config/types';

export const suedtirolweincompanydataCategory = (
  options = { visible: false }
): DetailElements => ({
  name: 'Suedtirol Wein Properties',
  slug: 'suedtirolweincompanydata',
  visible: options.visible,
  subcategories: [
    {
      name: '',
      properties: [
        {
          title: 'Has Visits',
          component: CellComponent.ToggleTriStateCell,
          objectMapping: {
            enabled: 'AdditionalProperties.SuedtirolWeinCompanyDataProperties.HasVisits',
          },
        },
        {
          title: 'Has Visits',
          component: CellComponent.ToggleTriStateCell,
          objectMapping: {
            enabled: 'AdditionalProperties.SuedtirolWeinCompanyDataProperties.HasVisits',
          },
        },
        {
          title: 'Has Visits',
          component: CellComponent.ToggleTriStateCell,
          objectMapping: {
            enabled: 'AdditionalProperties.SuedtirolWeinCompanyDataProperties.HasOvernights',
          },
        },
        {
          title: 'Has Biowine',
          component: CellComponent.ToggleTriStateCell,
          objectMapping: {
            enabled: 'AdditionalProperties.SuedtirolWeinCompanyDataProperties.HasBiowine',
          },
        },
        {
          title: 'Has Accommodation',
          component: CellComponent.ToggleTriStateCell,
          objectMapping: {
            enabled: 'AdditionalProperties.SuedtirolWeinCompanyDataProperties.HasAccommodation',
          },
        },
        {
          title: 'Is VinumHotel',
          component: CellComponent.ToggleTriStateCell,
          objectMapping: {
            enabled: 'AdditionalProperties.SuedtirolWeinCompanyDataProperties.IsVinumHotel',
          },
        },
        {
          title: 'Is Anteprima',
          component: CellComponent.ToggleTriStateCell,
          objectMapping: {
            enabled: 'AdditionalProperties.SuedtirolWeinCompanyDataProperties.IsAnteprima',
          },
        },
        {
          title: 'Is WineStories',
          component: CellComponent.ToggleTriStateCell,
          objectMapping: {
            enabled: 'AdditionalProperties.SuedtirolWeinCompanyDataProperties.IsWineStories',
          },
        },
        {
          title: 'Is WineSummit',
          component: CellComponent.ToggleTriStateCell,
          objectMapping: {
            enabled: 'AdditionalProperties.SuedtirolWeinCompanyDataProperties.IsWineSummit',
          },
        },
        {
          title: 'Is SparklingWineassociation',
          component: CellComponent.ToggleTriStateCell,
          objectMapping: {
            enabled: 'AdditionalProperties.SuedtirolWeinCompanyDataProperties.IsSparklingWineassociation',
          },
        },
        {
          title: 'Is Winery',
          component: CellComponent.ToggleTriStateCell,
          objectMapping: {
            enabled: 'AdditionalProperties.SuedtirolWeinCompanyDataProperties.IsWinery',
          },
        },
        {
          title: 'Has Onlineshop',
          component: CellComponent.ToggleTriStateCell,
          objectMapping: {
            enabled: 'AdditionalProperties.SuedtirolWeinCompanyDataProperties.HasOnlineshop',
          },
        },
        {
          title: 'Has Deliveryservice',
          component: CellComponent.ToggleTriStateCell,
          objectMapping: {
            enabled: 'AdditionalProperties.SuedtirolWeinCompanyDataProperties.HasDeliveryservice',
          },
        },
        {
          title: 'Has DirectSales',
          component: CellComponent.ToggleTriStateCell,
          objectMapping: {
            enabled: 'AdditionalProperties.SuedtirolWeinCompanyDataProperties.HasDirectSales',
          },
        },
        {
          title: 'Is SkyalpsPartner',
          component: CellComponent.ToggleTriStateCell,
          objectMapping: {
            enabled: 'AdditionalProperties.SuedtirolWeinCompanyDataProperties.IsSkyalpsPartner',
          },
        },
      ],
    },
  ],
});
