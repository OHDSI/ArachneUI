/*
 *
 * Copyright 2017 Observational Health Data Sciences and Informatics
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

function showNotification(message, title = 'Arachne', showButtons = false) {
  const actions = [];
  if (showButtons) {
    actions.push({
      action: 'y',
      title: 'Yes',
    });
    actions.push({
      action: 'n',
      title: 'No',
    });
  }

  const notification = new Notification(title, {
    type: 'basic',
    message,
    actions,
  });

  if (showButtons) {
    return new Promise((resolve, reject) => {
      notification.onclick = (id, buttonIndex) => {
        if (buttonIndex === 0) {
          resolve();
        } else {
          reject();
        }
      };
    });
  }

  return notification;
}

export class Notifier {
  static get permissions() {
    return keyMirror({
      granted: null,
      denied: null,
    });
  }

  static checkPermission() {
    const result = new Promise((resolve, reject) => {
      if (!('Notification' in window)) {
        reject();
      } else if (Notification.permission === Notifier.permissions.granted) {
        resolve();
      } else if (Notification.permission !== Notifier.permissions.denied) {
        Notification.requestPermission((permission) => {
          permission === Notifier.permissions.granted
            ? resolve()
            : reject();
        });
      }
    });

    return result;
  }

  static alert(message, title) {
    Notifier.checkPermission().then(() => showNotification(message, title));
  }

  static async confirm(message, title) {
    await Notifier.checkPermission();
    return showNotification(message, title, true);
  }
}
