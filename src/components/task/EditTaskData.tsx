
import { useLocation, useParams } from "react-router"
import { useQuery } from '@tanstack/react-query'
import { getTasksByID } from "@/api/TaskApi"

export default function EditTaskData() {
    const params = useParams()
    const projectId = params.projectId!

    const location = useLocation()
    const queryParams = new URLSearchParams(location.search)
    const taskId = queryParams.get('editTask')
    
    console.log("EditTaskData render - taskId from URL:", taskId);
    
    // No ejecutar la query si taskId es null
    const { data, isLoading, error } = useQuery({
        queryKey: ['tasks', taskId],
        queryFn: () => getTasksByID({ projectId, taskId: taskId! }),
        enabled: !!taskId && !!projectId, // Solo ejecutar si ambos IDs están definidos
    })
    
    console.log("Task data para editar:", data);
    
    // Si no hay taskId, no renderizar nada
    if (!taskId) {
        return null
    }
    
    // Si está cargando
    if (isLoading) {
        return <div>Cargando tarea...</div>
    }
    
    // Si hay error
    if (error) {
        return <div>Error al cargar la tarea</div>
    }
    
    // Si hay data, renderizar el formulario de edición
    if (data) {
        // Aquí deberías renderizar tu componente de edición de tarea
        // Por ahora retornamos un placeholder
        return <div>Formulario de edición para tarea: {data.name}</div>
    }
    
    return null
}
