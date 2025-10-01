import { useForm } from "react-hook-form";
import ProjectForm from "../components/projects/ProjectForm";
import { Link, useNavigate } from "react-router-dom";
import { createProject } from "@/api/ProjectApi";
import { toast } from "react-toastify"
import { useMutation } from "@tanstack/react-query"

///vista para crear los proyectos 

export type ProjectFormData = {
    projectName: string;
    clientName: string;
    description: string;
};

export default function CreateProjectView() {
    const navigate = useNavigate();

    const initialValues: ProjectFormData = {
        projectName: "",
        clientName: "",
        description: ""
    };
    ///inferencia no tipada
    const {
        register,
        handleSubmit,
        formState: { errors }
    } = useForm<ProjectFormData>({
        defaultValues: initialValues
    });
    const { mutate } = useMutation({
        mutationFn: createProject,
        onError: (error) => {
            toast.error(error.message)
            console.log("desde onError")
        },
        onSuccess: (data) => {
            toast.success(data)
            navigate("/")
            console.log("desde onSuccess")
        }
    });

    const handleForm = async (formData: ProjectFormData) => {
        mutate(formData)
    }
    return (
        <div className="max-w-3xl mx-auto">
            <h1 className="text-5xl font-black">Crear Proyectos</h1>
            <p className="text-xl font-light text-gray-500 mt-2 mb-6">
                Llena el siguiente formulario para crear un proyecto:
            </p>

            <Link
                to="/proyectos"
                className="bg-cyan-600 text-white py-2 px-5 rounded-lg inline-block mb-10 font-bold uppercase"
            >
                Volver a Proyectos
            </Link>

            <div className="bg-white shadow-lg rounded-lg p-10">
                <h2 className="text-3xl font-bold mb-4">Nuevo Proyecto</h2>
                <p className="text-lg mb-6">Completa el formulario para crear un nuevo proyecto</p>

                <form onSubmit={handleSubmit(handleForm)} noValidate>
                    <ProjectForm register={register} errors={errors} />
                    <input
                        type="submit"
                        value="CREAR PROYECTO"
                        className="bg-cyan-500 hover:bg-cyan-600 w-full p-3 text-white uppercase font-bold cursor-pointer transition-colors rounded-md mt-8"
                    />
                </form>
            </div>
        </div>
    );
}
