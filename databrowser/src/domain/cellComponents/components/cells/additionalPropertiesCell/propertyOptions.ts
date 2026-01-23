// SPDX-FileCopyrightText: NOI Techpark <digital@noi.bz.it>
//
// SPDX-License-Identifier: AGPL-3.0-or-later

import { SelectOption } from '@/components/select/types';
import { echargingdataCategory } from '@/config/builder/tourism/additionalproperties/echargingdata';
import { poiagedataCategory } from '@/config/builder/tourism/additionalproperties/poiagedata';
import { poiltsdataCategory } from '@/config/builder/tourism/additionalproperties/poiltsdata';
import { activityltsdataCategory } from '@/config/builder/tourism/additionalproperties/activityltsdata';
import { gastronomyltsdataCategory } from '@/config/builder/tourism/additionalproperties/gastronomyltsdata';
import { suedtirolweincompanydataCategory } from '@/config/builder/tourism/additionalproperties/suedtirolweincompanydata';
import { siagmuseumdataCategory } from '@/config/builder/tourism/additionalproperties/siagmuseumdata';
import { AdditionalProperty } from './types';

// Add here new additional properties
const { name: echargingname, slug: echargingslug } = echargingdataCategory();
const { name: poiagename, slug: poiageslug } = poiagedataCategory();

const { name: poiltsname, slug: poiltsslug } = poiltsdataCategory();
const { name: activityltsname, slug: activityltsslug } = activityltsdataCategory();
const { name: gastronomyltsname, slug: gastronomyltsslug } = gastronomyltsdataCategory();
const { name: suedtirolweincompanyname, slug: suedtirolweincompanyslug } = suedtirolweincompanydataCategory();
const { name: siagmuseumname, slug: siagmuseumslug } = siagmuseumdataCategory();

export type AdditionalPropertiesOptions = SelectOption<string> &
  AdditionalProperty;

export const availableAdditionalPropertiesOptions: AdditionalPropertiesOptions[] =
  [
    // NOTE: add here additional properties
    {
      label: echargingname,
      value: 'AdditionalProperties.EchargingDataProperties',
      slug: echargingslug,
    },
    {
      label: poiagename,
      value: 'AdditionalProperties.PoiAgeDataProperties',
      slug: poiageslug,
    },
    {
      label: activityltsname,
      value: 'AdditionalProperties.ActivityLtsDataProperties',
      slug: activityltsslug,
    },
    {
      label: poiltsname,
      value: 'AdditionalProperties.PoiLtsDataProperties',
      slug: poiltsslug,
    },
    {
      label: gastronomyltsname,
      value: 'AdditionalProperties.GastronomyLtsDataProperties',
      slug: gastronomyltsslug,
    },
    {
      label: suedtirolweincompanyname,
      value: 'AdditionalProperties.SuedtirolWeinCompanyDataProperties',
      slug: suedtirolweincompanyslug,
    },
    {
      label: siagmuseumname,
      value: 'AdditionalProperties.SiagMuseumDataProperties',
      slug: siagmuseumslug,
    },
  ];
