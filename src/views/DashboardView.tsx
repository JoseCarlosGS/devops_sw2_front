import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query"
import { getProjects } from "@/api/ProjectApi";
import { Project } from "../types";
import ProjectKanban from "@/components/projects/ProjectKanban";

export default function DashboardView() {
    // Datos mock temporales para mostrar la vista
    const mockProjects: Project[] = [
        {
            _id: "1",
            projectName: "Agrocadena",
            clientName: "Jaime Méndez",
            description: "proyecto dirigido para el área rural en el sembradío y haciendas",
            status: "pending"
        },
        {
            _id: "2", 
            projectName: "Bluetech",
            clientName: "Sara Monasterios",
            description: "proyecto integración con Bluetech en pasarela de pagos",
            status: "pending"
        },
        {
            _id: "3",
            projectName: "Gestión de Farmacias y co...",
            clientName: "Adriana Méndez Salas",
            description: "nuevo proyecto gestor de proyectos",
            status: "pending"
        }
    ];

    const { data, isLoading, isError } = useQuery<Project[]>({
        queryKey: ["projects"],
        queryFn: getProjects,
    })

    if (isLoading) return (
        <div className="flex justify-center items-center min-h-[400px]">
            <div className="text-xl text-gray-600">Cargando proyectos...</div>
        </div>
    )

    const projectsToShow = data && data.length > 0 ? data : (isError ? mockProjects : [])

    return (
        <>
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-4xl font-bold text-gray-900">Dashboard de Proyectos</h1>
                    <p className="text-lg text-gray-600 mt-2">Gestiona y organiza tus proyectos por estado</p>
                </div>
                <Link
                    className="bg-blue-600 hover:bg-blue-700 px-6 py-3 text-white font-semibold rounded-lg transition-colors shadow-sm"
                    to="/projects/create"
                >
                    + Nuevo Proyecto
                </Link>
            </div>

            <ProjectKanban projects={projectsToShow} />


        </>
    )
}
