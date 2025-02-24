import React, { useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { getTasks, createTask, updateTask, deleteTask } from "../api/taskApi";
import { Task } from "../types/Task";
import axios from "axios";
import { useAuth } from "../context/AuthContext";

const Tasks = () => {
    const { user } = useAuth();
    const userId = user ? user._id : null;

    const [tasks, setTasks] = useState<Task[]>([]);
    const [newTask, setNewTask] = useState<Omit<Task, "_id" | "createdAt" | "userId">>({
        title: "",
        description: "",
        status: "Not Started",
        dueDate: new Date().toISOString().split("T")[0],
    });

    const [filter, setFilter] = useState("All");

    useEffect(() => {
        if (userId) {
            fetchTasks();
        }
    }, [userId]);

    const fetchTasks = async () => {
        if (!userId) {
            console.error("❌ Fehler: userId ist nicht gesetzt.");
            return;
        }

        try {
            console.log("📥 Fetching tasks for user:", userId);
            const response = await axios.get(`http://localhost:5002/tasks?userId=${userId}`);
            setTasks(response.data);
        } catch (error) {
            console.error("❌ Fehler beim Laden der Tasks:", error);
        }
    };
    const handleDeleteTask = async (id: string) => {
        try {
            await deleteTask(id);
            await fetchTasks();
            toast.success("🗑️ Task erfolgreich gelöscht!");
        } catch (error) {
            console.error("❌ Fehler beim Löschen der Task:", error);
            toast.error("❌ Task konnte nicht gelöscht werden!");
        }
    };

    const handleCreateTask = async () => {
        if (!userId) {
            toast.error("⚠️ Fehler: Benutzer-ID fehlt.");
            console.error("❌ Fehler: userId fehlt.");
            return;
        }

        if (!newTask.title || !newTask.description) {
            toast.error("⚠️ Bitte fülle alle Felder aus!");
            return;
        }

        try {
            const taskData = { ...newTask, userId };
            console.log("📤 Sending Task Data to API:", taskData);

            const response = await createTask(taskData);
            console.log("✅ Task erstellt:", response);

            setNewTask({
                title: "",
                description: "",
                status: "Not Started",
                dueDate: new Date().toISOString().split("T")[0],
            });

            await fetchTasks();
        } catch (error: any) {
            console.error("❌ Fehler beim Erstellen des Tasks:", error.response?.data || error.message);
            toast.error("❌ Task konnte nicht erstellt werden!");
        }
    };

    const handleStatusChange = async (id: string, newStatus: "Not Started" | "In Progress" | "Done") => {
        try {
            console.log(`🔄 Updating task ${id} to status: ${newStatus}`);

            await updateTask(id, { status: newStatus });

            toast.success("✅ Status erfolgreich aktualisiert!");
            await fetchTasks();
        } catch (error) {
            console.error("❌ Fehler beim Aktualisieren der Task:", error);
            toast.error("❌ Status konnte nicht aktualisiert werden!");
        }
    };

    const filteredTasks = tasks.filter((task) => {
        if (filter === "All") return true; // Show all tasks
        return task.status === filter; // Only show tasks that match the selected filter
    });

    return (
        <div className="p-6">
            <h1 className="text-3xl font-bold mb-4">Tasks</h1>

            <ToastContainer />

            {/* Filter-Buttons */}
            <div className="flex gap-4 mb-6">
                {["All", "Not Started", "In Progress", "Done"].map((status) => (
                    <button
                        key={status}
                        onClick={() => setFilter(status)}
                        className={`px-4 py-2 rounded ${
                            filter === status ? "bg-purple-500 text-white" : "bg-gray-200 text-gray-800"
                        } hover:bg-purple-400`}
                    >
                        {status}
                    </button>
                ))}
            </div>

            <div className="bg-gray-100 p-4 rounded shadow mb-6">
                <h2 className="text-xl font-semibold mb-2">Add New Task</h2>
                <div className="flex flex-col sm:flex-row gap-4">
                    <input
                        type="text"
                        placeholder="Title"
                        value={newTask.title}
                        onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                        className="border rounded p-2 w-full"
                    />
                    <textarea
                        placeholder="Description (use commas for bullet points)"
                        value={newTask.description}
                        onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                        className="border rounded p-2 w-full"
                    />
                    <input
                        type="date"
                        value={newTask.dueDate}
                        onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })}
                        className="border rounded p-2"
                    />
                    <button
                        onClick={handleCreateTask}
                        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                    >
                        Add Task
                    </button>
                </div>
            </div>

            {/* Task-Liste */}
            <table className="table-auto w-full bg-white shadow rounded">
                <thead>
                <tr className="bg-gray-200 text-left">
                    <th className="p-4">Title</th>
                    <th className="p-4">Description</th>
                    <th className="p-4">Due Date</th>
                    <th className="p-4">Status</th>
                    <th className="p-4">Actions</th>
                </tr>
                </thead>
                <tbody>
                {filteredTasks.map((task) => (
                    <tr key={task._id} className="border-b hover:bg-gray-50">
                        <td className="p-4">{task.title}</td>
                        <td className="p-4">{task.description}</td>
                        <td className="p-4">{task.dueDate ? new Date(task.dueDate).toLocaleDateString() : "-"}</td>
                        <td className="p-4">
                            <select
                                value={task.status}
                                onChange={(e) => handleStatusChange(task._id, e.target.value as "Not Started" | "In Progress" | "Done")}
                                className="border rounded p-2"
                            >
                                <option value="Not Started">Not Started</option>
                                <option value="In Progress">In Progress</option>
                                <option value="Done">Done</option>
                            </select>
                        </td>
                        <td className="p-4 flex gap-2">
                            <button
                                onClick={() => handleDeleteTask(task._id)}
                                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                            >
                                Delete
                            </button>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
};

export default Tasks;
