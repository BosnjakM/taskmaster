import axios from 'axios';
import { Task } from '../types/Task';

const API_URL = 'http://localhost:5002/tasks';

export const getTasks = async (userId: string): Promise<Task[]> => {
    const response = await axios.get(`${API_URL}?userId=${userId}`);
    return response.data;
};

// Task mit `userId` speichern
export const createTask = async (task: Omit<Task, '_id' | 'createdAt'>): Promise<Task> => {
    const response = await axios.post(API_URL, task);
    return response.data; // ✅ Ensure response.data is returned
};

    export const updateTask = async (id: string, updatedTask: Partial<Task>): Promise<Task> => {
        const response = await axios.put(`http://localhost:5002/tasks/${id}`, updatedTask);
        return response.data;
    };

    export const deleteTask = async (id: string): Promise<void> => {
        await axios.delete(`http://localhost:5002/tasks/${id}`);
    };
