// SPDX-FileCopyrightText: NOI Techpark <digital@noi.bz.it>
//
// SPDX-License-Identifier: AGPL-3.0-or-later

import { UseHeaderAlertOptions } from '@/layouts/types';
import { Ref, ref } from 'vue';

const isOpen:Ref<boolean> = ref(false);
const options:Ref<UseHeaderAlertOptions | null> = ref(null);

export const useHeaderAlert = () => {

  const fire = (opts:UseHeaderAlertOptions) => {
    options.value = opts;
    isOpen.value = true;

    setTimeout(() => {
      close()
    }, opts.timeout ?? 3000);

  };

  const close = () => {
    isOpen.value = false;
    options.value = null;
  }

  return {
    isOpen,
    options,
    fire,
    close
  };
};
