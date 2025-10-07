import { getProjectById } from "@/api/ProjectApi";
import EditProjectForm from "@/components/projects/EditProjectForm";
import { useQuery } from "@tanstack/react-query";
import { Navigate, useParams } from "react-router-dom";



export default function EditProjectView() { 
    const params = useParams()
    const projectId = params.projectId!    

    console.log("projectId:", projectId); 

    const { data, isLoading, isError } = useQuery({
        queryKey: ['editProject', projectId],
        queryFn: () => getProjectById(projectId),
        retry: false,        ///para que no intente hacer la conx varias veces
    });

    if (isLoading) return 'Cargando...'
    if (isError) return <Navigate to="/404" />  
    if (!data) return <p>No se encontró el proyecto</p> 
    if (data) return <EditProjectForm data={data} projectId={projectId} />

}