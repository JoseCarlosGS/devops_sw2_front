import { Task } from "@/types/index"
import TaskCard from "@/components/task/TaskCard";
import { useMemo } from "react";

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

            <div className='flex gap-5 overflow-x-scroll 2xl:overflow-auto pb-32'>
                {Object.entries(groupedTasks).map(([status, statusTasks]) => (
                    <div key={status} className='min-w-[300px] 2xl:min-w-0 2xl:w-1/5'>
                        <h3 className={`capitalize text-xl font-light border border-slate-300 bg-white p-3 border-t-8 ${statusStyles[status]}`}>
                            {statusTraslations[status]} ({statusTasks.length})
                        </h3>
                        <ul className='mt-5 space-y-5'>
                            {statusTasks.length === 0 ? (
                                <li className="text-gray-500 text-center pt-3">No Hay tareas</li>
                            ) : (
                                statusTasks.map(task => (
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