import { useTodo } from '@/hooks/useTodo'
import { Ionicons } from '@expo/vector-icons'
import DateTimePicker from '@react-native-community/datetimepicker'
import React from 'react'
import { ActivityIndicator, Platform, Pressable, Text, TextInput, View } from 'react-native'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'

const AddTodo = () => {
    const { todoName,
        setTodoName,
        deadline,
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
        getImportanceColor, } = useTodo();



    return (
        <View className="flex-1 justify-end" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
            {/* Background overlay */}
            <Pressable
                className="absolute inset-0"
                onPress={handleBackdropPress}
            />

            {/* Bottom sheet content */}
            <View className="bg-white rounded-t-[20px] pb-5" style={{ maxHeight: '90%' }}>
                <KeyboardAwareScrollView
                    showsVerticalScrollIndicator={false}
                    enableOnAndroid={true}
                    enableAutomaticScroll={true}
                    extraScrollHeight={20}
                    keyboardShouldPersistTaps="handled"
                    contentContainerStyle={{ padding: 20, paddingTop: 24 }}
                >
                    <Text className="text-[22px] font-semibold text-gray-800 mb-7">
                        Create New Todo
                    </Text>

                    {/* Todo Name Input */}
                    <View className="mb-6">
                        <Text className="text-sm font-medium text-gray-700 mb-2.5">
                            Todo Name *
                        </Text>
                        <View className="flex-row items-center gap-2.5 border-b border-gray-300 pb-3">
                            <Ionicons name="checkbox-outline" size={24} color="#6b7280" />
                            <TextInput
                                placeholder='Enter todo name'
                                placeholderTextColor='#9ca3af'
                                className="flex-1 text-gray-800 text-base p-0"
                                value={todoName}
                                onChangeText={setTodoName}
                                autoFocus
                                maxLength={100}
                            />
                        </View>
                    </View>

                    {/* Deadline Input */}
                    <View className="mb-6">
                        <Text className="text-sm font-medium text-gray-700 mb-2.5">
                            Deadline
                        </Text>
                        <Pressable
                            onPress={() => setShowDatePicker(true)}
                            className="flex-row items-center gap-2.5 border-b border-gray-300 pb-3"
                        >
                            <Ionicons name="calendar-outline" size={24} color="#6b7280" />
                            <Text className={`flex-1 text-base ${deadline ? 'text-gray-800' : 'text-gray-400'}`}>
                                {deadline ? formatDate(deadline) : 'Select deadline date'}
                            </Text>
                            <Ionicons name="chevron-forward" size={20} color="#9ca3af" />
                        </Pressable>

                        {showDatePicker && (
                            <DateTimePicker
                                value={deadline || new Date()}
                                mode="date"
                                display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                                onChange={handleDateChange}
                                minimumDate={new Date()}
                            />
                        )}
                    </View>

                    {/* Importance Level */}
                    <View className="mb-6">
                        <Text className="text-sm font-medium text-gray-700 mb-3">
                            Importance Level
                        </Text>
                        <View className="flex-row gap-3">
                            {['low', 'medium', 'high'].map((level) => (
                                <Pressable
                                    key={level}
                                    onPress={() => setImportance(level as any)}
                                    className="flex-1 py-3.5 rounded-lg border-2 items-center"
                                    style={{
                                        borderColor: importance === level ? getImportanceColor(level) : '#e5e7eb',
                                        backgroundColor: importance === level ? `${getImportanceColor(level)}10` : 'transparent'
                                    }}
                                >
                                    <Text
                                        className="font-medium capitalize text-[15px]"
                                        style={{
                                            color: importance === level ? getImportanceColor(level) : '#6b7280'
                                        }}
                                    >
                                        {level}
                                    </Text>
                                </Pressable>
                            ))}
                        </View>
                    </View>

                    {/* Description Input */}
                    <View className="mb-6">
                        <Text className="text-sm font-medium text-gray-700 mb-2.5">
                            Description
                        </Text>
                        <View className="border border-gray-300 rounded-lg p-3 min-h-[100px]">
                            <TextInput
                                placeholder='Add description (optional)'
                                placeholderTextColor='#9ca3af'
                                className="text-gray-800 text-base min-h-[100px]"
                                style={{ textAlignVertical: 'top' }}
                                value={description}
                                onChangeText={setDescription}
                                multiline
                                maxLength={500}
                            />
                        </View>
                        <Text className="text-xs text-gray-600 mt-1.5 text-right">
                            {description.length}/500
                        </Text>
                    </View>

                    {/* Create Button */}
                    <Pressable
                        onPress={handleCreate}
                        className={`bg-[#22c065] py-4 rounded-[10px] items-center mt-2 ${(creatingTodo || !todoName.trim()) ? 'opacity-50' : ''}`}
                        disabled={creatingTodo || !todoName.trim()}
                    >
                        {creatingTodo ? (
                            <ActivityIndicator size="small" color="white" />
                        ) : (
                            <Text className="text-center text-white font-semibold text-[17px]">
                                Create Todo
                            </Text>
                        )}
                    </Pressable>

                    {/* Cancel Button */}
                    <Pressable
                        onPress={handleCancel}
                        className="bg-gray-200 py-4 rounded-[10px] items-center mt-3"
                        disabled={creatingTodo}
                    >
                        <Text className="text-center text-gray-800 font-semibold text-[17px]">
                            Cancel
                        </Text>
                    </Pressable>

                    <View className="h-5" />
                </KeyboardAwareScrollView>
            </View>
        </View>
    )
}

export default AddTodo