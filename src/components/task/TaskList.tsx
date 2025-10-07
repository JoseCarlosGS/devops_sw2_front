import { Task } from "@/types/index"
import TaskCard from "@/components/task/TaskCard";
import { useMemo, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateTaskStatus } from "@/api/TaskApi";
import { toast } from "react-toastify";
import { useParams } from "react-router-dom";

type TaskListProps = {
    tasks: Task[]
}

type GroupedTasks = {
    [key: string]: Task[]
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
    const [draggedTask, setDraggedTask] = useState<Task | null>(null);
    const { projectId } = useParams();
    const queryClient = useQueryClient();

    const { mutate: updateStatusMutation } = useMutation({
        mutationFn: updateTaskStatus,
        onError: (error) => {
            toast.error(error.message);
        },
        onSuccess: () => {
            toast.success("Estado de tarea actualizado");
            queryClient.invalidateQueries({ queryKey: ["project", projectId] });
        }
    });

    const handleDragStart = (e: React.DragEvent, task: Task) => {
        setDraggedTask(task);
        e.dataTransfer.effectAllowed = "move";
        e.dataTransfer.setData("text/plain", task._id);
        
        // Agregar efecto visual al elemento arrastrado
        const target = e.target as HTMLElement;
        target.classList.add("dragging");
        
        // Agregar clase a todas las zonas de drop
        setTimeout(() => {
            document.querySelectorAll('[data-task-drop-zone]').forEach(zone => {
                zone.classList.add('drop-zone-active');
            });
        }, 0);
    };

    const handleDragEnd = (e: React.DragEvent) => {
        // Restaurar estilos del elemento arrastrado
        const target = e.target as HTMLElement;
        target.classList.remove("dragging");
        
        // Remover clases de todas las zonas de drop
        document.querySelectorAll('[data-task-drop-zone]').forEach(zone => {
            zone.classList.remove('drop-zone-active', 'drop-zone-hover');
        });
        
        setDraggedTask(null);
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = "move";
    };

    const handleDragEnter = (e: React.DragEvent) => {
        e.preventDefault();
        const target = e.currentTarget as HTMLElement;
        if (draggedTask) {
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
        
        if (draggedTask && draggedTask.status !== newStatus && projectId) {
            // Animación de éxito
            target.classList.add("drop-success");
            setTimeout(() => target.classList.remove("drop-success"), 500);
            
            updateStatusMutation({ 
                projectId, 
                taskId: draggedTask._id, 
                status: newStatus 
            });
            
            const statusName = statusTraslations[newStatus];
            toast.success(`✅ Tarea "${draggedTask.name}" movida a ${statusName}`);
        }
        setDraggedTask(null);
    };

    //console.log("TaskList render - tasks received:", tasks);

    // Crear un nuevo objeto inicial en cada render para evitar contaminación
    const groupedTasks = useMemo(() => {
        // CREAR UN NUEVO OBJETO EN CADA CÁLCULO
        const freshInitialGroup: GroupedTasks = {
            pending: [],
            onHold: [],
            inProgress: [],
            underReview: [],
            completed: []
        };

        const grouped = tasks.reduce((acc, task) => {
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

            <div className='flex gap-5 overflow-x-scroll 2xl:overflow-auto pb-32 kanban-container'>
                {Object.entries(groupedTasks).map(([status, statusTasks]) => (
                    <div 
                        key={status} 
                        className='min-w-[300px] 2xl:min-w-0 2xl:w-1/5'
                        data-task-drop-zone={status}
                        onDragOver={handleDragOver}
                        onDragEnter={handleDragEnter}
                        onDragLeave={handleDragLeave}
                        onDrop={(e) => handleDrop(e, status)}
                    >
                        <h3 className={`capitalize text-xl font-light border border-slate-300 bg-white p-3 border-t-8 ${statusStyles[status]}`}>
                            {statusTraslations[status]} ({statusTasks.length})
                        </h3>
                        <ul className='mt-5 space-y-5 min-h-[200px] transition-all duration-200'>
                            {statusTasks.length === 0 ? (
                                <li className="empty-drop-zone">
                                    <p className="text-sm font-medium">No hay tareas</p>
                                    <p className="text-xs mt-1">Arrastra una tarea aquí</p>
                                </li>
                            ) : (
                                statusTasks.map(task => (
                                    <TaskCard 
                                        key={task._id}
                                        task={task}
                                        onDragStart={handleDragStart}
                                        onDragEnd={handleDragEnd}
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