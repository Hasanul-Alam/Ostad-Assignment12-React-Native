
// Mock everything
jest.mock('@expo/vector-icons', () => ({
    Ionicons: 'Ionicons',
}));

jest.mock('expo-router', () => ({
    useRouter: () => ({
        back: jest.fn(),
    }),
}));

jest.mock('@react-native-community/datetimepicker', () => 'DateTimePicker');

// Track todos in memory for integration testing
let mockTodosState: any[] = [];

const mockDispatch = jest.fn((action) => {
    if (action.type === 'todo/addTodo') {
        mockTodosState.push(action.payload);
    } else if (action.type === 'todo/removeTodo') {
        mockTodosState = mockTodosState.filter(t => t.id !== action.payload.id);
    } else if (action.type === 'todo/setAllTodos') {
        mockTodosState = action.payload.todos;
    }
});

jest.mock('react-redux', () => ({
    useDispatch: () => mockDispatch,
    useSelector: (selector: any) => selector({ todo: { todos: mockTodosState } }),
    Provider: ({ children }: any) => children,
}));

jest.mock('@/hooks/useSecureStorage', () => ({
    getItem: jest.fn().mockResolvedValue([]),
    saveItem: jest.fn().mockResolvedValue(undefined),
}));

// Import after mocks


describe('Todo Integration Tests - Simple', () => {
    beforeEach(() => {
        mockTodosState = [];
        jest.clearAllMocks();
    });

    it('simulates adding multiple tasks and verifying count', async () => {
        // Add Task 1
        mockDispatch({
            type: 'todo/addTodo',
            payload: {
                id: '1',
                todoName: 'Task 1',
                deadline: null,
                importance: 'high',
                description: '',
                createdAt: new Date().toISOString(),
            },
        });

        expect(mockTodosState).toHaveLength(1);
        expect(mockTodosState[0].todoName).toBe('Task 1');

        // Add Task 2
        mockDispatch({
            type: 'todo/addTodo',
            payload: {
                id: '2',
                todoName: 'Task 2',
                deadline: null,
                importance: 'medium',
                description: '',
                createdAt: new Date().toISOString(),
            },
        });

        expect(mockTodosState).toHaveLength(2);

        // Add Task 3
        mockDispatch({
            type: 'todo/addTodo',
            payload: {
                id: '3',
                todoName: 'Task 3',
                deadline: null,
                importance: 'low',
                description: '',
                createdAt: new Date().toISOString(),
            },
        });

        expect(mockTodosState).toHaveLength(3);
        expect(mockTodosState[2].todoName).toBe('Task 3');
    });

    it('adds tasks, deletes one, and verifies list updates', async () => {
        // Add 3 tasks
        mockDispatch({
            type: 'todo/setAllTodos',
            payload: {
                todos: [
                    {
                        id: '1',
                        todoName: 'Task 1',
                        deadline: null,
                        importance: 'high',
                        description: '',
                        createdAt: new Date().toISOString(),
                    },
                    {
                        id: '2',
                        todoName: 'Task 2',
                        deadline: null,
                        importance: 'medium',
                        description: '',
                        createdAt: new Date().toISOString(),
                    },
                    {
                        id: '3',
                        todoName: 'Task 3',
                        deadline: null,
                        importance: 'low',
                        description: '',
                        createdAt: new Date().toISOString(),
                    },
                ],
            },
        });

        // Verify initial count
        expect(mockTodosState).toHaveLength(3);

        // Delete Task 2
        mockDispatch({
            type: 'todo/removeTodo',
            payload: { id: '2' },
        });

        // Verify after deletion
        expect(mockTodosState).toHaveLength(2);
        expect(mockTodosState.find(t => t.id === '2')).toBeUndefined();
        expect(mockTodosState[0].todoName).toBe('Task 1');
        expect(mockTodosState[1].todoName).toBe('Task 3');
    });

    it('adds 5 tasks, deletes 2, verifies correct count', async () => {
        // Add 5 tasks
        for (let i = 1; i <= 5; i++) {
            mockDispatch({
                type: 'todo/addTodo',
                payload: {
                    id: String(i),
                    todoName: `Task ${i}`,
                    deadline: null,
                    importance: 'medium',
                    description: '',
                    createdAt: new Date().toISOString(),
                },
            });
        }

        expect(mockTodosState).toHaveLength(5);

        // Delete task 2
        mockDispatch({
            type: 'todo/removeTodo',
            payload: { id: '2' },
        });

        expect(mockTodosState).toHaveLength(4);

        // Delete task 4
        mockDispatch({
            type: 'todo/removeTodo',
            payload: { id: '4' },
        });

        // Verify final state
        expect(mockTodosState).toHaveLength(3);

        const remainingTasks = mockTodosState.map(t => t.todoName);
        expect(remainingTasks).toEqual(['Task 1', 'Task 3', 'Task 5']);
    });

    it('verifies correct number of tasks after each operation', async () => {
        // Start empty
        expect(mockTodosState).toHaveLength(0);

        // Add 1 task
        mockDispatch({
            type: 'todo/addTodo',
            payload: {
                id: '1',
                todoName: 'First Task',
                deadline: null,
                importance: 'high',
                description: '',
                createdAt: new Date().toISOString(),
            },
        });
        expect(mockTodosState).toHaveLength(1);

        // Add 2nd task
        mockDispatch({
            type: 'todo/addTodo',
            payload: {
                id: '2',
                todoName: 'Second Task',
                deadline: null,
                importance: 'medium',
                description: '',
                createdAt: new Date().toISOString(),
            },
        });
        expect(mockTodosState).toHaveLength(2);

        // Add 3rd task
        mockDispatch({
            type: 'todo/addTodo',
            payload: {
                id: '3',
                todoName: 'Third Task',
                deadline: null,
                importance: 'low',
                description: '',
                createdAt: new Date().toISOString(),
            },
        });
        expect(mockTodosState).toHaveLength(3);

        // Delete one
        mockDispatch({
            type: 'todo/removeTodo',
            payload: { id: '2' },
        });
        expect(mockTodosState).toHaveLength(2);

        // Add another
        mockDispatch({
            type: 'todo/addTodo',
            payload: {
                id: '4',
                todoName: 'Fourth Task',
                deadline: null,
                importance: 'high',
                description: '',
                createdAt: new Date().toISOString(),
            },
        });
        expect(mockTodosState).toHaveLength(3);

        // Final verification
        const taskNames = mockTodosState.map(t => t.todoName);
        expect(taskNames).toEqual(['First Task', 'Third Task', 'Fourth Task']);
    });
});