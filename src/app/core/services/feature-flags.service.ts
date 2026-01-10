import { Injectable } from '@angular/core';
import { RemoteConfig, fetchAndActivate, getBoolean } from '@angular/fire/remote-config';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class FeatureFlagsService {
  private enableCategories$ = new BehaviorSubject<boolean>(true);
  readonly enableCategoriesObs$ = this.enableCategories$.asObservable();

   private enableDemoSeed$ = new BehaviorSubject<boolean>(false);
  readonly enableDemoSeedObs$ = this.enableDemoSeed$.asObservable();

  constructor(private remoteConfig: RemoteConfig) {
    // Dev: refresca más seguido (en prod puedes subirlo)
    this.remoteConfig.settings = {
      minimumFetchIntervalMillis: 10_000,
      fetchTimeoutMillis: 10_000,
    };

    // Defaults locales (por si Remote Config aún no responde)
    this.remoteConfig.defaultConfig = {
      enableCategories: true,
      enableDemoSeed: false,
    };

    // Carga inicial
    this.refresh();
  }

  get enableCategories(): boolean {
    return this.enableCategories$.value;
  }
  get enableDemoSeed(): boolean {
    return this.enableDemoSeed$.value;
  }

  async refresh(): Promise<void> {
    try {
      await fetchAndActivate(this.remoteConfig);

      const enableCategories = getBoolean(this.remoteConfig, 'enableCategories');
      const enableDemoSeed = getBoolean(this.remoteConfig, 'enableDemoSeed'); 

      this.enableCategories$.next(enableCategories);
      this.enableDemoSeed$.next(enableDemoSeed);

      console.log('[RemoteConfig] enableCategories =', enableCategories);
      console.log('[RemoteConfig] enableDemoSeed =', enableDemoSeed);
    } catch (e) {
      console.warn('[RemoteConfig] refresh failed, using defaults', e);
    }
  }
}