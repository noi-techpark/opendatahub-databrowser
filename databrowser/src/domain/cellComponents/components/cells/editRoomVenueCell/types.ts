// SPDX-FileCopyrightText: NOI Techpark <digital@noi.bz.it>
//
// SPDX-License-Identifier: AGPL-3.0-or-later

export interface VenueRoomProperties {
  SquareMeters?: string;
  RoomWidthInMeters?: string;
  RoomHeightInCentimeters?: string;
  RoomDepthInMeters?: string;
  DoorWidthInCentimeters?: string;
  DoorHeightInCentimeters?: string;
}

export interface DetailEntry {
  Title?: string;
  BaseText?: string | null;
  Language?: string;
}

export interface RoomVenueEntry {
  Id?: string;
  Shortname?: string;
  Detail?: Record<string, DetailEntry | null> | null;
  MaxCapacity?: number | null;
  Placement?: string;
  Active?: boolean;
  VenueRoomProperties?: VenueRoomProperties | null;
  TagIds?: string[];
  Mapping?: Record<string, Record<string, string>>;
}
