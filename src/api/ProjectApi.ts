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
        console.log('Fetching projects from:', api.defaults.baseURL);
        const { data } = await api.get("/projects");

        // Some misconfigurations (for example pointing VITE_API_URL to the Vite dev server)
        // return HTML (index.html). Detect that case and throw a helpful error instead
        if (typeof data === 'string' && data.trim().startsWith('<')) {
            console.error('getProjects: received HTML response (likely wrong VITE_API_URL)');
            console.error('Current base URL:', api.defaults.baseURL);
            console.error(data.substring(0, 500));
            throw new Error('Invalid API response: received HTML. Check VITE_API_URL in your .env')
        }

        console.log('Received projects data:', data);
        // If the backend returns the expected array shape, validate it with zod
        const response = dashboardProjectSchema.safeParse(data);
        if (response.success) {
            return response.data;
        }

        // If data is already an array (but didn't match the schema), return it to avoid breaking
        if (Array.isArray(data)) {
            console.warn('Data validation failed but received array. Returning raw data.');
            return data;
        }

        // Unknown response shape
        console.error('getProjects: unexpected response shape', data);
        throw new Error('Invalid API response: expected array of projects');

    } catch (error) {
        console.error('Error in getProjects:', error);
        if (isAxiosError(error)) {
            console.error('Axios error details:', {
                baseURL: error.config?.baseURL,
                url: error.config?.url,
                method: error.config?.method,
                status: error.response?.status
            });
            throw new Error(`Error fetching projects: ${error.response?.data?.message || error.message}`);
        }
        throw new Error("Error fetching projects");
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

