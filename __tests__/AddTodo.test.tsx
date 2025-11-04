import AddTodo from '@/app/screens/AddTodo';
import { fireEvent, render, screen } from '@testing-library/react-native';
import React from 'react';


// Mock Ionicons
jest.mock('@expo/vector-icons', () => ({
    Ionicons: 'Ionicons',
}));

// Create mock functions that we can track
const mockHandleCreate = jest.fn();
const mockSetTodoName = jest.fn();

// Mock the useTodo hook
jest.mock('@/hooks/useTodo', () => ({
    useTodo: () => ({
        todoName: 'Buy groceries', // ← Now we have a value
        setTodoName: mockSetTodoName,
        deadline: null,
        showDatePicker: false,
        setShowDatePicker: jest.fn(),
        importance: 'medium',
        setImportance: jest.fn(),
        description: '',
        setDescription: jest.fn(),
        creatingTodo: false,
        handleCreate: mockHandleCreate, // ← This is what we'll test!
        handleCancel: jest.fn(),
        handleBackdropPress: jest.fn(),
        handleDateChange: jest.fn(),
        formatDate: jest.fn(),
        getImportanceColor: jest.fn(),
    }),
}));

describe('AddTodo Component', () => {
    // Clear mock history before each test
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('renders input field', () => {
        render(<AddTodo />);
        const input = screen.getByPlaceholderText('Enter todo name');
        expect(input).toBeTruthy();
    });

    it('renders Create Todo button', () => {
        render(<AddTodo />);
        const button = screen.getByText('Create Todo');
        expect(button).toBeTruthy();
    });

    // ✨ NEW TEST: Check if button click calls the function
    it('calls handleCreate when Create Todo button is pressed', () => {
        render(<AddTodo />);

        // Find the button
        const createButton = screen.getByText('Create Todo');

        // Simulate user pressing the button
        fireEvent.press(createButton);

        // Check if handleCreate was called
        expect(mockHandleCreate).toHaveBeenCalled();
        expect(mockHandleCreate).toHaveBeenCalledTimes(1);
    });

    // ✨ BONUS TEST: Check if input change works
    // it('calls setTodoName when user types in input', () => {
    //     render(<AddTodo />);

    //     // Find the input
    //     const input = screen.getByPlaceholderText('Enter todo name');

    //     // Simulate user typing
    //     fireEvent.changeText(input, 'New Task');

    //     // Check if setTodoName was called with correct value
    //     expect(mockSetTodoName).toHaveBeenCalledWith('New Task');
    // });
});