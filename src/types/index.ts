
import { z  } from "zod";


/** auth y login */
const authSchema = z.object({
    name: z.string().min(3, { message: "Name must be at least 3 characters long" }),
    email: z.string().email(),
    password: z.string().min(6, { message: "Password must be at least 6 characters long" }),
    confirmedPassword: z.string().min(6, { message: "Password must be at least 6 characters long" }),
});

type Auth = z.infer<typeof authSchema>

export type UserLoginForm = Pick<Auth, 'email' | 'password'>;
export type UserRegistrationForm = Pick<Auth, 'name' | 'email' | 'password' | 'confirmedPassword'>;
/**
 * tasks
 */

export const tasksStatusSchema = z.enum(['pending', 'onHold', 'inProgress', 'underReview', 'completed']);
export const taskSchema = z.object({
    _id: z.string(),
    name: z.string(),
    description: z.string(),
    project: z.string(),
    status: tasksStatusSchema,
    
});
export type Task = z.infer<typeof taskSchema>;
export type TaskFormData = Pick <Task ,'name' | 'description' | 'project' | 'status'>;
export type TaskStatus = z.infer<typeof tasksStatusSchema>;
export type GroupedTasks = Record<TaskStatus, Task[]>;

/** proyects */

export const projectSchema = z.object({
    _id: z.string(),
    projectName: z.string(),
    clientName: z.string(),
    description: z.string(),
});

export const dashboardProjectSchema = z.array (
    projectSchema.pick({
        _id: true,
        projectName: true,
        clientName: true,
        description: true,
    })
)


export type Project = z.infer<typeof projectSchema>;
export type ProjectFormData = Pick <Project ,'clientName' | 'description' | 'projectName'>;
                            ////para el form de tarea 
        ///Pick = solido   /// omit = afecta a medida que se vaya agg
