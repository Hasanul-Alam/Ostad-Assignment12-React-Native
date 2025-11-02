import { Stack } from "expo-router";
import { StatusBar } from "react-native";
import "../global.css";

export default function RootLayout() {
  return (
    <>
      <StatusBar backgroundColor="#FFFFFF" barStyle="dark-content" />
      <Stack>
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen
          name="screens/AddTodo"
          options={{
            headerShown: false,
            presentation: "transparentModal", // Must be transparentModal
            animation: "fade_from_bottom",
          }}
        />
      </Stack>
    </>
  );
}
