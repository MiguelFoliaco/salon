import { BiMapPin, BiPhone, BiEnvelope, BiGlobe } from "react-icons/bi";
import { BsScissors, BsFacebook, BsInstagram, BsTwitter } from "react-icons/bs";
import Link from "next/link";


export function Footer() {
  return (
    <footer className="bg-base-100">
      {/* VIP Newsletter Section */}
      <div className="bg-neutral mx-4 lg:mx-auto max-w-7xl rounded-2xl my-8">
        <div className="px-6 py-10 lg:px-12 lg:py-12">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div className="max-w-md">
              <h3 className="text-2xl font-bold text-white mb-2">
                Unete a nuestra lista VIP para ofertas exclusivas
              </h3>
              <p className="text-white/70 text-sm">
                Suscribete para obtener acceso anticipado a reservas y 15% de descuento en tu primera visita.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
              <input 
                type="email" 
                placeholder="Ingresa tu email" 
                className="input input-bordered bg-neutral-focus/50 border-white/20 text-white placeholder:text-white/50 w-full sm:w-72"
              />
              <button className="btn btn-outline border-primary text-primary hover:bg-primary hover:text-primary-content hover:border-primary">
                Suscribirse
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer */}
      <div className="border-t border-base-200">
        <div className="mx-auto max-w-7xl px-4 lg:px-6 py-12">
          <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4">
            {/* Brand */}
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-2.5">
                <div className="flex items-center justify-center rounded-lg bg-primary p-2">
                  <BsScissors className="size-5 text-primary-content" />
                </div>
                <span className="text-lg font-bold tracking-tight">
                  GLOW SALON
                </span>
              </div>
              <p className="text-sm leading-relaxed text-base-content/60">
                Redefiniendo los estandares de belleza con artistas expertos y cuidado premium. Visitanos para una experiencia inolvidable.
              </p>
              {/* Social Icons */}
              <div className="flex gap-3 mt-2">
                <a href="#" className="w-9 h-9 rounded-full border border-base-300 flex items-center justify-center text-base-content/60 hover:text-primary hover:border-primary transition-colors">
                  <BiGlobe className="size-4" />
                </a>
                <a href="#" className="w-9 h-9 rounded-full border border-base-300 flex items-center justify-center text-base-content/60 hover:text-primary hover:border-primary transition-colors">
                  <BsFacebook className="size-4" />
                </a>
                <a href="#" className="w-9 h-9 rounded-full border border-base-300 flex items-center justify-center text-base-content/60 hover:text-primary hover:border-primary transition-colors">
                  <BsInstagram className="size-4" />
                </a>
              </div>
            </div>

            {/* Hours */}
            <div className="flex flex-col gap-4">
              <h4 className="text-sm font-bold tracking-wider">
                Horario de Atencion
              </h4>
              <ul className="flex flex-col gap-3 text-sm">
                <li className="flex justify-between">
                  <span className="text-base-content/60">Lun - Vie</span>
                  <span className="font-medium">9:00 AM - 8:00 PM</span>
                </li>
                <li className="flex justify-between">
                  <span className="text-base-content/60">Sabados</span>
                  <span className="font-medium">10:00 AM - 6:00 PM</span>
                </li>
                <li className="flex justify-between">
                  <span className="text-base-content/60">Domingos</span>
                  <span className="font-medium text-error">Cerrado</span>
                </li>
              </ul>
            </div>

            {/* Quick Links */}
            <div className="flex flex-col gap-4">
              <h4 className="text-sm font-bold tracking-wider">
                Explorar
              </h4>
              <ul className="flex flex-col gap-2.5 text-sm text-base-content/60">
                <li>
                  <Link href="/search" className="transition-colors hover:text-primary">
                    Nuestros Estilistas
                  </Link>
                </li>
                <li>
                  <Link href="/search" className="transition-colors hover:text-primary">
                    Paquetes Especiales
                  </Link>
                </li>
                <li>
                  <Link href="/search" className="transition-colors hover:text-primary">
                    Tarjetas de Regalo
                  </Link>
                </li>
                <li>
                  <Link href="/search" className="transition-colors hover:text-primary">
                    Contactanos
                  </Link>
                </li>
              </ul>
            </div>

            {/* Contact */}
            <div className="flex flex-col gap-4">
              <h4 className="text-sm font-bold tracking-wider">
                Encuentranos
              </h4>
              <ul className="flex flex-col gap-3 text-sm text-base-content/60">
                <li className="flex items-start gap-3">
                  <BiMapPin className="size-5 shrink-0 text-primary mt-0.5" />
                  <span>Calle 80 #45-12, Zona Norte,<br />Bogota, Colombia</span>
                </li>
                <li className="flex items-center gap-3">
                  <BiPhone className="size-5 shrink-0 text-primary" />
                  <span>+57 (300) 123-4567</span>
                </li>
                <li className="flex items-center gap-3">
                  <BiEnvelope className="size-5 shrink-0 text-primary" />
                  <span>hola@glowsalon.co</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom bar */}
          <div className="mt-12 flex flex-col items-center gap-3 border-t border-base-200 pt-6 sm:flex-row sm:justify-between">
            <p className="text-xs text-base-content/50">
              &copy; {new Date().getFullYear()} Glow Salon & Beauty. Todos los derechos reservados.
            </p>
            <div className="flex gap-6 text-xs text-base-content/50">
              <a href="#" className="transition-colors hover:text-primary">
                Politica de Privacidad
              </a>
              <a href="#" className="transition-colors hover:text-primary">
                Terminos de Servicio
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
