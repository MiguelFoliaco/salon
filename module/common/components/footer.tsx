import { BiMapPin, BiPhone } from "react-icons/bi";
import { BsScissors } from "react-icons/bs";
import { CgLock } from "react-icons/cg";
import { RiMvAiLine } from "react-icons/ri";


export function Footer() {
  return (
    <footer className="border-t border-border bg-card">
      <div className="mx-auto max-w-6xl px-6 py-12">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center rounded-lg bg-primary p-2">
                <BsScissors className="size-5 text-primary-foreground" />
              </div>
              <span className="text-lg font-bold tracking-tight text-card-foreground">
                BarberShop
              </span>
            </div>
            <p className="text-sm leading-relaxed text-muted-foreground">
              Tu destino para cortes de cabello de primera, afeitados clasicos y productos premium de cuidado masculino.
            </p>
          </div>

          {/* Hours */}
          <div className="flex flex-col gap-4">
            <h4 className="text-sm font-bold uppercase tracking-wider text-card-foreground">
              Horario
            </h4>
            <ul className="flex flex-col gap-2.5 text-sm text-muted-foreground">
              <li className="flex items-center gap-2">
                <CgLock className="size-4 shrink-0 text-primary" />
                <span>Lun - Vie: 9:00 AM - 8:00 PM</span>
              </li>
              <li className="flex items-center gap-2">
                <CgLock className="size-4 shrink-0 text-primary" />
                <span>Sabados: 9:00 AM - 6:00 PM</span>
              </li>
              <li className="flex items-center gap-2">
                <CgLock className="size-4 shrink-0 text-primary" />
                <span>Domingos: Cerrado</span>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div className="flex flex-col gap-4">
            <h4 className="text-sm font-bold uppercase tracking-wider text-card-foreground">
              Contacto
            </h4>
            <ul className="flex flex-col gap-2.5 text-sm text-muted-foreground">
              <li className="flex items-center gap-2">
                <BiMapPin className="size-4 shrink-0 text-primary" />
                <span>Calle 80 #45-12, Bogota</span>
              </li>
              <li className="flex items-center gap-2">
                <BiPhone className="size-4 shrink-0 text-primary" />
                <span>+57 301 234 5678</span>
              </li>
              <li className="flex items-center gap-2">
                <RiMvAiLine className="size-4 shrink-0 text-primary" />
                <span>info@barbershop.co</span>
              </li>
            </ul>
          </div>

          {/* Quick links */}
          <div className="flex flex-col gap-4">
            <h4 className="text-sm font-bold uppercase tracking-wider text-card-foreground">
              Enlaces
            </h4>
            <ul className="flex flex-col gap-2.5 text-sm text-muted-foreground">
              <li>
                <a href="#" className="transition-colors hover:text-primary">
                  Productos
                </a>
              </li>
              <li>
                <a href="#" className="transition-colors hover:text-primary">
                  Servicios
                </a>
              </li>
              <li>
                <a href="#" className="transition-colors hover:text-primary">
                  Reservar Cita
                </a>
              </li>
              <li>
                <a href="#" className="transition-colors hover:text-primary">
                  Nosotros
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-10 flex flex-col items-center gap-3 border-t border-border pt-6 sm:flex-row sm:justify-between">
          <p className="text-xs text-muted-foreground">
            &copy; {new Date().getFullYear()} BarberShop. Todos los derechos reservados.
          </p>
          <div className="flex gap-4 text-xs text-muted-foreground">
            <a href="#" className="transition-colors hover:text-primary">
              Politica de privacidad
            </a>
            <a href="#" className="transition-colors hover:text-primary">
              Terminos y condiciones
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
