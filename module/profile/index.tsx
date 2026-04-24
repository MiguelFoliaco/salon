'use client';

import { useEffect, useState } from 'react';
import { Header } from '../common/components/header';
import { FormCreateClient } from './components/forms/form-create-client';
import { ProfileDetails } from './components/details';
import { Client } from './actions/get-client';
import { useProfile } from './hook/use-profile';
import { logout } from '../auth/actions/session';

export const ProfilePage = ({ clientData }: { clientData: Client | null }) => {

    const { client, setClient, loading } = useProfile();
    const [editProfile, setEditProfile] = useState(false)
    const [loadingLogOut, setLoadingLogOut] = useState(false)
    useEffect(() => {
        if (client || clientData) {
            //@ts-ignore
            setClient(client ?? clientData)
        }
    }, [client, clientData])

    const handleLogOut = async () => {
        setLoadingLogOut(true)
        await logout()
        setLoadingLogOut(false)
    }

    return (
        <div className="w-full min-h-screen bg-slate-50 pb-20 font-sans">
            <Header />

            <main className="relative max-w-7xl mx-auto px-4 py-8 md:py-12">

                {
                    loading && <div className='w-screen h-screen bg-linear-to-br to-black from-30% from-primary fixed z-30 top-0 left-0 flex items-center justify-center gap-2'>
                        <span className="loading loading-spinner text-secondary loading-md"></span>
                        <p className='text-sm font-semibold text-primary-content'>Cargando...</p>
                    </div>
                }
                {
                    client ? editProfile ? <FormCreateClient client={client} editProfile={editProfile} setEditProfile={setEditProfile} /> : <ProfileDetails clientData={client} editProfile={editProfile} setEditProfile={setEditProfile} />
                        :
                        <FormCreateClient
                            client={client}
                            editProfile={editProfile}
                            setEditProfile={setEditProfile}
                        />
                }

                <button onClick={handleLogOut} className="fixed bottom-8 left-1/2 -translate-x-1/2 z-40">
                    <div className="btn btn-error">
                        {loadingLogOut ? <span className="loading loading-spinner"></span> : 'Cerrar sesión'}
                    </div>
                </button>
            </main>
        </div>
    );
};
