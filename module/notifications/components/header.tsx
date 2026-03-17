import { getUsers } from '@/module/auth/actions/get-users'
import { UserIdentity } from '@supabase/supabase-js'
import React, { useEffect, useState } from 'react'
import { BiBell } from 'react-icons/bi'

export const HeaderNotification = () => {

    const [users, setUsers] = useState<{
        auth_id: string;
        id: string;
    }[]>([])
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        setLoading(true)
        getUsers()
            .then(res => {
                if (res.data) {
                    console.log("response ", res)
                    setUsers(res.data)
                }
            })
            .finally(() => {
                setLoading(false)
            })
    }, [])

    console.log(users)

    return (
        <header className='bg-base-100 rounded-box border-2 border-base-300 p-6 shadow-lg mb-8'>
            <div className='flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4'>
                <div className='flex items-center gap-4'>
                    <div className='w-14 h-14 rounded-box bg-primary/10 flex items-center justify-center'>
                        <BiBell className='text-3xl text-primary' />
                    </div>
                    <div>
                        <h1 className='text-2xl font-bold text-base-content'>Centro de Notificaciones</h1>
                        <p className='text-sm text-base-content/60'>Gestiona y envía notificaciones a tus usuarios</p>
                    </div>
                </div>
                <div className='flex items-center gap-3'>
                    <div className='stats bg-base-200 shadow-sm border border-base-300'>
                        <div className='stat py-2 px-4'>
                            {
                                loading ?
                                    <div className='loading loading-spinner loading-xs' />
                                    :
                                    <>
                                        <div className='stat-title text-xs'>Usuarios totales</div>
                                        <div className='stat-value text-lg text-primary'>{users.length}</div>
                                    </>
                            }
                        </div>
                    </div>
                </div>
            </div>
        </header>
    )
}
