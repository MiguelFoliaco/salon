'use client';
import React, { useState } from 'react'
import { sendNotification } from './actions/send-notification';

export const NotificationsPages = () => {

    const [loading, setLoading] = useState(false);

    const handleSendNotification = async () => {
        setLoading(true);
        const response = await sendNotification();
        setLoading(false);
        console.log("RESPONSE : ", response);
    }

    return (
        <div className='p-4'>
            <button className='btn btn-primary btn-sm' onClick={handleSendNotification} disabled={loading}>
                {loading ? 'Enviando...' : 'Enviar notificación'}
            </button>
        </div>
    )
}
