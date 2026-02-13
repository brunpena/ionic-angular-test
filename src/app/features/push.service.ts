import { Injectable } from '@angular/core';
import { Capacitor } from '@capacitor/core';
import {
  PushNotifications,
  Token,
  PushNotificationSchema,
  ActionPerformed
} from '@capacitor/push-notifications';

import { initializeApp, getApps } from 'firebase/app';
import {
  getMessaging,
  getToken,
  onMessage,
  Messaging
} from 'firebase/messaging';

import { ApiService } from 'src/app/core/services/api.service'

@Injectable({ providedIn: 'root' })
export class PushService {

  private messaging?: Messaging;
  private initialized = false;

  constructor(private api: ApiService) {}

  /* =====================================================
     INIT (chamar após login / register)
  ===================================================== */
  async init(): Promise<void> {
    if (this.initialized) return;
    this.initialized = true;

    if (Capacitor.isNativePlatform()) {
      await this.initMobile();
    } else {
      await this.initWeb();
    }
  }

  /* =====================================================
     WEB (Firebase Cloud Messaging)
  ===================================================== */
  private async initWeb() {
    if (Notification.permission === 'denied') {
      console.warn('[Push][Web] Permissão negada');
      return;
    }

    const firebaseConfig = {
      apiKey: 'SUA_API_KEY',
      authDomain: 'SEU_DOMINIO',
      projectId: 'SEU_PROJECT_ID',
      messagingSenderId: 'SEU_SENDER_ID',
      appId: 'SEU_APP_ID'
    };

    const app =
      getApps().length === 0
        ? initializeApp(firebaseConfig)
        : getApps()[0];

    this.messaging = getMessaging(app);

    try {
      const token = await getToken(this.messaging, {
        vapidKey: 'SUA_VAPID_KEY'
      });

      if (token) {
        console.log('[Push][Web] Token:', token);
        this.registerToken(token, 'web');
      }
    } catch (err) {
      console.error('[Push][Web] Erro ao obter token', err);
    }

    onMessage(this.messaging, payload => {
      console.log('[Push][Web] Mensagem recebida', payload);
    });
  }

  /* =====================================================
     MOBILE (Capacitor)
  ===================================================== */
  private async initMobile() {
    const permission = await PushNotifications.requestPermissions();

    if (permission.receive !== 'granted') {
      console.warn('[Push][Mobile] Permissão negada');
      return;
    }

    await PushNotifications.register();

    PushNotifications.addListener(
      'registration',
      (token: Token) => {
        console.log('[Push][Mobile] Token:', token.value);
        this.registerToken(token.value, 'mobile');
      }
    );

    PushNotifications.addListener(
      'registrationError',
      err => console.error('[Push][Mobile] Erro', err)
    );

    PushNotifications.addListener(
      'pushNotificationReceived',
      (notification: PushNotificationSchema) => {
        console.log('[Push][Mobile] Recebida', notification);
      }
    );

    PushNotifications.addListener(
      'pushNotificationActionPerformed',
      (action: ActionPerformed) => {
        console.log('[Push][Mobile] Ação', action);
      }
    );
  }

  /* =====================================================
     BACKEND
  ===================================================== */
  private registerToken(token: string, platform: 'web' | 'mobile') {
    this.api.post('/push/register', { token, platform }).subscribe({
      next: () => console.log('[Push] Token registrado'),
      error: err => console.error('[Push] Erro ao registrar', err)
    });
  }

  unregister() {
    return this.api.post('/push/unregister', {});
  }
}
