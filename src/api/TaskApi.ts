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
        // Validar que los parámetros no sean null o undefined
        if (!projectId || !taskId) {
            throw new Error("Project ID y Task ID son requeridos");
        }
        
        const url = `/projects/${projectId}/tasks/${taskId}`;  
        const { data } = await api.get<Task>(url); 
        console.log("Tarea recibida para editar:", data);
        return data;
    } catch (error) {
        if (isAxiosError(error) && error.response) {
            throw new Error(error.response.data.error);           
        }
        throw new Error("Error al obtener la tarea");
    } 
}

export async function updateTaskStatus({projectId, taskId, status}: {
    projectId: Project['_id'];
    taskId: Task['_id'];
    status: Task['status'];
}) {
    try {
        // Validar que los parámetros no sean null o undefined
        if (!projectId || !taskId || !status) {
            throw new Error("Project ID, Task ID y Status son requeridos");
        }
        
        console.log("Updating task status - API call:", { projectId, taskId, status });
        const url = `/projects/${projectId}/tasks/${taskId}/status`;
        const { data } = await api.patch<string>(url, { status });
        console.log("Task status updated successfully:", data);
        return data;
    } catch (error) {
        console.error("Error updating task status:", error);
        if (isAxiosError(error) && error.response) {
            throw new Error(error.response.data.error || "Error del servidor al actualizar tarea");
        }
        throw new Error("Error updating task status");
    }
}