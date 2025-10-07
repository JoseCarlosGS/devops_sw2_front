import { isAxiosError } from "axios";
import api from "@/lib/axios";
import { Task, TaskFormData } from "../types";
import { Project } from "../types";

type TaskApi={
    formData: TaskFormData;
    projectId: Project['_id'];
    taskId: Task['_id'];
}

export async function createTask({formData, projectId}:Pick<TaskApi,'formData'|'projectId'>){

    try {
        const url = `/projects/${projectId}/tasks`;
        const { data } = await api.post<string>(url, formData);
        console.log("Tareas recibidas:", data);
        return data;
    } catch (error) {
        if (isAxiosError(error)&& error.response ) {
            throw new Error(error.response.data.error);           

        }
    }    
}
export async function getTasksByID({projectId, taskId}:Pick<TaskApi,'projectId'|'taskId'>) {
    try {    
        const url = `/projects/${projectId}/tasks/${taskId}`;  
        const { data } = await api.get<Task>(url); 
        console.log("Tarea recibida para editar:", data);
        return data;
    } catch (error) {
        if (isAxiosError(error)&& error.response ) {
            throw new Error(error.response.data.error);           

        }

    } 
}

export async function updateTaskStatus({ projectId, taskId, status }: { 
    projectId: Project['_id'], 
    taskId: Task['_id'], 
    status: string 
}) {
    try {
        const url = `/projects/${projectId}/tasks/${taskId}/status`;
        const { data } = await api.patch<string>(url, { status });
        return data;
    } catch (error) {
        if (isAxiosError(error) && error.response) {
            throw new Error(error.response.data.error);
        }
        throw new Error("Error updating task status");
    }
}