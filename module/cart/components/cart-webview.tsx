import React, { useEffect } from 'react'
import { useCart } from '../context/useCart';
import { getInfoUserByToken } from '@/module/auth/actions/session';
import { useProfile } from '@/module/profile/hook/use-profile';
import { useUser } from '@/module/auth/context/useUser';

export const CartWebView = () => {

    const { updateAllCart, } = useCart();
    const { setClient } = useProfile()
    const { updateUser } = useUser()

    const loadUser = async (token: string) => {
        const { user, profile } = await getInfoUserByToken(token)
        if (user && profile) {
            setClient(profile)
            updateUser(user)
        }
    }


    useEffect(() => {

        // @ts-ignore
        if (window.itemCart) {
            // @ts-ignore
            updateAllCart(window.itemCart, priceDelivery ?? 0, type ?? 'local');
            // @ts-ignore
            window.itemCart = null;
        }
    }, [])


    return (
        <div>CartWebView</div>
    )
}
