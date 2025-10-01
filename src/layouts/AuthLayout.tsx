import { Outlet } from "react-router";

export default function AuthLayout() {
    return (
        <div className="flex flex-col justify-center h-screen bg-gray-100">
            <div className="w-full max-w-md mx-auto bg-white shadow-md rounded-lg p-8">
                <h1 className="text-3xl font-bold text-center mb-6">Iniciar Sesión</h1>
                <Outlet/>
            </div>
        </div>
    )
}