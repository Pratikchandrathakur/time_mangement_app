import { Goal, Task } from '../types';

export interface AppData {
    goal: Goal | null;
    tasks: Task[];
    exportDate: string;
    version: string;
}

export const exportData = (goal: Goal | null, tasks: Task[]): void => {
    const data: AppData = {
        goal,
        tasks,
        exportDate: new Date().toISOString(),
        version: '1.0.0',
    };

    const jsonString = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `zenith-focus-backup-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
};

export const exportToCSV = (tasks: Task[]): void => {
    const headers = ['Title', 'Period', 'Date', 'Duration (min)', 'Completed', 'Priority', 'Tags'];
    const rows = tasks.map(task => [
        task.title,
        task.period,
        new Date(task.date).toLocaleDateString(),
        task.estimatedDuration.toString(),
        task.completed ? 'Yes' : 'No',
        task.priority || 'medium',
        (task.tags || []).join('; '),
    ]);

    const csvContent = [
        headers.join(','),
        ...rows.map(row => row.map(cell => `"${cell}"`).join(',')),
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `zenith-focus-tasks-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
};

export const importData = (file: File): Promise<AppData> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        
        reader.onload = (e) => {
            try {
                const content = e.target?.result as string;
                const data = JSON.parse(content) as AppData;
                
                // Validate data structure
                if (!data.tasks || !Array.isArray(data.tasks)) {
                    throw new Error('Invalid data format: tasks array missing');
                }
                
                resolve(data);
            } catch (error) {
                reject(new Error('Failed to parse JSON file: ' + (error as Error).message));
            }
        };
        
        reader.onerror = () => {
            reject(new Error('Failed to read file'));
        };
        
        reader.readAsText(file);
    });
};
