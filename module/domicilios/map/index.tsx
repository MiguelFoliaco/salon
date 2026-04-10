'use client';
import dynamic from 'next/dynamic';
export const Map = dynamic(() => import('./map'), {
    ssr: false,
    loading: () => <div className="w-full h-full skeleton" />
})