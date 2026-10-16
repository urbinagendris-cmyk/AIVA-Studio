export function Header() {
    return (
        <header class="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-gray-200 shadow-sm">
            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div class="flex justify-between items-center h-16">
                    <div class="flex-shrink-0 flex items-center">
                        <a href="#" class="flex items-center gap-2">
                            <svg class="h-8 w-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                            </svg>
                            <span class="font-bold text-xl tracking-tight text-gray-900">NexTech</span>
                        </a>
                    </div>

                    <nav class="hidden md:flex space-x-8">
                        <a href="#inicio" class="text-gray-600 hover:text-blue-600 font-medium transition-colors">Inicio</a>
                        <a href="#productos" class="text-gray-600 hover:text-blue-600 font-medium transition-colors">Productos</a>
                        <a href="#servicios" class="text-gray-600 hover:text-blue-600 font-medium transition-colors">Servicios</a>
                        <a href="#contacto" class="text-gray-600 hover:text-blue-600 font-medium transition-colors">Contacto</a>
                    </nav>
                    <div class="hidden md:flex items-center space-x-4">
                        <button class="text-gray-600 hover:text-gray-900 font-medium">Log in</button>
                        <button class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors shadow-sm">Comprar Ahora</button>
                    </div>

                    <div class="md:hidden flex items-center">
                        <button class="text-gray-600 hover:text-gray-900 focus:outline-none">
                            <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
                            </svg>
                        </button>
                    </div>
                </div>
            </div>
        </header>
    )
}


