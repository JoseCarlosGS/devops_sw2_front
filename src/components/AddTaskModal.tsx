import { Fragment, use } from "react";
import { Dialog, Transition, } from "@headlessui/react";
import { useLocation, useNavigate, useParams } from "react-router";
import { useForm } from "react-hook-form";
import TaskForm from "./task/TaskForm";
import { TaskFormData } from "../types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createTask } from "@/api/TaskApi";
import { toast } from "react-toastify";
export default function AddTaskModal() {
    const navigate = useNavigate();
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const modalTask = queryParams.get('newTask');
    const showModal = modalTask ? true : false;
    /**    * obterener el projectId de la url     */
    const params = useParams()
    const projectId = params.projectId! 
    const initialValues = {
        name: '',
        description: ''
    }

    const { register, handleSubmit,reset, formState: { errors } } = useForm({ defaultValues: initialValues })
    const queryClient = useQueryClient()
    const { mutate } = useMutation({
        mutationFn: createTask ,
        onError :(error)=>{
            toast.error(error.message)
        },
        onSuccess :(data)=>{
                queryClient.invalidateQueries({ queryKey: ['editProject', projectId] })
            toast.success(data)
            reset()
            navigate(location.pathname, { replace: true }) 
        }
    })
    const handleCreateTask = (formData: TaskFormData) => {
        const data = {
            formData,
            projectId
        }
        mutate(data)
        }
        
    
    return (
        <>
            <Transition appear show={showModal} as={Fragment}>
                <Dialog
                    as="div"
                    className="relative z-10"
                    onClose={() => navigate(location.pathname, { replace: true })}
                >
                    {/* Overlay */}
                    <Transition.Child
                        as={Fragment}
                        enter="ease-out duration-300"
                        enterFrom="opacity-0"
                        enterTo="opacity-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                    >
                        <div className="fixed inset-0 bg-black/50" aria-hidden="true" />
                    </Transition.Child>

                    {/* Contenido */}
                    <div className="fixed inset-0 overflow-y-auto">
                        <div className="flex items-center justify-center min-h-full p-4 text-center">
                            <Transition.Child
                                as={Fragment}
                                enter="ease-out duration-300"
                                enterFrom="opacity-0 scale-95"
                                enterTo="opacity-100 scale-100"
                                leave="ease-in duration-200"
                                leaveFrom="opacity-100 scale-100"
                                leaveTo="opacity-0 scale-95"
                            >
                                <Dialog.Panel className="w-full max-w-4xl transform overflow-hidden rounded-2xl bg-white text-left align-middle shadow-xl transition-all p-16">
                                    <Dialog.Title
                                        as="h3"
                                        className="font-black text-4xl my-5"
                                    >
                                        Nueva Tarea
                                    </Dialog.Title>

                                    <p className="text-xl font-bold">
                                        Llena el Formulario y crea{" "}
                                        <span className="text-cyan-500">una tarea</span>
                                    </p>

                                    <form
                                        className="mt-10 space-y-3"
                                        onSubmit={handleSubmit(handleCreateTask)}
                                        noValidate
                                    >
                                        <TaskForm register={register} errors={errors} />

                                        <input
                                            type="submit"
                                            value="Guardar Tarea"
                                            className="bg-cyan-500 hover:bg-cyan-600 w-full p-3 text-white uppercase font-bold cursor-pointer transition-colors rounded-md mt-8"
                                        />
                                    </form>
                                </Dialog.Panel>
                            </Transition.Child>
                        </div>
                    </div>
                </Dialog>
            </Transition>

        </>
    )
}
