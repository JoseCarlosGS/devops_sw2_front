
import api from "@/lib/axios";
import { dashboardProjectSchema, Project, ProjectFormData } from "../types";
import { isAxiosError } from "axios";

///archivo que se encarga de las peticiones a la api 
export async function createProject(formdata: ProjectFormData) {
    try {
        const { data } = await api.post("/projects", formdata)
        return data
    } catch (error) {
        if (isAxiosError(error) && error.response) {
            throw new Error(error.response.data.message)
        }
        throw new Error("Error creating project")
    }
}

export async function getProjects() {
    try {
        const { data } = await api("/projects")
        const response = dashboardProjectSchema.safeParse(data)
        if (response.success) {
            console.log("response", response)
            return response.data
        }
        return data

    } catch (error) {
        if (isAxiosError(error) && error.response) {
            throw new Error(error.response.data.message)
        }
        throw new Error("Error fetching projects")
    }
}

export async function getProjectById(id: Project['_id']) {
    try {
        const { data } = await api(`/projects/${id}`)
        console.log("Datos recibidos:", data);
        return data;

    } catch (error) {
        if (isAxiosError(error) && error.response) {
            throw new Error(error.response.data.message)
        }
        throw new Error("Error fetching project")
    }
}

type ProjectAPIType = {
    formData: ProjectFormData,
    projectId: Project['_id']
}
export async function updateProject({ formData, projectId }: ProjectAPIType) {
    try {
        const { data } = await api.put<string>(`/projects/${projectId}`, formData)
        return data

    } catch (error) {
        if (isAxiosError(error) && error.response) {
            throw new Error(error.response.data.message)
        }
        
    }
}
export async function deleteProject(id: Project['_id']) {
    try {
        const { data } = await api.delete<string>(`/projects/${id}`)
        return data

    } catch (error) {
        if (isAxiosError(error) && error.response) {
            throw new Error(error.response.data.message)
        }
        throw new Error("Error deleting project")
    }
}

