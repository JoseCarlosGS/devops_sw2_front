import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeftIcon } from "@heroicons/react/20/solid";

type EditProfileFormData = {
    name: string;
    email: string;
    currentPassword: string;
    newPassword: string;
    confirmPassword: string;
}

export default function EditProfileView() {
    const navigate = useNavigate();
    const { register, handleSubmit, watch, formState: { errors } } = useForm<EditProfileFormData>({
        defaultValues: {
            name: "Usuario Ejemplo", // This would come from API/context
            email: "usuario@ejemplo.com" // This would come from API/context
        }
    });

    const newPassword = watch("newPassword");

    const onSubmit = (data: EditProfileFormData) => {
        try {
            console.log("Updating profile with data:", data);
            toast.success('Perfil actualizado correctamente');
            navigate('/profile');
        } catch (error) {
            toast.error('Error al actualizar el perfil');
        }
    };

    return (
        <div className="container max-w-3xl mx-auto mt-10">
            {/* Header with back button */}
            <div className="flex items-center gap-4 mb-10">
                <Link 
                    to="/profile"
                    className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors"
                >
                    <ArrowLeftIcon className="h-5 w-5" />
                    Volver al Perfil
                </Link>
            </div>

            <h1 className="text-4xl font-black mb-10">Editar Perfil</h1>

            <div className="bg-white shadow-lg rounded-lg p-10">
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    {/* Personal Information Section */}
                    <div className="border-b pb-6">
                        <h3 className="text-2xl font-bold mb-6 text-gray-800">Información Personal</h3>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="text-lg font-medium block mb-2 text-gray-700">
                                    Nombre Completo
                                </label>
                                <input
                                    type="text"
                                    {...register("name", { 
                                        required: "El nombre es obligatorio",
                                        minLength: {
                                            value: 2,
                                            message: "El nombre debe tener al menos 2 caracteres"
                                        }
                                    })}
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                                    placeholder="Ingresa tu nombre completo"
                                />
                                {errors.name && (
                                    <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
                                )}
                            </div>

                            <div>
                                <label className="text-lg font-medium block mb-2 text-gray-700">
                                    Correo Electrónico
                                </label>
                                <input
                                    type="email"
                                    {...register("email", {
                                        required: "El email es obligatorio",
                                        pattern: {
                                            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                            message: "Formato de email inválido"
                                        }
                                    })}
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                                    placeholder="tu@email.com"
                                />
                                {errors.email && (
                                    <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Password Change Section */}
                    <div className="pt-6">
                        <h3 className="text-2xl font-bold mb-6 text-gray-800">Cambiar Contraseña</h3>
                        <p className="text-gray-600 mb-6">Deja estos campos vacíos si no deseas cambiar tu contraseña</p>
                        
                        <div className="space-y-6">
                            <div>
                                <label className="text-lg font-medium block mb-2 text-gray-700">
                                    Contraseña Actual
                                </label>
                                <input
                                    type="password"
                                    {...register("currentPassword")}
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                                    placeholder="Ingresa tu contraseña actual"
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="text-lg font-medium block mb-2 text-gray-700">
                                        Nueva Contraseña
                                    </label>
                                    <input
                                        type="password"
                                        {...register("newPassword", {
                                            minLength: {
                                                value: 6,
                                                message: "La contraseña debe tener al menos 6 caracteres"
                                            }
                                        })}
                                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                                        placeholder="Nueva contraseña"
                                    />
                                    {errors.newPassword && (
                                        <p className="text-red-500 text-sm mt-1">{errors.newPassword.message}</p>
                                    )}
                                </div>

                                <div>
                                    <label className="text-lg font-medium block mb-2 text-gray-700">
                                        Confirmar Nueva Contraseña
                                    </label>
                                    <input
                                        type="password"
                                        {...register("confirmPassword", {
                                            validate: (value) => {
                                                if (newPassword && !value) {
                                                    return "Confirma tu nueva contraseña";
                                                }
                                                if (newPassword && value !== newPassword) {
                                                    return "Las contraseñas no coinciden";
                                                }
                                                return true;
                                            }
                                        })}
                                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                                        placeholder="Confirma tu nueva contraseña"
                                    />
                                    {errors.confirmPassword && (
                                        <p className="text-red-500 text-sm mt-1">{errors.confirmPassword.message}</p>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t">
                        <button
                            type="submit"
                            className="bg-cyan-600 text-white py-3 px-8 rounded-lg font-bold hover:bg-cyan-700 transition-colors flex-1 sm:flex-none"
                        >
                            Guardar Cambios
                        </button>
                        <Link
                            to="/profile"
                            className="bg-gray-200 text-gray-800 py-3 px-8 rounded-lg font-bold hover:bg-gray-300 transition-colors text-center flex-1 sm:flex-none"
                        >
                            Cancelar
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    );
}
