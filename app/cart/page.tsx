import { CartPage } from "@/module/cart";
import { CartErrorLoaded } from "@/module/cart/cart-error-loaded";
import { CartItem } from "@/module/cart/context/useCart";
import { createClient } from "@/supabase/server"
import { headers } from "next/headers";


export const metadata = {
    title: "Carrito | Reserva Salon",
};

type Props = {
    searchParams: Promise<{
        user_auth?: string;
        refresh_token?: string;
        // cart?: string;
        price_delivery?: string;
        type?: 'local' | 'delivery';
    }>
}

export default async function CartRoute({ searchParams }: Props) {

    const params = await searchParams;

    if (params.user_auth && params.refresh_token) {

        try { // Pasar todo esto al backend para que se haga el pago desde el servidor y retornar url para PSE y tarjetas
            const { price_delivery, type, user_auth, refresh_token } = params;
            if (!user_auth || !refresh_token) {
                console.log('Error al cargar el carrito: No se ha podido verificar tu sesión');
                return <CartErrorLoaded />
            }
            const client = await createClient()

            const user = await client.auth.setSession({
                access_token: user_auth,
                refresh_token: refresh_token
            });

            await fetch(`http://localhost:3000/api/set-session`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ user_auth, refresh_token })
            });


            if (!user.data.user) {
                console.log('Error al cargar el carrito: No se ha podido verificar tu sesión');
                return <CartErrorLoaded />
            }

            let priceDelivery: number = 0;
            let typeDelivery: 'local' | 'delivery' = 'local';
            priceDelivery = price_delivery ? Number(decodeURIComponent(price_delivery)) : 0;
            typeDelivery = type ? (type as 'local' | 'delivery') : 'local';
            return <CartPage priceDelivery={priceDelivery} type={typeDelivery} token={user_auth} />;
        }
        catch (err) {
            console.error(err);
            return <CartErrorLoaded />
        }
    }

    return <CartPage />;
}

