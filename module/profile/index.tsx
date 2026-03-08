'use client';

import { useEffect, useState } from 'react';
import { Header } from '../common/components/header';
import { FormCreateClient } from './components/forms/form-create-client';
import { ProfileDetails } from './components/details';
import { Client } from './actions/get-client';
import { useProfile } from './hook/use-profile';

export const ProfilePage = ({ clientData }: { clientData: Client | null }) => {

    const { client, setClient } = useProfile();

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
                    client ? <ProfileDetails clientData={client} />
                        :
                        <FormCreateClient />
                }

            </main>
        </div>
    );
};
