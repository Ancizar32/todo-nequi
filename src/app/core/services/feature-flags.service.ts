import { Injectable } from '@angular/core';
import { RemoteConfig, fetchAndActivate, getBoolean } from '@angular/fire/remote-config';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class FeatureFlagsService {
  private enableCategories$ = new BehaviorSubject<boolean>(true);
  readonly enableCategoriesObs$ = this.enableCategories$.asObservable();

  constructor(private remoteConfig: RemoteConfig) {
    // Dev: refresca más seguido (en prod puedes subirlo)
    this.remoteConfig.settings = {
      minimumFetchIntervalMillis: 10_000,
      fetchTimeoutMillis: 10_000,
    };

    // Defaults locales (por si Remote Config aún no responde)
    this.remoteConfig.defaultConfig = {
      enableCategories: true,
    };

    // Carga inicial
    this.refresh();
  }

  get enableCategories(): boolean {
    return this.enableCategories$.value;
  }

  async refresh(): Promise<void> {
    try {
      await fetchAndActivate(this.remoteConfig);
      const enabled = getBoolean(this.remoteConfig, 'enableCategories');
      this.enableCategories$.next(enabled);
      console.log('[RemoteConfig] enableCategories =', enabled);
    } catch (e) {
      console.warn('[RemoteConfig] refresh failed, using defaults', e);
      // mantiene el valor actual/default
    }
  }
}