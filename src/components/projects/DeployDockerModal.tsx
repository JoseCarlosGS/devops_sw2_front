import { Dialog, Transition } from "@headlessui/react"
import { Fragment } from "react"

type DeployResult = {
  message: string
  projectId: string
  language: string
  framework: string
  database: string | null
  env: string[]
  url: string
}

type DeployDockerModalProps = {
  isOpen: boolean
  onClose: () => void
  result: DeployResult | null
}

export default function DeployDockerModal({ isOpen, onClose, result }: DeployDockerModalProps) {
  if (!result) return null

  return (
    <Transition show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-25" />
        </Transition.Child>

        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 scale-95"
            enterTo="opacity-100 scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-95"
          >
            <Dialog.Panel className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl">
              <Dialog.Title className="text-xl font-bold text-gray-900">
                {result.message}
              </Dialog.Title>

              <div className="mt-4 space-y-2 text-gray-700">
                <p><span className="font-semibold">Proyecto:</span> {result.projectId}</p>
                <p><span className="font-semibold">Lenguaje:</span> {result.language}</p>
                <p><span className="font-semibold">Framework:</span> {result.framework}</p>
                <p><span className="font-semibold">Base de Datos:</span> {result.database ?? "Ninguna"}</p>
                <p><span className="font-semibold">Variables de Entorno:</span> {result.env.length > 0 ? result.env.join(", ") : "Ninguna"}</p>
                <p><span className="font-semibold">URL:</span> <a href={result.url} target="_blank" className="text-cyan-600 underline">{result.url}</a></p>
              </div>

              <div className="mt-6 flex justify-end">
                <button
                  type="button"
                  className="px-4 py-2 bg-cyan-500 text-white font-semibold rounded-lg hover:bg-cyan-600"
                  onClick={onClose}
                >
                  Cerrar
                </button>
              </div>
            </Dialog.Panel>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition>
  )
}
