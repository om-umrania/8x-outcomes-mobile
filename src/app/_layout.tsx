import { DarkTheme, DefaultTheme, Stack, ThemeProvider } from 'expo-router';
import { useColorScheme } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { RunProvider } from '@/state/RunProvider';
import { RunnerProvider } from '@/runner/RunnerContext';
import { WorkerProvider } from '@/worker/WorkerProvider';

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <SafeAreaProvider>
      <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        <RunProvider>
          <RunnerProvider>
            <WorkerProvider>
              <Stack screenOptions={{ headerShown: false, animation: 'slide_from_right' }}>
                <Stack.Screen name="index" />
                <Stack.Screen name="onboarding" />
                <Stack.Screen name="calibrating" />
                <Stack.Screen name="calibration-mission" />
                <Stack.Screen name="inbox" />
                <Stack.Screen name="worker-mission" />
                <Stack.Screen name="first-node" />
                <Stack.Screen name="thanks" />
                <Stack.Screen name="profile" />
              </Stack>
            </WorkerProvider>
          </RunnerProvider>
        </RunProvider>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}
