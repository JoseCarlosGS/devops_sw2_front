import { Fragment } from 'react'
import { Popover, Transition } from '@headlessui/react'
import { Bars3Icon, UserIcon, FolderIcon, ArrowRightOnRectangleIcon } from '@heroicons/react/20/solid'
import { Link } from 'react-router-dom'

export default function NavMenu() {

  return (
    <Popover className="relative">
      <Popover.Button className="inline-flex items-center gap-x-1 text-sm font-semibold leading-6 p-1 rounded-lg bg-cyan-400">
        <Bars3Icon className='w-8 h-8 text-white ' />
      </Popover.Button>

      <Transition
        as={Fragment}
        enter="transition ease-out duration-200"
        enterFrom="opacity-0 translate-y-1"
        enterTo="opacity-100 translate-y-0"
        leave="transition ease-in duration-150"
        leaveFrom="opacity-100 translate-y-0"
        leaveTo="opacity-0 translate-y-1"
      >
        <Popover.Panel className="absolute left-1/2 z-10 mt-5 flex w-screen lg:max-w-min -translate-x-1/2 lg:-translate-x-48">
          <div className="w-full lg:w-64 shrink rounded-xl bg-white p-4 text-sm font-semibold leading-6 text-gray-900 shadow-lg ring-1 ring-gray-900/5">
            <div className='text-center pb-3 mb-3 border-b border-gray-200'>
              <p className='text-gray-600 font-medium'>Hola, Usuario</p>
            </div>
            <div className="space-y-1">
              <Link
                to='/profile'
                className='flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors'
              >
                <UserIcon className="h-5 w-5 text-gray-500" />
                Mi Perfil
              </Link>
              <Link
                to='/'
                className='flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors'
              >
                <FolderIcon className="h-5 w-5 text-gray-500" />
                Mis Proyectos
              </Link>
              <button
                className='flex items-center gap-3 p-3 rounded-lg hover:bg-red-50 hover:text-red-600 transition-colors w-full text-left'
                type='button'
                onClick={() => {
                  if (window.confirm("¿Estás seguro de que quieres cerrar sesión?")) {
                    // Aquí iría la lógica de logout
                    console.log("Cerrando sesión...");
                  }
                }}
              >
                <ArrowRightOnRectangleIcon className="h-5 w-5" />
                Cerrar Sesión
              </button>
            </div>
          </div>
        </Popover.Panel>
      </Transition>
    </Popover>
  )

}