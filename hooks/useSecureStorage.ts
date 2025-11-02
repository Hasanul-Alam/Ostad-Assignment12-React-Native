// utils/secureStorage.ts
import * as SecureStore from "expo-secure-store";

export const saveItem = async (key: string, value: any) => {
  try {
    const stringValue = JSON.stringify(value);
    await SecureStore.setItemAsync(key, stringValue);
    console.log("item saved successfully.");
  } catch (error) {
    console.error("Error saving item:", error);
  }
};

export const getItem = async (key: string): Promise<any | null> => {
  try {
    const value = await SecureStore.getItemAsync(key);
    return value ? JSON.parse(value) : null;
  } catch (error) {
    console.error("Error getting item:", error);
    return null;
  }
};

export const deleteItem = async (key: string) => {
  try {
    await SecureStore.deleteItemAsync(key);
  } catch (error) {
    console.error("Error deleting item:", error);
  }
};
