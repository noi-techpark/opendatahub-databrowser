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
          title: 'Opening times Wineshop',
          component: CellComponent.StringCell,
          objectMapping: {
            enabled: 'AdditionalProperties.SuedtirolWeinCompanyDataProperties.OpeningtimesWineshop',
          },
        },
        {
          title: 'Opening times Guides',
          component: CellComponent.StringCell,
          objectMapping: {
            enabled: 'AdditionalProperties.SuedtirolWeinCompanyDataProperties.OpeningtimesGuides.{language}',
          },
        },
        {
          title: 'Opening times Gastronomie',
          component: CellComponent.StringCell,
          objectMapping: {
            enabled: 'AdditionalProperties.SuedtirolWeinCompanyDataProperties.OpeningtimesGastronomie.{language}',
          },
        },
        {
          title: 'Company Holiday',
          component: CellComponent.StringCell,
          objectMapping: {
            enabled: 'AdditionalProperties.SuedtirolWeinCompanyDataProperties.CompanyHoliday.{language}',
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
          title: 'Has Overnights',
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
        {
          title: 'Wines',
          component: CellComponent.ArrayCell,
          objectMapping: {
            enabled: 'AdditionalProperties.SuedtirolWeinCompanyDataProperties.Wines',
          },
        },
        {
          title: 'Online Shop url',
          component: CellComponent.UrlCell,
          objectMapping: {
            enabled: 'AdditionalProperties.SuedtirolWeinCompanyDataProperties.OnlineShopurl',
          },
        },
        {
          title: 'Delivery Service Url',
          component: CellComponent.UrlCell,
          objectMapping: {
            enabled: 'AdditionalProperties.SuedtirolWeinCompanyDataProperties.DeliveryServiceUrl',
          },
        },
        {
          title: 'H1',
          component: CellComponent.StringCell,
          objectMapping: {
            enabled: 'AdditionalProperties.SuedtirolWeinCompanyDataProperties.H1.{language}',
          },
        },
         {
          title: 'H2',
          component: CellComponent.StringCell,
          objectMapping: {
            enabled: 'AdditionalProperties.SuedtirolWeinCompanyDataProperties.H2.{language}',
          },
        },
         {
          title: 'Quote',
          component: CellComponent.StringCell,
          objectMapping: {
            enabled: 'AdditionalProperties.SuedtirolWeinCompanyDataProperties.Quote.{language}',
          },
        },
        {
          title: 'Quote Author',
          component: CellComponent.StringCell,
          objectMapping: {
            enabled: 'AdditionalProperties.SuedtirolWeinCompanyDataProperties.QuoteAuthor',
          },
        },
        {
          title: 'Description Sparkling Wine producer',
          component: CellComponent.StringCell,
          objectMapping: {
            enabled: 'AdditionalProperties.SuedtirolWeinCompanyDataProperties.DescriptionSparklingWineproducer.{language}',
          },
        },
        {
          title: 'H1 Sparkling Wine producer',
          component: CellComponent.StringCell,
          objectMapping: {
            enabled: 'AdditionalProperties.SuedtirolWeinCompanyDataProperties.H1SparklingWineproducer.{language}',
          },
        },
        {
          title: 'H2 Sparkling Wine producer',
          component: CellComponent.StringCell,
          objectMapping: {
            enabled: 'AdditionalProperties.SuedtirolWeinCompanyDataProperties.H2SparklingWineproducer.{language}',
          },
        },
        {
          title: 'Image Sparkling Wine producer',
          component: CellComponent.StringCell,
          objectMapping: {
            enabled: 'AdditionalProperties.SuedtirolWeinCompanyDataProperties.ImageSparklingWineproducer',
          },
        },
        {
          title: 'Facebook',
          component: CellComponent.UrlCell,
          objectMapping: {
            enabled: 'AdditionalProperties.SuedtirolWeinCompanyDataProperties.SocialsFacebook',
          },
        },
        {
          title: 'Instagram',
          component: CellComponent.UrlCell,
          objectMapping: {
            enabled: 'AdditionalProperties.SuedtirolWeinCompanyDataProperties.SocialsInstagram',
          },
        },
        {
          title: 'LinkedIn',
          component: CellComponent.UrlCell,
          objectMapping: {
            enabled: 'AdditionalProperties.SuedtirolWeinCompanyDataProperties.SocialsLinkedIn',
          },
        },
        {
          title: 'Pinterest',
          component: CellComponent.UrlCell,
          objectMapping: {
            enabled: 'AdditionalProperties.SuedtirolWeinCompanyDataProperties.SocialsPinterest',
          },
        },
        {
          title: 'Tiktok',
          component: CellComponent.UrlCell,
          objectMapping: {
            enabled: 'AdditionalProperties.SuedtirolWeinCompanyDataProperties.SocialsTiktok',
          },
        },
        {
          title: 'Youtube',
          component: CellComponent.UrlCell,
          objectMapping: {
            enabled: 'AdditionalProperties.SuedtirolWeinCompanyDataProperties.SocialsYoutube',
          },
        },
        {
          title: 'Twitter',
          component: CellComponent.UrlCell,
          objectMapping: {
            enabled: 'AdditionalProperties.SuedtirolWeinCompanyDataProperties.SocialsTwitter',
          },
        },
      ],
    },
  ],
});
