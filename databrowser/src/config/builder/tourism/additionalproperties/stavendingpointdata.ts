// SPDX-FileCopyrightText: NOI Techpark <digital@noi.bz.it>
//
// SPDX-License-Identifier: AGPL-3.0-or-later

import { CellComponent } from '@/domain/cellComponents/types';
import { DetailElements } from '@/domain/datasets/config/types';

export const stavendingpointdataCategory = (
  options = { visible: false }
): DetailElements => ({
  name: 'VendingPoint Properties',
  slug: 'stavendingpointdata',
  visible: options.visible,
  subcategories: [
    {
      name: 'General',
      properties: [
        {
          title: 'Has Website',
          component: CellComponent.ToggleTriStateCell,
          objectMapping: {
            enabled:
              'AdditionalProperties.StaVendingPointsDataProperties.HasWebsite',
          },
        },
        {
          title: 'Duplicate',
          component: CellComponent.ToggleTriStateCell,
          objectMapping: {
            enabled:
              'AdditionalProperties.StaVendingPointsDataProperties.Duplicate',
          },
        },
        {
          title: 'InfoPoint',
          component: CellComponent.ToggleTriStateCell,
          objectMapping: {
            enabled:
              'AdditionalProperties.StaVendingPointsDataProperties.InfoPoint',
          },
        },
        {
          title: 'ChargeCard',
          component: CellComponent.ToggleTriStateCell,
          objectMapping: {
            enabled:
              'AdditionalProperties.StaVendingPointsDataProperties.ChargeCard',
          },
        },
      ],
    },
    {
      name: 'Pick Up Point',
      properties: [
        {
          title: 'PickupPoint',
          component: CellComponent.ToggleTriStateCell,
          objectMapping: {
            enabled:
              'AdditionalProperties.StaVendingPointsDataProperties.PickupPoint',
          },
        },
        {
          title: 'PickupPoint Id',
          component: CellComponent.StringCell,
          objectMapping: {
            text: 'AdditionalProperties.StaVendingPointsDataProperties.PickupPointId',
          },
        },
        {
          title: 'PickupPoint Index',
          component: CellComponent.StringCell,
          objectMapping: {
            text: 'AdditionalProperties.StaVendingPointsDataProperties.PickupPointIndex',
          },
          params: { type: 'number' },
        },
      ],
    },
    {
      name: 'Services',
      properties: [
        {
          title:
            'suedtirolmobil Flex Services (Top-up, Renewal and Activation)',
          component: CellComponent.ToggleTriStateCell,
          objectMapping: {
            enabled:
              'AdditionalProperties.StaVendingPointsDataProperties.ServiceFlex',
          },
        },
        {
          title: 'suedtirolmobil FlexFamily Services',
          component: CellComponent.ToggleTriStateCell,
          objectMapping: {
            enabled:
              'AdditionalProperties.StaVendingPointsDataProperties.ServiceFlexFamily',
          },
        },
        {
          title: 'suedtirolmobil Fix365 Services',
          component: CellComponent.ToggleTriStateCell,
          objectMapping: {
            enabled:
              'AdditionalProperties.StaVendingPointsDataProperties.ServiceFix365',
          },
        },
        {
          title: 'suedtirolmobil Fix30 Services',
          component: CellComponent.ToggleTriStateCell,
          objectMapping: {
            enabled:
              'AdditionalProperties.StaVendingPointsDataProperties.ServiceFix30',
          },
        },
        {
          title: 'Euregio Ticket Students Services',
          component: CellComponent.ToggleTriStateCell,
          objectMapping: {
            enabled:
              'AdditionalProperties.StaVendingPointsDataProperties.ServiceEuregioTicketStudent',
          },
        },
        {
          title: 'Euregio Ticket Services',
          component: CellComponent.ToggleTriStateCell,
          objectMapping: {
            enabled:
              'AdditionalProperties.StaVendingPointsDataProperties.ServiceEuregioTicket',
          },
        },
        {
          title: 'suedtirolmobil U19 Services',
          component: CellComponent.ToggleTriStateCell,
          objectMapping: {
            enabled:
              'AdditionalProperties.StaVendingPointsDataProperties.ServiceU19',
          },
        },
        {
          title: 'suedtirolmobil U26 Services',
          component: CellComponent.ToggleTriStateCell,
          objectMapping: {
            enabled:
              'AdditionalProperties.StaVendingPointsDataProperties.ServiceU26',
          },
        },
        {
          title: 'suetirolmobil Fix30 U26 Services',
          component: CellComponent.ToggleTriStateCell,
          objectMapping: {
            enabled:
              'AdditionalProperties.StaVendingPointsDataProperties.ServiceFix30U26',
          },
        },
        {
          title: 'suedtirolmobil 65+ Services',
          component: CellComponent.ToggleTriStateCell,
          objectMapping: {
            enabled:
              'AdditionalProperties.StaVendingPointsDataProperties.Service65Plus',
          },
        },
      ],
    },
    {
      name: 'Sales',
      properties: [
        {
          title: 'Sale MobileCard',
          component: CellComponent.ToggleTriStateCell,
          objectMapping: {
            enabled:
              'AdditionalProperties.StaVendingPointsDataProperties.MobileCard',
          },
        },
        {
          title: 'Sale of single tickets 2 Euro',
          component: CellComponent.ToggleTriStateCell,
          objectMapping: {
            enabled:
              'AdditionalProperties.StaVendingPointsDataProperties.SingleTicket',
          },
        },
        {
          title: 'Sale of day passes for city buses (Bolzano or Merano)',
          component: CellComponent.ToggleTriStateCell,
          objectMapping: {
            enabled:
              'AdditionalProperties.StaVendingPointsDataProperties.DailyTicketBzMe',
          },
        },
        {
          title: 'Sale of tickets for transporting animals',
          component: CellComponent.ToggleTriStateCell,
          objectMapping: {
            enabled:
              'AdditionalProperties.StaVendingPointsDataProperties.TicketAnimals',
          },
        },
        {
          title: 'Sale of tickets for transporting bicycles',
          component: CellComponent.ToggleTriStateCell,
          objectMapping: {
            enabled:
              'AdditionalProperties.StaVendingPointsDataProperties.TicketBicycle',
          },
        },
        {
          title: 'Sale of tickets for a specific route',
          component: CellComponent.ToggleTriStateCell,
          objectMapping: {
            enabled:
              'AdditionalProperties.StaVendingPointsDataProperties.TicketSpecificRoute',
          },
        },
        {
          title: 'Sale of Euregio 2 Plus tickets',
          component: CellComponent.ToggleTriStateCell,
          objectMapping: {
            enabled:
              'AdditionalProperties.StaVendingPointsDataProperties.TicketEuregio2Plus',
          },
        },
      ],
    },
  ],
});
