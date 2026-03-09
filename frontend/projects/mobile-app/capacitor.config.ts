import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'org.savepuppy.app',
  appName: 'Save Puppy App',
  webDir: '../../dist/mobile-app/browser',
  server: {
    androidScheme: 'http',
    iosScheme: 'http'
  }
};

export default config;
