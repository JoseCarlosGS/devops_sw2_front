import { UseFormRegister, FieldErrors } from "react-hook-form";
import { ProjectFormData } from "../../views/CreateProjectView";

type ProjectFormProps = {
    register: UseFormRegister<ProjectFormData>;
    errors: FieldErrors<ProjectFormData>;
};

export default function ProjectForm({ errors, register }: ProjectFormProps) {
    return (
        <>
            <div className="mb-5">
                <label className="text-gray-700 uppercase font-bold text-sm" htmlFor="projectName">
                    Nombre del Proyecto
                </label>
                <input
                    id="projectName"
                    type="text"
                    className="border w-full p-2 mt-2 placeholder-gray-400 rounded-md"
                    placeholder="Nombre del proyecto"
                    {...register("projectName", { required: "El Titulo del proyecto es obligatorio" })}
                />
                {errors.projectName && <p className="text-red-600 text-sm mt-1">{errors.projectName.message}</p>}
            </div>

            <div className="mb-5">
                <label className="text-gray-700 uppercase font-bold text-sm" htmlFor="clientName">
                    Nombre del Cliente
                </label>
                <input
                    id="clientName"
                    type="text"
                    className="border w-full p-2 mt-2 placeholder-gray-400 rounded-md"
                    placeholder="Nombre del cliente"
                    {...register("clientName", { required: "El nombre del cliente es obligatorio" })}
                />
                {errors.clientName && <p className="text-red-600 text-sm mt-1">{errors.clientName.message}</p>}
            </div>

            <div className="mb-5">
                <label className="text-gray-700 uppercase font-bold text-sm" htmlFor="description">
                    Descripción
                </label>
                <textarea
                    id="description"
                    className="border w-full p-2 mt-2 placeholder-gray-400 rounded-md"
                    placeholder="Descripción del proyecto"
                    rows={4}
                    {...register("description", { required: "La descripción es obligatoria" })}
                />
                {errors.description && <p className="text-red-600 text-sm mt-1">{errors.description.message}</p>}
            </div>
        </>
    );
}