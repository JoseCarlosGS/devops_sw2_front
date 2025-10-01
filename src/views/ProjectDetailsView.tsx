import { useState } from "react"
import { getProjectById } from "@/api/ProjectApi"
import AddTaskModal from "@/components/AddTaskModal"
import EditTaskData from "@/components/task/EditTaskData"
import TaskList from "@/components/task/TaskList"
import DeployDockerForm from "@/components/projects/DeployDockerForm"
import DeployDockerModal from "@/components/projects/DeployDockerModal"

import { useQuery } from "@tanstack/react-query"
import { Navigate, useParams, useNavigate, useLocation } from "react-router-dom"

export default function ProjectDetailsView() {
  const params = useParams()
  const navigate = useNavigate()
  const location = useLocation()
  const projectId = params.projectId!

  const { data, isLoading, isError } = useQuery({
    queryKey: ["editProject", projectId],
    queryFn: () => getProjectById(projectId),
    retry: false,
  })

  const searchParams = new URLSearchParams(location.search)
  const showDeployDockerForm = searchParams.get("deployDocker")

  // Estado para modal y carga
  const [isModalOpen, setIsModalOpen] = useState(false)
  //const [isDeploying, setIsDeploying] = useState(false)
  const [deployResult, setDeployResult] = useState<any>(null)

  const closeDeployDockerForm = () => {
    searchParams.delete("deployDocker")
    navigate(`${location.pathname}?${searchParams.toString()}`)
  }

  // const handleDeploy = () => {
  //   setIsDeploying(true)
  //   setTimeout(() => {
  //     setIsDeploying(false)
  //     setDeployResult({
  //       message: "Proyecto desplegado correctamente",
  //       projectId: data.projectName,
  //       language: "python",
  //       framework: "fastapi",
  //       database: null,
  //       env: [],
  //       url: "http://localhost:51273",
  //     })
  //     setIsModalOpen(true)
  //   }, 5000) // Simulación de despliegue 5 segundos
  // }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setDeployResult(null)
    closeDeployDockerForm() // 👈 al cerrar modal se limpia también la URL
  }

  if (isLoading) return "Cargando..."
  if (isError) return <Navigate to="/404" />

  if (data)
    return (
      <>
        <h1 className="text-5xl font-black ">{data.projectName}</h1>
        <p className="text-2xl font-light text-gray-500 mt-5">{data.description}</p>

        <nav className="my-5 flex gap-x-3 justify-between">
          {/* Botón Agregar Tarea */}
          <button
            type="button"
            className="bg-cyan-400 hover:bg-cyan-500 px-10 py-3 text-white text-xl font-bold cursor-pointer transition-colors"
            onClick={() => navigate(location.pathname + "?newTask=true")}
          >
            Agregar Tarea
          </button>

          {/* Botón Desplegar Docker */}
          <button
            type="button"
            className="bg-cyan-400 hover:bg-cyan-500 px-10 py-3 text-white text-xl font-bold cursor-pointer transition-colors"
            onClick={() => navigate(location.pathname + "?deployDocker=true")}
          >
            Desplegar Docker
          </button>
        </nav>

        {/* Formulario encima de las tareas */}
        {showDeployDockerForm && (
          <div className="mb-10 p-5 bg-gray-50 border border-gray-200 rounded-xl shadow-sm">
            <DeployDockerForm />

            <div className="mt-6 flex justify-between">
              {/* Cancelar a la izquierda */}
              <button
                type="button"
                className="bg-red-500 hover:bg-red-600 px-6 py-2 text-white font-semibold rounded transition-colors"
                onClick={closeDeployDockerForm}
              >
                Cancelar
              </button>

              {/* Desplegar a la derecha */}
              {/* <button
                type="button"
                className="bg-green-500 hover:bg-green-600 px-6 py-2 text-white font-semibold rounded transition-colors flex items-center gap-2"
                onClick={handleDeploy}
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
                {isDeploying ? "Desplegando..." : "Desplegar"}
              </button> */}
            </div>
          </div>
        )}

        {/* Lista de tareas */}
        <TaskList tasks={data.tasks} />

        <AddTaskModal />
        <EditTaskData />

        {/* Modal de resultado */}
        <DeployDockerModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          result={deployResult}
        />
      </>
    )
}
