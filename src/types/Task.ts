export interface Task {
    _id: string;
    title: string;
    description: string;
    status: 'Not Started' | 'In Progress' | 'Done';
    dueDate?: string;
    createdAt: string;
}
