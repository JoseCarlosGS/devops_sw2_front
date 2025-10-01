
import { useLocation, useParams } from "react-router"
import { useQuery } from '@tanstack/react-query'
import { getTasksByID } from "@/api/TaskApi"

export default function EditTaskData() {
    const params = useParams()
    const projectId = params.projectId!

    const location= useLocation()
    const queryParams = new URLSearchParams(location.search)
    const taskId = queryParams.get('editTask')!
    console.log("EditTaskData render - taskId from URL:", taskId);
    const { data } = useQuery({
        queryKey: ['tasks', taskId],
        queryFn: () => getTasksByID({ projectId, taskId }),
       // enabled: !!taskId, // Solo ejecutar la consulta si taskId está definido
    })
    console.log("Task data para editar:", data);
    if (data) return <EditTaskData/>
    
}
