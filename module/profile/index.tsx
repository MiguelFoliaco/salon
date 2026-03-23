'use client';

import { useEffect, useState } from 'react';
import { Header } from '../common/components/header';
import { FormCreateClient } from './components/forms/form-create-client';
import { ProfileDetails } from './components/details';
import { Client } from './actions/get-client';
import { useProfile } from './hook/use-profile';

export const ProfilePage = ({ clientData }: { clientData: Client | null }) => {

    const { client, setClient, loading } = useProfile();

    useEffect(() => {
        if (client || clientData) {
            //@ts-ignore
            setClient(client ?? clientData)
        }
    }, [client, clientData])


    return (
        <div className="w-full min-h-screen bg-slate-50 pb-20 font-sans">
            <Header />

            <main className="max-w-5xl mx-auto px-4 py-8 md:py-12">

                {
                    loading && <div className='w-screen h-screen bg-linear-to-br to-black from-30% from-primary fixed z-30 top-0 left-0 flex items-center justify-center gap-2'>
                        <span className="loading loading-spinner text-secondary loading-md"></span>
                        <p className='text-sm font-semibold text-primary-content'>Cargando...</p>
                    </div>
                }
                {
                    client ? <ProfileDetails clientData={client} />
                        :
                        <FormCreateClient />
                }

            </main>
        </div>
    );
};
