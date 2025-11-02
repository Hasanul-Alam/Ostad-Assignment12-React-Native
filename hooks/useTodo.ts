import { useRouter } from "expo-router";
import { useState } from "react";
import { Platform } from "react-native";
import { getItem, saveItem } from "./useSecureStorage";

export const useTodo = () => {
  const router = useRouter();
  const [todoName, setTodoName] = useState("");
  const [deadline, setDeadline] = useState<Date | null>(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [importance, setImportance] = useState<
    "low" | "medium" | "high" | null
  >(null);
  const [description, setDescription] = useState("");
  const [creatingTodo, setCreatingTodo] = useState(false);

  const handleCreate = () => {
    setCreatingTodo(true);

    const id = Date.now().toString(); // Better unique ID using timestamp

    const newTodo = {
      id,
      todoName,
      deadline: deadline ? deadline.toISOString() : null, // Convert Date to string
      importance,
      description,
      createdAt: new Date().toISOString(),
    };

    setTimeout(async () => {
      try {
        // Get existing todos
        const existingTodos = (await getItem("todo")) || [];

        // Add new todo to the array
        const updatedTodos = [...existingTodos, newTodo];
        console.log(updatedTodos);

        // Save back to storage
        await saveItem("todo", updatedTodos);

        setCreatingTodo(false);
        router.back();
      } catch (error) {
        console.error("Error creating todo:", error);
        setCreatingTodo(false);
        // Optionally show an error alert
      }
    }, 1000);
  };

  const handleCancel = () => {
    router.back();
  };

  const handleBackdropPress = () => {
    router.back();
  };

  const handleDateChange = (event: any, selectedDate?: Date) => {
    if (Platform.OS === "android") {
      setShowDatePicker(false);
    }
    if (selectedDate) {
      setDeadline(selectedDate);
      if (Platform.OS === "ios") {
        setShowDatePicker(false);
      }
    }
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getImportanceColor = (level: string) => {
    switch (level) {
      case "low":
        return "#22c065";
      case "medium":
        return "#f59e0b";
      case "high":
        return "#ef4444";
      default:
        return "#d1d5db";
    }
  };

  return {
    todoName,
    setTodoName,
    deadline,
    setDeadline,
    showDatePicker,
    setShowDatePicker,
    importance,
    setImportance,
    description,
    setDescription,
    creatingTodo,
    setCreatingTodo,
    handleCreate,
    handleCancel,
    handleBackdropPress,
    handleDateChange,
    formatDate,
    getImportanceColor,
  };
};
