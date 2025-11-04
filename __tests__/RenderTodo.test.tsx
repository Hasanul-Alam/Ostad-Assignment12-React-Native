import RenderTodo from '@/app/screens/RenderTodo';
import { fireEvent, render, screen } from '@testing-library/react-native';
import React from 'react';


// Mock Ionicons
jest.mock('@expo/vector-icons', () => ({
    Ionicons: 'Ionicons',
}));

const mockHandleDelete = jest.fn();
const mockHandleRefresh = jest.fn();

const mockTodos = [
    {
        id: '1',
        todoName: 'Buy groceries',
        deadline: '2024-11-10T00:00:00.000Z',
        importance: 'high' as const,
        description: 'Milk, eggs, bread',
        createdAt: '2024-11-04T00:00:00.000Z',
    },
    {
        id: '2',
        todoName: 'Finish assignment',
        deadline: '2024-11-15T00:00:00.000Z',
        importance: 'medium' as const,
        description: 'Complete testing assignment',
        createdAt: '2024-11-04T00:00:00.000Z',
    },
];

// Mock the useTodo hook
jest.mock('@/hooks/useTodo', () => ({
    useTodo: () => ({
        todos: mockTodos,
        loading: false,
        refreshing: false,
        handleDelete: mockHandleDelete,
        handleRefresh: mockHandleRefresh,
        formatDate: (date: string) => new Date(date).toLocaleDateString('en-US'),
        getImportanceColor: (level: string) => {
            const colors = { low: '#22c065', medium: '#f59e0b', high: '#ef4444' };
            return colors[level as keyof typeof colors] || '#d1d5db';
        },
    }),
}));

describe('RenderTodo Component', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('renders list of todos', () => {
        render(<RenderTodo />);

        expect(screen.getByText('Buy groceries')).toBeTruthy();
        expect(screen.getByText('Finish assignment')).toBeTruthy();
    });

    test('renders todo descriptions', () => {
        render(<RenderTodo />);

        expect(screen.getByText('Milk, eggs, bread')).toBeTruthy();
        expect(screen.getByText('Complete testing assignment')).toBeTruthy();
    });

    test('renders importance badges', () => {
        render(<RenderTodo />);

        expect(screen.getByText('high priority')).toBeTruthy();
        expect(screen.getByText('medium priority')).toBeTruthy();
    });

    test('calls handleDelete when delete button is pressed', () => {
        render(<RenderTodo />);

        // Find the delete button by testID (after you add test to component)
        const deleteButton = screen.getByTestId('delete-todo-1');
        fireEvent.press(deleteButton);

        expect(mockHandleDelete).toHaveBeenCalledWith('1');
        expect(mockHandleDelete).toHaveBeenCalledTimes(1);
    });

    test('calls handleDelete with correct id for different todos', () => {
        render(<RenderTodo />);

        // Delete second todo
        const deleteButton2 = screen.getByTestId('delete-todo-2');
        fireEvent.press(deleteButton2);

        expect(mockHandleDelete).toHaveBeenCalledWith('2');
    });
});