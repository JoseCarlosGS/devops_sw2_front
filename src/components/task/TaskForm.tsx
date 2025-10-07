import { FieldErrors, UseFormRegister } from "react-hook-form"
import { TaskFormData } from "@/types/index";
import ErrorMessage from "../ErrorMessage";

type TaskFormProps = {
    errors: FieldErrors<TaskFormData>
    register: UseFormRegister<TaskFormData>
}

export default function TaskForm({errors, register} : TaskFormProps) {
    return (
        <>
            <div className="flex flex-col gap-5">
                <label
                    className="font-normal text-2xl"
                    htmlFor="name"
                >Nombre de la tarea</label>
                <input
                    id="name"
                    type="text"
                    placeholder="Nombre de la tarea"
                    className={`w-full p-3 border ${
                        errors.name ? 'border-red-500 bg-red-50' : 'border-gray-300'
                    } rounded-md focus:outline-none focus:ring-2 ${
                        errors.name ? 'focus:ring-red-200' : 'focus:ring-blue-200'
                    }`}
                    {...register("name", {
                        required: "El nombre de la tarea es obligatorio",
                        minLength: {
                            value: 3,
                            message: "El nombre debe tener al menos 3 caracteres"
                        },
                        maxLength: {
                            value: 50,
                            message: "El nombre no puede exceder 50 caracteres"
                        }
                    })}
                />
                {errors.name && (
                    <ErrorMessage>{errors.name.message}</ErrorMessage>
                )}
            </div>

            <div className="flex flex-col gap-5">
                <label
                    className="font-normal text-2xl"
                    htmlFor="description"
                >Descripción de la tarea</label>
                <textarea
                    id="description"
                    placeholder="Descripción de la tarea"
                    className={`w-full p-3 border ${
                        errors.description ? 'border-red-500 bg-red-50' : 'border-gray-300'
                    } rounded-md focus:outline-none focus:ring-2 ${
                        errors.description ? 'focus:ring-red-200' : 'focus:ring-blue-200'
                    }`}
                    {...register("description", {
                        required: "La descripción de la tarea es obligatoria",
                        minLength: {
                            value: 10,
                            message: "La descripción debe tener al menos 10 caracteres"
                        },
                        maxLength: {
                            value: 200,
                            message: "La descripción no puede exceder 200 caracteres"
                        }
                    })}
                />
                {errors.description && (
                    <ErrorMessage>{errors.description.message}</ErrorMessage>
                )}
            </div>
        </>
    )
}