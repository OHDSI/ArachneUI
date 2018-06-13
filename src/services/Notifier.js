/*
 *
 * Copyright 2018 Observational Health Data Sciences and Informatics
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * Company: Odysseus Data Services, Inc.
 * Product Owner/Architecture: Gregory Klebanov
 * Authors: Pavel Grafkin, Alexander Saltykov, Vitaly Koulakov, Anton Gackovka, Alexandr Ryabokon, Mikhail Mironov
 * Created: March 16, 2018
 *
 */
import keyMirror from 'keymirror';

const duration = 5000;

function showNotification({ message, title = 'Arachne', icon }) {
  const notification = new Notification(title, {
    type: 'basic',
    body: message,
    icon,
  });

  return notification;
}

export class Notifier {
  static get permissions() {
    return keyMirror({
      granted: null,
      denied: null,
    });
  }

  static get errors() {
    return keyMirror({
      UNAVAILABLE: null,
      FORBIDDEN: null,
    });
  }

  static checkPermission() {
    const result = new Promise((resolve, reject) => {
      if (!('Notification' in window)) {
        reject(Notifier.errors.UNAVAILABLE);
      } else if (Notification.permission === Notifier.permissions.granted) {
        resolve();
      } else if (Notification.permission !== Notifier.permissions.denied) {
        Notification.requestPermission((permission) => {
          permission === Notifier.permissions.granted
            ? resolve()
            : reject(Notifier.errors.FORBIDDEN);
        });
      }
    });

    return result;
  }

  static alert({ message, title = 'Arachne', useFallback = true, icon = null }) {
    Notifier.checkPermission().then(() => {
      const notification = showNotification({ message, title, icon });
      setTimeout(() => notification.close(), duration);
    }).catch((error) => {
      if (error === Notifier.errors.FORBIDDEN && useFallback) {
        alert(message);
      }
    });
  }

}
