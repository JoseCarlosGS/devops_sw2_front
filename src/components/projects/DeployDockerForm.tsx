import { useState } from "react"
import DeployDockerModal from "./DeployDockerModal"
import {  deployProject } from "@/api/DeployApi"

export default function DeployDockerForm() {
  const [name, setName] = useState("")
  const [repoUrl, setRepoUrl] = useState("")
  const [language, setLanguage] = useState("python")
  const [framework, setFramework] = useState("fastapi")
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [deployResult, setDeployResult] = useState<any>(null)
  const [isDeploying, setIsDeploying] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      // const res = await fetch("/api/deploy", {
      //   method: "POST",
      //   headers: { "Content-Type": "application/json" },
      //   body: JSON.stringify({ name, repoUrl, language, framework }),
      // })

      setIsDeploying(true);

      const res = await deployProject({ name, repoUrl, language, framework })
      
      const data = res
      
      console.log(data)
      setIsDeploying(false)
      setDeployResult(data)
      setIsModalOpen(true)
    } catch (error) {
      console.error("Error al desplegar:", error)
    }
  }

  return (
    <>
      <form onSubmit={handleSubmit} className="space-y-5 bg-white shadow-md rounded-xl p-6">
        <h2 className="text-2xl font-bold text-gray-800">Desplegar en Docker</h2>

        <div>
          <label className="block text-sm font-medium text-gray-700">Nombre del Proyecto</label>
          <input
            type="text"
            value={name}
            onChange={e => setName(e.target.value)}
            className="w-full mt-1 p-2 border rounded-md"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Repositorio Git</label>
          <input
            type="url"
            value={repoUrl}
            onChange={e => setRepoUrl(e.target.value)}
            className="w-full mt-1 p-2 border rounded-md"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Lenguaje</label>
          <select
            value={language}
            onChange={e => setLanguage(e.target.value)}
            className="w-full mt-1 p-2 border rounded-md"
          >
            <option value="python">Python</option>
            <option value="node">Node</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Framework</label>
          <select
            value={framework}
            onChange={e => setFramework(e.target.value)}
            className="w-full mt-1 p-2 border rounded-md"
          >
            <option value="fastapi">FastAPI</option>
            <option value="flask">Flask</option>
            <option value="django">Django</option>
            <option value="express">Express</option>
          </select>
        </div>

        <button
          type="submit"
          className="w-full py-2 px-4 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 transition flex items-center justify-center"
          disabled={isDeploying}
        >
          {isDeploying ? (
            <span className="flex items-center gap-2">
              <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24">
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
            fill="none"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
          />
              </svg>
              Desplegando...
            </span>
          ) : (
            "Desplegar"
          )}
        </button>
      </form>

      <DeployDockerModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        result={deployResult}
      />
    </>
  )
  
}
