// SPDX-FileCopyrightText: NOI Techpark <digital@noi.bz.it>
//
// SPDX-License-Identifier: AGPL-3.0-or-later

export const getImageSrc = (
  src: string | undefined,
  options?: {
    resize?: boolean;
    preferredWidth?: number;
  }
) => {
  if (src == null) {
    return src;
  }

  const { resize = false, preferredWidth } = options || {};

  if (resize && preferredWidth != null) {
    const separator = src.includes('?') ? '&' : '?';
    return `${src}${separator}width=${preferredWidth}`;
  }

  return src;
};

interface Image {
  width?: number | string;
  height?: number | string;
}

export const getResolutionAsText = ({ width, height }: Image) => {
  if (width == null && height == null) {
    return '';
  }

  return `${width} x ${height} px`;
};
