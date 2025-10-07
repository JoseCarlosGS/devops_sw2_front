
import ProjectForm from "./ProjectForm";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import{useMutation} from "@tanstack/react-query";
import { updateProject } from "@/api/ProjectApi";
import { toast } from "react-toastify";
import { ProjectFormData } from "@/views/CreateProjectView";
import { Project } from "@/types/index";

type EditProjectFormProps = {
   data:ProjectFormData
   projectId: Project['_id']
}

export default function EditProjectForm({ data, projectId }: EditProjectFormProps) {     
        const navigate = useNavigate()
        console.log("data desde editProjectForm", data)
        const {register, handleSubmit, formState: { errors }} = useForm({defaultValues: {
            projectName:data.projectName,
            clientName: data.clientName,
            description: data.description
        }})
        const{mutate}= useMutation({
            mutationFn:updateProject,
            onError:(error)=>{
                toast.error(error.message)
            },
            onSuccess:()=>{toast.success("Proyecto actualizado")
                navigate("/")}
        })
        const handleForm = (formData:ProjectFormData) => {
            const data={    
                formData,
                projectId
            }
            mutate(data)
            console.log("formData:", formData)  ///esto temporal por si hay bugs 
        }   
    return (
        <div className="max-w-3xl mx-auto">
            <h1 className="text-5xl font-black">Editar Proyectos</h1>
            <p className="text-xl font-light text-gray-500 mt-2 mb-6">
                Llena el siguiente formulario para editar el proyecto 
            </p>

            <Link
                to="/projects"
                className="bg-cyan-600 text-white py-2 px-5 rounded-lg inline-block mb-10 font-bold uppercase"
            >
                Volver a Proyectos
            </Link>

            <div className="bg-white shadow-lg rounded-lg p-10">
                <h2 className="text-3xl font-bold mb-4">Editar Proyecto</h2>
                <p className="text-lg mb-6">Completa el formulario para editar el proyecto</p>

                <form className = "mt-10 bg-white shadow-lg p-10 rounded-lg"
                onSubmit={handleSubmit(handleForm)} noValidate>
                    <ProjectForm register={register} errors={errors} />

                    <input
                        type="submit"
                        value="Guardar Cambios"
                        className="bg-cyan-500 hover:bg-cyan-600 w-full p-3 text-white uppercase font-bold cursor-pointer transition-colors rounded-md mt-8"
                    />
                </form>
            </div>
        </div>
    )
}
