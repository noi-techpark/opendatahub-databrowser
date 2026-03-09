// SPDX-FileCopyrightText: NOI Techpark <digital@noi.bz.it>
//
// SPDX-License-Identifier: AGPL-3.0-or-later

import { AxiosResponse } from 'axios';
import { axiosWithMaybeAuth } from '../../../../api/apiAuth';
import {
  OdhPushResponseMany,
  Publisher,
  PublisherWithPushResponse,
} from './types';
import { MaybeRef, ref, toValue } from 'vue';
import { getAxiosErrorMessage } from '@/domain/utils/convertError';

type PushNotificationResponse = AxiosResponse<OdhPushResponseMany>;

export const useSendPushNotifications = (
  selectedPublishers: MaybeRef<Publisher[]>
) => {
  // It is not possible to send push notifications when they are already sent, until the popup is closed
  const isPushed = ref(false);

  // Array of push results that is updated when the push notifications are sent
  const publishersWithPushResponse = ref<PublisherWithPushResponse[]>([]);

  // Send push notifications to publishers
  const sendPushes = async () => {
    try {
      publishersWithPushResponse.value = await sendPushNotifications(
        toValue(selectedPublishers)
      );
    } catch (err) {
      console.error(err);
      publishersWithPushResponse.value = [];
    }

    isPushed.value = true;
  };

  return {
    isPushed,
    publishersWithPushResponse,
    sendPushes,
  };
};

// Send push notifications to publishers
export const sendPushNotifications = async (publishers: Publisher[]) => {
  // Get the axios instance with authentication
  const axios = await axiosWithMaybeAuth(true);

  const mutatePromises: Promise<PushNotificationResponse>[] = [];

  // Send push notifications to publishers
  publishers.forEach((publisher) => {
    const pushPromise = axios<OdhPushResponseMany>({
      url: publisher.url,
      method: 'post',
    });
    mutatePromises.push(pushPromise);
  });

  // Wait for all push notifications to be sent and build the result
  return Promise.allSettled(mutatePromises).then((response) =>
    publishers.map<PublisherWithPushResponse>((publisher, index) =>
      buildPushResult(publisher, response[index])
    )
  );
};

const buildPushResult = (
  publisher: Publisher,
  promiseResult: PromiseSettledResult<PushNotificationResponse>
): PublisherWithPushResponse => {
  // Handle request errors
  if (promiseResult.status === 'rejected') {
    const error = getAxiosErrorMessage(promiseResult.reason);
    return {
      ...publisher,
      pushResponse: {
        success: false,
        error,
      },
    };
  }

  // Get the push notification result
  const result = promiseResult.value.data[publisher.id];
  return {
    ...publisher,
    pushResponse: {
      id: result.Id,
      date: result.Date,
      success: result.Result.Success,
      error: result.Result.Success ? undefined : result.Result.Response,
    },
  };
};
