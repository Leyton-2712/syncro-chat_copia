
export function HomePage() {

    return (
        <main>
            <section className="hero max-w-4xl mx-auto px-4 text-center py-16">
                <h1 className="text-5xl sm:text-6xl font-bold mb-4">Syncro Chat</h1>
                <p className="text-lg sm:text-lg text-gray-600 max-w-3xl mx-auto mt-16">
                    Comunicación en tiempo real para equipos. Mensajería segura, grupos y
                    notificaciones instantáneas para mantener a tu empresa conectada.
                </p>
            </section>

            {/* Características */}
            <section className="max-w-7xl mx-auto px-4 py-12">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Tarjeta 1 - Autenticación con Google */}
                    <article className="bg-white border border-gray-100 rounded-lg p-6 shadow-sm transform transition-all duration-300 ease-out hover:shadow-xl hover:-translate-y-1 hover:scale-[1.02] group">
                        <div className="flex items-start gap-4">
                            <div className="shrink-0 w-12 h-12 rounded-full bg-[#1a1a1a] flex items-center justify-center">
                                {/* Google icon simplified (G) */}
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
                                    <path d="M21.35 11.1H12v2.8h5.35c-.23 1.45-1.33 2.68-2.83 3.36v2.8c2.2-1.06 3.92-3 4.66-5.66.03-.18.05-.36.05-.54 0-.18-.02-.36-.03-.54z" fill="#fff" />
                                    <path d="M12 22c2.43 0 4.47-.8 5.96-2.17l-2.86-2.21C14.6 18 13.36 18.5 12 18.5c-2.4 0-4.43-1.62-5.15-3.8H3.82v2.39C5.27 20.7 8.38 22 12 22z" fill="#fff" />
                                    <path d="M6.85 13.7A6.99 6.99 0 0 1 6 12c0-.67.12-1.31.35-1.9V7.7H3.82A10 10 0 0 0 2 12c0 1.5.32 2.92.9 4.2l3.95-2.5z" fill="#fff" />
                                    <path d="M12 5.5c1.3 0 2.48.44 3.42 1.3l2.57-2.56C16.43 2.86 14.43 2 12 2 8.38 2 5.27 3.3 3.82 5.91L6.85 8c.72-2.18 2.75-3.5 5.15-3.5z" fill="#fff" />
                                </svg>
                            </div>
                            <div className="text-left">
                                <h3 className="text-xl font-semibold text-[#1a1a1a]">Autenticación con Google</h3>
                                <p className="mt-2 text-gray-600">Inicio de sesión seguro y rápido usando la cuenta de Google de la empresa. Simplifica la gestión de accesos y permite control centralizado de usuarios.</p>
                            </div>
                        </div>
                    </article>

                    {/* Tarjeta 2 - Notificación de actividad */}
                    <article className="bg-white border border-gray-100 rounded-lg p-6 shadow-sm transform transition-all duration-300 ease-out hover:shadow-xl hover:-translate-y-1 hover:scale-[1.02] group">
                        <div className="flex items-start gap-4">
                            <div className="shrink-0 w-12 h-12 rounded-full bg-[#1a1a1a] flex items-center justify-center">
                                {/* Bell icon */}
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
                                    <path d="M12 22a2.5 2.5 0 0 0 2.5-2.5h-5A2.5 2.5 0 0 0 12 22z" fill="#fff" />
                                    <path d="M18 16v-5c0-3.07-1.63-5.64-4.5-6.32V4a1.5 1.5 0 1 0-3 0v.68C7.63 5.36 6 7.92 6 11v5l-1.99 2H20L18 16z" fill="#fff" />
                                </svg>
                            </div>
                            <div className="text-left">
                                <h3 className="text-xl font-semibold text-[#1a1a1a]">Notificación de actividad</h3>
                                <p className="mt-2 text-gray-600">Recibe alertas instantáneas cuando hay nuevos mensajes, usuarios entran o salen, o cuando se asignan tareas importantes. Mantén a tu equipo siempre informado.</p>
                            </div>
                        </div>
                    </article>

                    {/* Tarjeta 3 - Mensajería en tiempo real */}
                    <article className="bg-white border border-gray-100 rounded-lg p-6 shadow-sm transform transition-all duration-300 ease-out hover:shadow-xl hover:-translate-y-1 hover:scale-[1.02] group">
                        <div className="flex items-start gap-4">
                            <div className="shrink-0 w-12 h-12 rounded-full bg-[#1a1a1a] flex items-center justify-center">
                                {/* Chat icon */}
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
                                    <path d="M21 6a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h3v3l4-3h7a2 2 0 0 0 2-2V6z" fill="#fff" />
                                </svg>
                            </div>
                            <div className="text-left">
                                <h3 className="text-xl font-semibold text-[#1a1a1a]">Mensajería en tiempo real</h3>
                                <p className="mt-2 text-gray-600">Chat instantáneo con entrega fiable de mensajes, indicadores de escritura y presencia. Ideal para comunicación entre equipos, resolución rápida de dudas y coordinación de tareas.</p>
                            </div>
                        </div>
                    </article>
                </div>
            </section>
        </main>
    )
}