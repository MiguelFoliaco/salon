'server-only'
export const CONSTANT = {
    URL_APP: process.env.NODE_ENV === 'development' ? 'http://192.168.80.41:3000' : process.env.WEB_URL,
    TIME_ZONE: -5,
    CLODINARY_CONFIG: {
        FOLDER: 'salon/uploads',
    },
    NAME: 'RESERVAS',
    LOGO: 'https://res.cloudinary.com/dqjicshv9/image/upload/v1775512523/reservas/logo_z8jyov.png',
    API_WEB: process.env.API_WEB || 'http://localhost:3001/api',
    WOMPI_PUBLIC_KEY: process.env.NEXT_PUBLIC_KEY_WOMPI || '',
    WOMPI_INTEGRITY_HASH: process.env.NEXT_PUBLIC_INTEGRITY_HASH || '',
}