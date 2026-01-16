import { Injectable } from '@angular/core';

declare global {
  interface Window {
    FirebasePlugin?: any;
    cordova?: any;
  }
}

@Injectable({ providedIn: 'root' })
export class FirebaseNativeService {
  get isCordova(): boolean {
    return !!window.cordova;
  }

  get plugin(): any | null {
    return window.FirebasePlugin ?? null;
  }

  async fetchAndActivate(): Promise<void> {
    if (!this.plugin) throw new Error('FirebasePlugin not available');

    await new Promise<void>((resolve, reject) => {
      // Algunos builds traen fetchAndActivate, otros fetch + activateFetched
      if (typeof this.plugin.fetchAndActivate === 'function') {
        this.plugin.fetchAndActivate(resolve, reject);
        return;
      }

      if (typeof this.plugin.fetch === 'function' && typeof this.plugin.activateFetched === 'function') {
        this.plugin.fetch(
          () => this.plugin.activateFetched(resolve, reject),
          reject
        );
        return;
      }

      reject(new Error('No fetchAndActivate/fetch+activateFetched in FirebasePlugin'));
    });
  }

  async getBoolean(key: string, fallback: boolean): Promise<boolean> {
    if (!this.plugin) return fallback;

    const raw = await new Promise<any>((resolve, reject) => {
      if (typeof this.plugin.getValue !== 'function') {
        reject(new Error('FirebasePlugin.getValue not available'));
        return;
      }
      this.plugin.getValue(key, resolve, reject);
    });

    const value = raw?.value ?? raw; // depende de versión (a veces {value:"true"})
    if (typeof value === 'boolean') return value;
    if (typeof value === 'string') return value.toLowerCase() === 'true';
    return fallback;
  }
}