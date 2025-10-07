import { useForm } from "react-hook-form";
import { toast } from "react-toastify";

type ProfileFormData = {
    name: string;
    email: string;
    currentPassword: string;
    newPassword: string;
}

export default function ProfileView() {
    const { register, handleSubmit, formState: { errors } } = useForm<ProfileFormData>();

    const onSubmit = (data: ProfileFormData) => {
        try {
            console.log(data);
            toast.success('Perfil actualizado correctamente');
        } catch (error) {
            toast.error('Error al actualizar el perfil');
        }
    };

    return (
        <div className="container max-w-3xl mx-auto mt-10">
            <h1 className="text-4xl font-black mb-10">Mi Perfil</h1>

            <div className="bg-white shadow-lg rounded-lg p-10">
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    <div>
                        <label className="text-xl block mb-2">Nombre</label>
                        <input
                            type="text"
                            {...register("name", { required: "El nombre es obligatorio" })}
                            className="w-full p-3 border border-gray-300 rounded-lg"
                        />
                        {errors.name && (
                            <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
                        )}
                    </div>

                    <div>
                        <label className="text-xl block mb-2">Email</label>
                        <input
                            type="email"
                            {...register("email", {
                                required: "El email es obligatorio",
                                pattern: {
                                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                    message: "Email inválido"
                                }
                            })}
                            className="w-full p-3 border border-gray-300 rounded-lg"
                        />
                        {errors.email && (
                            <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
                        )}
                    </div>

                    <div className="border-t pt-6 mt-6">
                        <h3 className="text-2xl font-bold mb-4">Cambiar Contraseña</h3>
                        
                        <div className="space-y-6">
                            <div>
                                <label className="text-xl block mb-2">Contraseña Actual</label>
                                <input
                                    type="password"
                                    {...register("currentPassword")}
                                    className="w-full p-3 border border-gray-300 rounded-lg"
                                />
                            </div>

                            <div>
                                <label className="text-xl block mb-2">Nueva Contraseña</label>
                                <input
                                    type="password"
                                    {...register("newPassword", {
                                        minLength: {
                                            value: 6,
                                            message: "La contraseña debe tener al menos 6 caracteres"
                                        }
                                    })}
                                    className="w-full p-3 border border-gray-300 rounded-lg"
                                />
                                {errors.newPassword && (
                                    <p className="text-red-500 text-sm mt-1">{errors.newPassword.message}</p>
                                )}
                            </div>
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="bg-cyan-600 text-white py-3 px-6 rounded-lg font-bold hover:bg-cyan-700 transition-colors w-full"
                    >
                        Guardar Cambios
                    </button>
                </form>
            </div>
        </div>
    );
}
