import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { FirebaseNativeService } from './firebase-native.service';

// Fallback web (AngularFire). Si no quieres fallback, puedes borrarlo.
import { RemoteConfig, fetchAndActivate, getBoolean } from '@angular/fire/remote-config';

@Injectable({ providedIn: 'root' })
export class FeatureFlagsService {
  private enableCategories$ = new BehaviorSubject<boolean>(true);
  readonly enableCategoriesObs$ = this.enableCategories$.asObservable();

  private enableDemoSeed$ = new BehaviorSubject<boolean>(false);
  readonly enableDemoSeedObs$ = this.enableDemoSeed$.asObservable();

  constructor(
    private native: FirebaseNativeService,
    private remoteConfig: RemoteConfig, // fallback web
  ) {
    // Defaults siempre presentes
    this.enableCategories$.next(true);
    this.enableDemoSeed$.next(false);

    // Si estás en web, AngularFire necesita defaults/settings
    this.remoteConfig.settings = {
      minimumFetchIntervalMillis: 10_000,
      fetchTimeoutMillis: 10_000,
    };

    this.remoteConfig.defaultConfig = {
      enableCategories: true,
      enableDemoSeed: false,
    };

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
      // ✅ Cordova/device: usa plugin nativo
      if (this.native.isCordova && this.native.plugin) {
        await this.native.fetchAndActivate();

        const enableCategories = await this.native.getBoolean('enableCategories', true);
        const enableDemoSeed = await this.native.getBoolean('enableDemoSeed', false);

        this.enableCategories$.next(enableCategories);
        this.enableDemoSeed$.next(enableDemoSeed);

        console.log('[RC Native] enableCategories =', enableCategories);
        console.log('[RC Native] enableDemoSeed =', enableDemoSeed);
        return;
      }

      // ✅ Web (ionic serve): fallback AngularFire
      await fetchAndActivate(this.remoteConfig);

      const enableCategories = getBoolean(this.remoteConfig, 'enableCategories');
      const enableDemoSeed = getBoolean(this.remoteConfig, 'enableDemoSeed');

      this.enableCategories$.next(enableCategories);
      this.enableDemoSeed$.next(enableDemoSeed);

      console.log('[RC Web] enableCategories =', enableCategories);
      console.log('[RC Web] enableDemoSeed =', enableDemoSeed);
    } catch (e) {
      console.warn('[RemoteConfig] refresh failed, using defaults', e);
    }
  }
}