import { Stack } from 'expo-router';
import { AuthProvider, useAuth } from './AuthContext';

function RootLayout() {
  const { isSignedIn, loading } = useAuth();

  if (loading) {
    return null;
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      {isSignedIn ? (
        <>
          <Stack.Screen name="(app)" options={{ headerShown: false }} />
        </>
      ) : (
        <>
          <Stack.Screen name="auth" options={{ headerShown: false }} />
        </>
      )}
    </Stack>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <RootLayout />
    </AuthProvider>
  );
}
