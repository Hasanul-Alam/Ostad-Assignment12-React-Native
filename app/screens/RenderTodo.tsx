import { getItem } from '@/hooks/useSecureStorage'
import { Ionicons } from '@expo/vector-icons'
import React, { useCallback, useEffect, useState } from 'react'
import { ActivityIndicator, Alert, FlatList, Pressable, Text, View } from 'react-native'

interface Todo {
    id: string
    todoName: string
    deadline: string | null
    importance: 'low' | 'medium' | 'high' | null
    description: string
    createdAt: string
}

const RenderTodo = () => {
    const [todos, setTodos] = useState<Todo[]>([])
    const [loading, setLoading] = useState(true)
    const [refreshing, setRefreshing] = useState(false)

    // Fetch todos from secure storage
    const fetchTodos = async () => {
        try {
            const storedTodos = await getItem("todo")
            if (storedTodos && Array.isArray(storedTodos)) {
                setTodos(storedTodos)
            } else {
                setTodos([])
            }
        } catch (error) {
            console.error("Error fetching todos:", error)
        } finally {
            setLoading(false)
            setRefreshing(false)
        }
    }

    useEffect(() => {
        fetchTodos()
    }, [])

    // Refresh handler
    const handleRefresh = useCallback(() => {
        setRefreshing(true)
        fetchTodos()
    }, [])

    // Delete todo
    const handleDelete = (todoId: string) => {
        Alert.alert(
            "Delete Todo",
            "Are you sure you want to delete this todo?",
            [
                {
                    text: "Cancel",
                    style: "cancel"
                },
                {
                    text: "Delete",
                    style: "destructive",
                    onPress: async () => {
                        // Filter out the deleted todo
                        const updatedTodos = todos.filter(todo => todo.id !== todoId)
                        setTodos(updatedTodos)

                        // Save to secure storage
                        // You'll need to import your setItem function
                        // await setItem("todo", updatedTodos)
                    }
                }
            ]
        )
    }

    const getImportanceColor = (importance: string | null) => {
        switch (importance) {
            case 'low': return '#22c065'
            case 'medium': return '#f59e0b'
            case 'high': return '#ef4444'
            default: return '#6b7280'
        }
    }

    const formatDate = (dateString: string | null) => {
        if (!dateString) return 'No deadline'
        const date = new Date(dateString)
        return date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        })
    }

    const renderTodoItem = ({ item }: { item: Todo }) => (
        <View className="bg-white rounded-xl p-4 mb-3 border border-gray-200">
            {/* Header with title and delete button */}
            <View className="flex-row items-start justify-between mb-2">
                <View className="flex-1 mr-3">
                    <Text className="text-lg font-semibold text-gray-800" numberOfLines={2}>
                        {item.todoName}
                    </Text>
                </View>
                <Pressable
                    onPress={() => handleDelete(item.id)}
                    className="p-1.5"
                    hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                >
                    <Ionicons name="trash-outline" size={20} color="#ef4444" />
                </Pressable>
            </View>

            {/* Importance badge */}
            {item.importance && (
                <View className="flex-row items-center mb-2">
                    <View
                        className="px-3 py-1 rounded-full"
                        style={{ backgroundColor: `${getImportanceColor(item.importance)}20` }}
                    >
                        <Text
                            className="text-xs font-medium capitalize"
                            style={{ color: getImportanceColor(item.importance) }}
                        >
                            {item.importance} priority
                        </Text>
                    </View>
                </View>
            )}

            {/* Deadline */}
            {item.deadline && (
                <View className="flex-row items-center mb-2">
                    <Ionicons name="calendar-outline" size={16} color="#6b7280" />
                    <Text className="text-sm text-gray-600 ml-1.5">
                        {formatDate(item.deadline)}
                    </Text>
                </View>
            )}

            {/* Description */}
            {item.description && (
                <Text className="text-sm text-gray-600 mt-2" numberOfLines={3}>
                    {item.description}
                </Text>
            )}
        </View>
    )

    const renderEmptyState = () => (
        <View className="flex-1 items-center justify-center py-20">
            <Ionicons name="clipboard-outline" size={64} color="#d1d5db" />
            <Text className="text-lg font-medium text-gray-400 mt-4">
                No todos yet
            </Text>
            <Text className="text-sm text-gray-400 mt-1">
                Tap the + button to create one
            </Text>
        </View>
    )

    if (loading) {
        return (
            <View className="flex-1 items-center justify-center bg-white">
                <ActivityIndicator size="large" color="#22c065" />
                <Text className="text-gray-600 mt-4">Loading todos...</Text>
            </View>
        )
    }

    return (
        <View className="flex-1 bg-gray-50">
            <FlatList
                data={todos}
                renderItem={renderTodoItem}
                keyExtractor={(item) => item.id}
                contentContainerStyle={{ padding: 16, flexGrow: 1 }}
                ListEmptyComponent={renderEmptyState}
                refreshing={refreshing}
                onRefresh={handleRefresh}
                showsVerticalScrollIndicator={false}
            />
        </View>
    )
}

export default RenderTodo
