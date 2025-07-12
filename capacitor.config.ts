import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.lovable.f1dc96e3d91a4b3f87705386918d6826',
  appName: 'silent-report-app',
  webDir: 'dist',
  server: {
    url: 'https://f1dc96e3-d91a-4b3f-8770-5386918d6826.lovableproject.com?forceHideBadge=true',
    cleartext: true
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      backgroundColor: '#ffffff',
      showSpinner: false
    }
  }
};

export default config;