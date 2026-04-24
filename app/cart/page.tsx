import { CartPage } from "@/module/cart";
import { CartErrorLoaded } from "@/module/cart/cart-error-loaded";
import { CartItem } from "@/module/cart/context/useCart";
import { createClient } from "@/supabase/server"

export const metadata = {
    title: "Carrito | Reserva Salon",
};

type Props = {
    searchParams: Promise<{
        user_auth?: string;
        cart?: string;
        price_delivery?: string;
        type?: 'local' | 'delivery';
    }>
}

export default async function CartRoute({ searchParams }: Props) {

    const params = await searchParams;
    if (params.cart) {

        try { // Pasar todo esto al backend para que se haga el pago desde el servidor y retornar url para PSE y tarjetas
            const { cart, price_delivery, type, user_auth } = params;
            if (!user_auth) {
                console.log('Error al cargar el carrito: No se ha podido verificar tu sesión');
                return <CartErrorLoaded />
            }
            const client = await createClient()
            const user = await client.auth.getUser(user_auth)
            if (!user.data.user) {
                console.log('Error al cargar el carrito: No se ha podido verificar tu sesión');
                return <CartErrorLoaded />
            }
            let cartData: CartItem[] = [];
            let priceDelivery: number = 0;
            let typeDelivery: 'local' | 'delivery' = 'local';
            cartData = cart ? (JSON.parse(cart) as CartItem[]) : [];
            priceDelivery = price_delivery ? Number(decodeURIComponent(price_delivery)) : 0;
            typeDelivery = type ? (type as 'local' | 'delivery') : 'local';
            return <CartPage cartFromUrl={cartData} priceDelivery={priceDelivery} type={typeDelivery} />;
        }
        catch (err) {
            console.error(err);
            return <CartErrorLoaded />
        }
    }

    return <CartPage />;
}

