

import AntDesign from '@expo/vector-icons/AntDesign';
import { useRouter } from 'expo-router';
import { Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import RenderTodo from './screens/RenderTodo';

export default function Index() {
  const router = useRouter();
  return (
    <SafeAreaView className="flex-1 bg-white">
      {/* Header */}
      <View className="p-4 border-b border-gray-300 flex-row items-center justify-between">
        <Text className="text-2xl font-semibold">Todo Lists</Text>
        <TouchableOpacity onPress={() => router.push("/screens/AddTodo")}>
          {/* plus button */}
          <AntDesign name="plus" size={22} color="black" />
        </TouchableOpacity>
      </View>
      <RenderTodo />
    </SafeAreaView>
  );
}
