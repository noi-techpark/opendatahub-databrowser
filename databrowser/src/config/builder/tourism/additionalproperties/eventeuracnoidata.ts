// SPDX-FileCopyrightText: NOI Techpark <digital@noi.bz.it>
//
// SPDX-License-Identifier: AGPL-3.0-or-later

import { CellComponent } from '@/domain/cellComponents/types';
import { DetailElements } from '@/domain/datasets/config/types';


export const eventeuracnoidataCategory = (
  options = { visible: false }
): DetailElements => ({
  name: 'Eurac Noi data properties',
  slug: 'euracnoidataproperties',
  visible: options.visible,
  subcategories: [
    {
      name: 'Event properties',
      properties: [
        {
          title: 'Sold out',
          component: CellComponent.ToggleTriStateCell,
          objectMapping: {
            enabled: 'AdditionalProperties.EventEuracNoiDataProperties.SoldOut',
          },
        },
        {
          title: 'EventLocation',
          component: CellComponent.SelectWithOptionsCell,
          objectMapping: {
            value: 'AdditionalProperties.EventEuracNoiDataProperties.EventLocation',
          },
          params: {
            value_001: 'NOI',
            label_001: 'noi',
            value_002: 'EC',
            label_002: 'eurac',
            value_003: 'NOISE',
            label_003: 'noise',
          },
        },
        {
          title: 'TypicalAgeRage',
          component: CellComponent.ToggleTriStateCell,
          objectMapping: {
            enabled: 'AdditionalProperties.EventEuracNoiDataProperties.TypicalAgeRange',
          },
        },
        {
          title: 'ExternalOrganizer',
          component: CellComponent.ToggleTriStateCell,
          objectMapping: {
            enabled: 'AdditionalProperties.EventEuracNoiDataProperties.ExternalOrganizer',
          },
        },
      ],
    },
  ],
});