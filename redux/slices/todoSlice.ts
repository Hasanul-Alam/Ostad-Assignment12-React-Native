import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface Todo {
  id: string;
  todoName: string;
  deadline: string | null;
  importance: "low" | "medium" | "high" | null;
  description: string;
  createdAt: string;
}

interface TodoState {
  todos: Todo[];
}

const initialState: TodoState = {
  todos: [],
};

const todoSlice = createSlice({
  name: "todo",
  initialState,
  reducers: {
    setAllTodos: (state, action: PayloadAction<{ todos: Todo[] }>) => {
      state.todos = action.payload.todos;
    },

    removeTodo: (state, action: PayloadAction<{ id: string }>) => {
      state.todos = state.todos.filter((todo) => todo.id !== action.payload.id);
    },

    addTodo: (state, action: PayloadAction<Todo>) => {
      state.todos.push(action.payload);
    },
  },
});

export const { setAllTodos, removeTodo, addTodo } = todoSlice.actions;
export default todoSlice.reducer;
