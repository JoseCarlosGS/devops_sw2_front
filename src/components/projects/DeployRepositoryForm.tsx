import { useForm } from "react-hook-form";
import { useState } from "react";
import { toast } from "react-toastify";

type DeployRepositoryFormData = {
    repositoryName: string;
    repositoryUrl: string;
    branch: string;
    description?: string;
}

interface DeployRepositoryFormProps {
    onConfirm: (data: DeployRepositoryFormData) => void;
    onCancel: () => void;
}

export default function DeployRepositoryForm({ onConfirm, onCancel }: DeployRepositoryFormProps) {
    const [isDeploying, setIsDeploying] = useState(false);
    
    const { register, handleSubmit, formState: { errors }, watch } = useForm<DeployRepositoryFormData>({
        defaultValues: {
            branch: "main"
        }
    });

    const repositoryUrl = watch("repositoryUrl");

    const onSubmit = async (data: DeployRepositoryFormData) => {
        try {
            setIsDeploying(true);
            
            // Validar que la URL sea válida
            try {
                new URL(data.repositoryUrl);
            } catch {
                toast.error("La URL del repositorio no es válida");
                setIsDeploying(false);
                return;
            }

            // Simular proceso de despliegue
            await new Promise(resolve => setTimeout(resolve, 2000));
            
            toast.success(`🚀 Repositorio "${data.repositoryName}" desplegado correctamente`);
            onConfirm(data);
        } catch (error) {
            toast.error("Error al desplegar el repositorio");
        } finally {
            setIsDeploying(false);
        }
    };

    return (
        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
            <h3 className="text-2xl font-bold mb-6 text-gray-800 flex items-center gap-2">
                <svg className="w-6 h-6 text-cyan-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                </svg>
                Configuración de Despliegue de Repositorio
            </h3>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Nombre del Repositorio */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Nombre del Repositorio *
                        </label>
                        <input
                            type="text"
                            {...register("repositoryName", { 
                                required: "El nombre del repositorio es obligatorio",
                                minLength: {
                                    value: 2,
                                    message: "El nombre debe tener al menos 2 caracteres"
                                }
                            })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                            placeholder="mi-proyecto-web"
                        />
                        {errors.repositoryName && (
                            <p className="text-red-500 text-sm mt-1">{errors.repositoryName.message}</p>
                        )}
                    </div>

                    {/* Rama */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Rama *
                        </label>
                        <input
                            type="text"
                            {...register("branch", { 
                                required: "La rama es obligatoria" 
                            })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                            placeholder="main"
                        />
                        {errors.branch && (
                            <p className="text-red-500 text-sm mt-1">{errors.branch.message}</p>
                        )}
                    </div>
                </div>

                {/* URL del Repositorio */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        URL del Repositorio *
                    </label>
                    <input
                        type="url"
                        {...register("repositoryUrl", { 
                            required: "La URL del repositorio es obligatoria",
                            pattern: {
                                value: /^https?:\/\/.+/,
                                message: "Debe ser una URL válida (http:// o https://)"
                            }
                        })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                        placeholder="https://github.com/usuario/repositorio.git"
                    />
                    {errors.repositoryUrl && (
                        <p className="text-red-500 text-sm mt-1">{errors.repositoryUrl.message}</p>
                    )}
                </div>

                {/* Descripción (Opcional) */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Descripción (Opcional)
                    </label>
                    <textarea
                        {...register("description")}
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                        placeholder="Descripción del proyecto o notas adicionales..."
                    />
                </div>

                {/* Preview de la URL */}
                {repositoryUrl && (
                    <div className="bg-gray-50 p-4 rounded-md border">
                        <p className="text-sm text-gray-600 mb-2">Vista previa de despliegue:</p>
                        <p className="text-sm font-mono text-cyan-600 break-all">{repositoryUrl}</p>
                    </div>
                )}

                {/* Botones de Acción */}
                <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t">
                    <button
                        type="button"
                        onClick={onCancel}
                        className="bg-gray-500 hover:bg-gray-600 px-6 py-2 text-white font-semibold rounded transition-colors"
                        disabled={isDeploying}
                    >
                        Cancelar
                    </button>
                    
                    <button
                        type="submit"
                        className="bg-green-500 hover:bg-green-600 px-6 py-2 text-white font-semibold rounded transition-colors flex items-center justify-center gap-2 flex-1 sm:flex-none"
                        disabled={isDeploying}
                    >
                        {isDeploying && (
                            <svg
                                className="animate-spin h-5 w-5 text-white"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                            >
                                <circle
                                    className="opacity-25"
                                    cx="12"
                                    cy="12"
                                    r="10"
                                    stroke="currentColor"
                                    strokeWidth="4"
                                />
                                <path
                                    className="opacity-75"
                                    fill="currentColor"
                                    d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 00-8 8h4z"
                                />
                            </svg>
                        )}
                        {isDeploying ? "Desplegando..." : "Confirmar Despliegue"}
                    </button>
                </div>
            </form>
        </div>
    );
}
