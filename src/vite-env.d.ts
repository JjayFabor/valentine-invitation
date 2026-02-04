/// <reference types="vite/client" />

interface ImportMetaEnv {
    readonly VITE_EMAILJS_SERVICE_ID: string
    readonly VITE_EMAILJS_TEMPLATE_ID: string
    readonly VITE_EMAILJS_PUBLIC_KEY: string
    readonly VITE_YOUR_EMAIL: string
    readonly VITE_GIRLFRIEND_EMAIL: string
    readonly VITE_ZOOM_LINK: string
}

interface ImportMeta {
    readonly env: ImportMetaEnv
}
