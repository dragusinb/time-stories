import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.timestories.app',
  appName: 'TimeStories',
  webDir: 'out',

  // iOS-specific settings
  ios: {
    contentInset: 'automatic',
    backgroundColor: '#000000',
    preferredContentMode: 'mobile',
    scheme: 'TimeStories'
  },

  // Android-specific settings
  android: {
    backgroundColor: '#000000'
  },

  // Plugins configuration
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      launchAutoHide: true,
      backgroundColor: '#000000',
      showSpinner: false
    }
  }
};

export default config;
