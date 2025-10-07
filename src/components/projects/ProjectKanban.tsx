import { useState, useEffect } from "react";
import {

    UserIcon,
    EllipsisVerticalIcon,
    EyeIcon,
    PencilIcon,
    TrashIcon
} from "@heroicons/react/20/solid";
import { Menu, Transition } from "@headlessui/react";
import { Fragment } from "react";
import { Link } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { Project } from "@/types/index";
import { deleteProject, updateProjectStatus } from "@/api/ProjectApi";



type ProjectKanbanProps = {
    projects: Project[];
}

const projectStatuses = [
    {
        id: "pending",
        name: "Pendiente",
        headerColor: "bg-gray-500"
    },
    {
        id: "waiting",
        name: "En Espera", 
        headerColor: "bg-red-500"
    },
    {
        id: "inProgress",
        name: "En Progreso",
        headerColor: "bg-blue-500"
    },
    {
        id: "inReview",
        name: "En Revisión",
        headerColor: "bg-orange-500"
    },
    {
        id: "completed",
        name: "Completado",
        headerColor: "bg-green-500"
    }
];

export default function ProjectKanban({ projects }: ProjectKanbanProps) {
    const [draggedProject, setDraggedProject] = useState<Project | null>(null);
    const [optimisticProjects, setOptimisticProjects] = useState<Project[]>(projects);
    const queryClient = useQueryClient();

    // Sincronizar con los props cuando cambien
    useEffect(() => {
        setOptimisticProjects(projects);
    }, [projects]);

    const { mutate: deleteProjectMutation } = useMutation({
        mutationFn: deleteProject,
        onError: (error) => {
            toast.error(error.message);
        },
        onSuccess: () => {
            toast.success("Proyecto eliminado correctamente");
            queryClient.invalidateQueries({ queryKey: ["projects"] });
        }
    });

    const { mutate: updateStatusMutation, isPending: isUpdating } = useMutation({
        mutationFn: updateProjectStatus,
        onError: (error, variables) => {
            // Revertir el estado optimista en caso de error
            setOptimisticProjects(projects);
            toast.error(error.message || "Error al actualizar el proyecto");
            console.error("Error updating project status:", error);
        },
        onSuccess: (data) => {
            // Invalidar queries para sincronizar con el backend
            queryClient.invalidateQueries({ queryKey: ["projects"] });
            console.log("Project status updated successfully:", data);
        }
    });

    const handleDeleteProject = (projectId: string, projectName: string) => {
        if (window.confirm(`¿Estás seguro de que quieres eliminar el proyecto "${projectName}"?`)) {
            deleteProjectMutation(projectId);
        }
    };

    const handleDragStart = (e: React.DragEvent, project: Project) => {
        setDraggedProject(project);
        e.dataTransfer.effectAllowed = "move";
        e.dataTransfer.setData("text/plain", project._id);
        
        // Agregar efecto visual al elemento arrastrado
        const target = e.target as HTMLElement;
        target.style.opacity = "0.6";
        target.style.transform = "rotate(5deg)";
        target.classList.add("shadow-2xl", "z-50");
        
        // Agregar clase a todas las zonas de drop
        setTimeout(() => {
            document.querySelectorAll('[data-drop-zone]').forEach(zone => {
                zone.classList.add('drop-zone-active');
            });
        }, 0);
    };

    const handleDragEnd = (e: React.DragEvent) => {
        // Restaurar estilos del elemento arrastrado
        const target = e.target as HTMLElement;
        target.style.opacity = "1";
        target.style.transform = "rotate(0deg)";
        target.classList.remove("shadow-2xl", "z-50");
        
        // Remover clases de todas las zonas de drop
        document.querySelectorAll('[data-drop-zone]').forEach(zone => {
            zone.classList.remove('drop-zone-active', 'drop-zone-hover');
        });
        
        setDraggedProject(null);
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = "move";
    };

    const handleDragEnter = (e: React.DragEvent) => {
        e.preventDefault();
        const target = e.currentTarget as HTMLElement;
        if (draggedProject) {
            target.classList.add("drop-zone-hover");
        }
    };

    const handleDragLeave = (e: React.DragEvent) => {
        e.preventDefault();
        const target = e.currentTarget as HTMLElement;
        // Solo remover si realmente salimos del elemento
        if (!target.contains(e.relatedTarget as Node)) {
            target.classList.remove("drop-zone-hover");
        }
    };

    const handleDrop = (e: React.DragEvent, newStatus: string) => {
        e.preventDefault();
        const target = e.currentTarget as HTMLElement;
        target.classList.remove("drop-zone-hover");
        
        if (draggedProject && draggedProject.status !== newStatus) {
            const updatedProjects = optimisticProjects.map(project => 
                project._id === draggedProject._id 
                    ? { ...project, status: newStatus }
                    : project
            );
            setOptimisticProjects(updatedProjects);
            
            target.classList.add("drop-success");
            setTimeout(() => target.classList.remove("drop-success"), 500);
            
            updateStatusMutation({ 
                projectId: draggedProject._id, 
                status: newStatus 
            });
            const statusName = projectStatuses.find(s => s.id === newStatus)?.name;
            toast.success(`✅ Proyecto "${draggedProject.projectName}" movido a ${statusName}`);
        }
        setDraggedProject(null);
    };

    const getProjectsByStatus = (statusId: string) => {
        return optimisticProjects.filter(project => {
            const projectStatus = project.status || "pending";
            return projectStatus === statusId;
        });
    };

    const getProjectCount = (statusId: string) => {
        return getProjectsByStatus(statusId).length;
    };

    return (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            {/* Header */}
            <div className="border-b border-gray-200 p-6">
                <h2 className="text-2xl font-bold text-gray-900">Proyectos</h2>
            </div>

            {/* Kanban Board */}
            <div className="p-6">
                <div className="flex gap-4 overflow-x-auto kanban-container">
                    {projectStatuses.map((status) => (
                        <div
                            key={status.id}
                            className="flex-shrink-0 w-64"
                            data-drop-zone={status.id}
                            onDragOver={handleDragOver}
                            onDragEnter={handleDragEnter}
                            onDragLeave={handleDragLeave}
                            onDrop={(e) => handleDrop(e, status.id)}
                        >

                            <div className={`${status.headerColor} text-white p-3 text-center`}>
                                <h3 className="font-medium text-sm">
                                    {status.name} ({getProjectCount(status.id)})
                                </h3>
                            </div>

                            <div className="border-2 border-gray-200 min-h-[400px] bg-gray-50 transition-all duration-200">

                                <div className="p-3 space-y-3">
                                    {getProjectsByStatus(status.id).map((project) => (
                                        <div
                                            key={project._id}
                                            draggable
                                            onDragStart={(e) => handleDragStart(e, project)}
                                            onDragEnd={handleDragEnd}
                                            className="bg-white rounded border border-gray-200 p-3 draggable-card select-none"
                                        >
                                            <div className="flex items-start justify-between mb-2">
                                                <h4 className="font-medium text-gray-900 text-sm truncate">
                                                    {project.projectName}
                                                </h4>

                                                <Menu as="div" className="relative">
                                                    <Menu.Button className="p-1 rounded-full hover:bg-gray-100">
                                                        <EllipsisVerticalIcon className="h-4 w-4 text-gray-400" />
                                                    </Menu.Button>

                                                    <Transition
                                                        as={Fragment}
                                                        enter="transition ease-out duration-100"
                                                        enterFrom="transform opacity-0 scale-95"
                                                        enterTo="transform opacity-100 scale-100"
                                                        leave="transition ease-in duration-75"
                                                        leaveFrom="transform opacity-100 scale-100"
                                                        leaveTo="transform opacity-0 scale-95"
                                                    >
                                                        <Menu.Items className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-lg bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                                                            <Menu.Item>
                                                                {({ active }) => (
                                                                    <Link
                                                                        to={`/projects/${project._id}`}
                                                                        className={`${
                                                                            active ? 'bg-gray-50' : ''
                                                                        } flex items-center gap-2 px-4 py-2 text-sm text-gray-700`}
                                                                    >
                                                                        <EyeIcon className="h-4 w-4" />
                                                                        Ver Proyecto
                                                                    </Link>
                                                                )}
                                                            </Menu.Item>
                                                            <Menu.Item>
                                                                {({ active }) => (
                                                                    <Link
                                                                        to={`/projects/${project._id}/edit`}
                                                                        className={`${
                                                                            active ? 'bg-gray-50' : ''
                                                                        } flex items-center gap-2 px-4 py-2 text-sm text-gray-700`}
                                                                    >
                                                                        <PencilIcon className="h-4 w-4" />
                                                                        Editar Proyecto
                                                                    </Link>
                                                                )}
                                                            </Menu.Item>
                                                            <Menu.Item>
                                                                {({ active }) => (
                                                                    <button
                                                                        onClick={() => handleDeleteProject(project._id, project.projectName)}
                                                                        className={`${
                                                                            active ? 'bg-red-50' : ''
                                                                        } flex items-center gap-2 px-4 py-2 text-sm text-red-600 w-full text-left`}
                                                                    >
                                                                        <TrashIcon className="h-4 w-4" />
                                                                        Eliminar Proyecto
                                                                    </button>
                                                                )}
                                                            </Menu.Item>
                                                        </Menu.Items>
                                                    </Transition>
                                                </Menu>
                                            </div>

                                            <div className="flex items-center justify-between mb-2">
                                                <div className="flex items-center gap-2">
                                                    <UserIcon className="h-3 w-3 text-gray-400" />
                                                    <span className="text-xs text-gray-600">{project.clientName}</span>
                                                </div>
                                                <div className={`w-2 h-2 rounded-full ${
                                                    projectStatuses.find(s => s.id === (project.status || 'pending'))?.headerColor || 'bg-gray-500'
                                                }`}></div>
                                            </div>

                                            <p className="text-xs text-gray-600 line-clamp-2">
                                                {project.description}
                                            </p>
                                        </div>
                                    ))}


                                    {getProjectsByStatus(status.id).length === 0 && (
                                        <div className="empty-drop-zone mx-2">
                                            <p className="text-sm font-medium">No hay proyectos</p>
                                            <p className="text-xs mt-1">Arrastra un proyecto aquí</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}