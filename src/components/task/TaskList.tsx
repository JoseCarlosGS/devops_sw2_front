import { Task, GroupedTasks } from "@/types/index"
import TaskCard from "@/components/task/TaskCard";
import { useMemo, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateTaskStatus } from "@/api/TaskApi";
import { toast } from "react-toastify";
import { useParams } from "react-router-dom";

type TaskListProps = {
    tasks: Task[]
}
const statusStyles: { [key: string]: string } = {
    pending: 'border-t-slate-500',
    onHold: 'border-t-red-500',
    inProgress: 'border-t-blue-500',
    underReview: 'border-t-amber-500',
    completed: 'border-t-emerald-500'
}
const statusTraslations: { [key: string]: string } = {
    pending: 'Pendiente',
    onHold: 'En Espera',
    inProgress: 'En Progreso',
    underReview: 'En Revisión',
    completed: 'Completado'
}

export default function TaskList({ tasks }: TaskListProps) {
    const { projectId } = useParams()
    const queryClient = useQueryClient()
    const [dragOverColumn, setDragOverColumn] = useState<string | null>(null)
    
    const { mutate } = useMutation({
        mutationFn: updateTaskStatus,
        onError: (error) => {
            toast.error(error.message)
        },
        onSuccess: (data) => {
            toast.success("Estado de tarea actualizado")
            queryClient.invalidateQueries({ queryKey: ["project", projectId] })
        }
    })

    const handleDrop = (e: React.DragEvent, newStatus: string) => {
        e.preventDefault()
        setDragOverColumn(null)
        
        try {
            const data = e.dataTransfer.getData('text/plain')
            const { taskId, currentStatus } = JSON.parse(data)
            
            // Validar que taskId existe y no es null/undefined
            if (!taskId) {
                toast.error("Error: ID de tarea no válido")
                console.error("TaskId is null or undefined:", { taskId, currentStatus, data })
                return
            }
            
            // Validar que projectId existe
            if (!projectId) {
                toast.error("Error: ID de proyecto no válido")
                console.error("ProjectId is null or undefined:", projectId)
                return
            }
            
            if (currentStatus !== newStatus) {
                console.log("Updating task status:", { projectId, taskId, status: newStatus })
                mutate({
                    projectId,
                    taskId,
                    status: newStatus as Task['status']
                })
            }
        } catch (error) {
            console.error("Error parsing drag data:", error)
            toast.error("Error al mover la tarea")
        }
    }

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault()
    }

    const handleDragEnter = (status: string) => {
        setDragOverColumn(status)
    }

    const handleDragLeave = (e: React.DragEvent) => {
        // Solo limpiar si realmente salimos del contenedor
        if (!e.currentTarget.contains(e.relatedTarget as Node)) {
            setDragOverColumn(null)
        }
    }
    
    //console.log("TaskList render - tasks received:", tasks);
    
    // Crear un nuevo objeto inicial en cada render para evitar contaminación
    const groupedTasks = useMemo(() => {
        // Verificar si hay tareas sin ID válido
        const tasksWithoutId = tasks.filter(task => !task._id);
        if (tasksWithoutId.length > 0) {
            console.warn("Found tasks without valid ID:", tasksWithoutId);
        }
        
        // CREAR UN NUEVO OBJETO EN CADA CÁLCULO
        const freshInitialGroup: GroupedTasks = {
            pending: [],
            onHold: [],
            inProgress: [],
            underReview: [],
            completed: []
        };
        
        const grouped = tasks.reduce((acc, task) => {
            // Solo procesar tareas con ID válido
            if (!task._id) {
                console.error("Skipping task without ID:", task);
                return acc;
            }
            
            const status = task.status || "pending";
            //console.log(`Processing task: ${task.name} with status: ${status}`);
            if (!acc[status]) {
                acc[status] = [];
            }
            
            acc[status].push(task);
            return acc;
        }, freshInitialGroup); 
        
       // console.log("Final grouped result:", grouped);
        return grouped;
    }, [tasks]);

    return (
        <>
            <h2 className="text-5xl font-black my-10">Tareas</h2>

            <div className='flex gap-5 overflow-x-scroll 2xl:overflow-auto pb-32'>
                {Object.entries(groupedTasks).map(([status, statusTasks]) => (
                    <div 
                        key={status} 
                        className={`min-w-[300px] 2xl:min-w-0 2xl:w-1/5 transition-all duration-200 ${
                            dragOverColumn === status ? 'transform scale-105' : ''
                        }`}
                        onDrop={(e) => handleDrop(e, status)}
                        onDragOver={handleDragOver}
                        onDragEnter={() => handleDragEnter(status)}
                        onDragLeave={handleDragLeave}
                    >
                        <h3 className={`capitalize text-xl font-light border border-slate-300 bg-white p-3 border-t-8 ${statusStyles[status]} ${
                            dragOverColumn === status ? 'shadow-lg' : ''
                        }`}>
                            {statusTraslations[status]} ({statusTasks.length})
                        </h3>
                        <ul 
                            className={`mt-5 space-y-5 min-h-[200px] p-2 rounded-lg transition-all duration-200 ${
                                dragOverColumn === status 
                                    ? 'bg-blue-50 border-2 border-dashed border-blue-300' 
                                    : 'bg-transparent'
                            }`}
                            onDrop={(e) => handleDrop(e, status)}
                            onDragOver={handleDragOver}
                        >
                            {statusTasks.length === 0 ? (
                                <li className="text-gray-500 text-center pt-3">No Hay tareas</li>
                            ) : (
                                statusTasks
                                    .filter(task => task._id) // Filtrar tareas sin ID válido
                                    .map(task => (
                                        <TaskCard 
                                            key={task._id}
                                            task={task} 
                                        />
                                    ))
                            )}
                        </ul>
                    </div>
                ))}
            </div>
        </>
    )
}