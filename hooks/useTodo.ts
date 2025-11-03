/* eslint-disable react-hooks/exhaustive-deps */
import { addTodo, removeTodo, setAllTodos } from "@/redux/slices/todoSlice";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Alert, Platform } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { getItem, saveItem } from "./useSecureStorage";

interface Todo {
  id: string;
  todoName: string;
  deadline: string | null;
  importance: "low" | "medium" | "high" | null;
  description: string;
  createdAt: string;
}

interface RootState {
  todo: {
    todos: Todo[];
  };
}

export const useTodo = () => {
  const router = useRouter();
  const dispatch = useDispatch();

  // Get todos from Redux store with proper typing
  const todos = useSelector((state: RootState) => state.todo.todos);

  const [todoName, setTodoName] = useState<string>("");
  const [deadline, setDeadline] = useState<Date | null>(new Date());
  const [showDatePicker, setShowDatePicker] = useState<boolean>(false);
  const [importance, setImportance] = useState<
    "low" | "medium" | "high" | null
  >(null);
  const [description, setDescription] = useState<string>("");
  const [creatingTodo, setCreatingTodo] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);

  // Load todos from SecureStore on mount
  useEffect(() => {
    if (todos.length === 0) {
      loadTodosFromStorage();
    }
  }, [todos]);

  // Sync todos to SecureStore whenever they change
  useEffect(() => {
    if (!loading) {
      saveTodosToStorage(todos);
    }
  }, [todos, loading]);

  const loadTodosFromStorage = async (): Promise<void> => {
    try {
      setLoading(true);
      const storedTodos = await getItem("todo");
      if (storedTodos && Array.isArray(storedTodos)) {
        dispatch(setAllTodos({ todos: storedTodos }));
      } else {
        dispatch(setAllTodos({ todos: [] }));
      }
    } catch (error) {
      console.error("Error loading todos:", error);
      dispatch(setAllTodos({ todos: [] }));
    } finally {
      setLoading(false);
    }
  };

  const saveTodosToStorage = async (todosToSave: Todo[]): Promise<void> => {
    try {
      await saveItem("todo", todosToSave);
    } catch (error) {
      console.error("Error saving todos:", error);
    }
  };

  const handleCreate = async (): Promise<void> => {
    setCreatingTodo(true);

    const id = Date.now().toString();

    const newTodo: Todo = {
      id,
      todoName,
      deadline: deadline ? deadline.toISOString() : null,
      importance,
      description,
      createdAt: new Date().toISOString(),
    };

    try {
      // Add to Redux store using the new action
      dispatch(addTodo(newTodo));

      // Save to SecureStore
      await saveItem("todo", [...todos, newTodo]);

      // Reset form
      setTodoName("");
      setDeadline(new Date());
      setImportance(null);
      setDescription("");

      router.back();
    } catch (error) {
      console.error("Error creating todo:", error);
      Alert.alert("Error", "Failed to create todo. Please try again.");
    } finally {
      setCreatingTodo(false);
    }
  };

  const handleDelete = (todoId: string): void => {
    Alert.alert("Delete Todo", "Are you sure you want to delete this todo?", [
      {
        text: "Cancel",
        style: "cancel",
      },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          try {
            // Remove from Redux store
            dispatch(removeTodo({ id: todoId }));

            // Save to SecureStore
            const updatedTodos = todos.filter(
              (todo: Todo) => todo.id !== todoId
            );
            await saveItem("todo", updatedTodos);
          } catch (error) {
            console.error("Error deleting todo:", error);
            Alert.alert("Error", "Failed to delete todo. Please try again.");
          }
        },
      },
    ]);
  };

  const handleRefresh = async (): Promise<void> => {
    setRefreshing(true);
    await loadTodosFromStorage();
    setRefreshing(false);
  };

  const handleCancel = (): void => {
    router.back();
  };

  const handleBackdropPress = (): void => {
    router.back();
  };

  const handleDateChange = (event: any, selectedDate?: Date): void => {
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

  const formatDate = (date: string | Date): string => {
    if (typeof date === "string") {
      return new Date(date).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    }
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getImportanceColor = (level: string): string => {
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
    handleCreate,
    handleCancel,
    handleBackdropPress,
    handleDateChange,
    formatDate,
    getImportanceColor,
    todos,
    loading,
    refreshing,
    handleDelete,
    handleRefresh,
  };
};
