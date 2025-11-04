
import { useTodo } from '@/hooks/useTodo'
import { Ionicons } from '@expo/vector-icons'
import React from 'react'
import { ActivityIndicator, FlatList, Pressable, Text, View } from 'react-native'

interface Todo {
    id: string
    todoName: string
    deadline: string | null
    importance: 'low' | 'medium' | 'high' | null
    description: string
    createdAt: string
}

const RenderTodo = () => {
    const { todos, loading, refreshing, getImportanceColor, formatDate, handleDelete, handleRefresh } = useTodo();

    const renderTodoItem = ({ item }: { item: Todo }) => (
        <View className="bg-white rounded-xl p-4 mb-3 border border-gray-200">
            {/* Header with title and delete button */}
            <View className="flex-row items-start justify-between mb-2">
                <View className="flex-1 mr-3">
                    <Text className="text-lg font-semibold text-gray-800" numberOfLines={2}>
                        {item.todoName}
                    </Text>
                    {/* Description */}
                    {item.description && (
                        <Text className="text-sm text-gray-600 mt-0" numberOfLines={3}>
                            {item.description}
                        </Text>
                    )}
                </View>
                <Pressable
                    testID={`delete-todo-${item.id}`}  // ← ADD THIS LINE
                    onPress={() => handleDelete(item.id)}
                    className="p-1.5"
                    hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                >
                    <Ionicons name="trash-outline" size={20} color="#ef4444" />
                </Pressable>
            </View>

            {/* Importance badge */}
            {item.importance && (
                <View className="flex-row items-center mb-2 -ml-[2px]">
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