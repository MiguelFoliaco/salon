'use client';
import Image from 'next/image';
import React from 'react'
import { BiCheckCircle } from 'react-icons/bi';
import { BsFillPersonBadgeFill, BsPeople } from 'react-icons/bs';
import { useEmploye } from '../../context/use-employe';

type args = {
    serviceId: string;
}

export const EmployesByService = ({ serviceId }: args) => {

    const { setSelectedEmployee, load, loading, selectedEmployee, employes } = useEmploye()

    React.useEffect(() => {
        load(serviceId)
    }, [serviceId]);

    return (
        <div>
            <h2 className='text-xl md:text-2xl font-bold flex items-center gap-2 mb-6 text-slate-900'>
                <span className='text-primary text-2xl'><BsPeople /></span> Select Stylist
            </h2>

            {loading && (
                <div className='flex justify-center my-8'>
                    <span className='loading loading-spinner text-primary loading-lg' />
                </div>
            )}

            <div className='flex gap-4 overflow-x-auto pb-4 scrollbar-hide snap-x'>
                {employes.map(({ employee, service }) => {
                    const isSelected = selectedEmployee?.employee?.id === employee?.id;
                    return (
                        <div
                            onClick={() => setSelectedEmployee({ employee, service })}
                            key={employee?.id}
                            className={`
                                relative min-w-[280px] snap-start bg-white p-3 pr-6 rounded-full border-2 transition-all cursor-pointer flex items-center gap-4 shadow-sm
                                ${isSelected ? 'text-primary bg-pink-50/30' : 'border-slate-100 hover:text-primary/50 hover:shadow-md'}
                            `}
                        >
                            <Image
                                src={employee?.photo || ''}
                                alt={employee?.name || ''}
                                width={60}
                                height={60}
                                className='rounded-full w-14 h-14 object-cover border-2 border-white shadow-sm'
                            />
                            <div className='flex-1'>
                                <h3 className='text-base font-bold text-slate-900'>{employee?.name}</h3>
                                <p className={`text-sm font-medium ${isSelected ? 'text-primary' : 'text-slate-500'}`}>
                                    {employee?.title || 'Stylist'}
                                </p>
                            </div>
                            {isSelected && (
                                <div className='absolute -top-2 -right-2 bg-white rounded-full p-0.5 shadow-sm'>
                                    <BiCheckCircle className='text-primary text-2xl' />
                                </div>
                            )}
                        </div>
                    )
                })}
            </div>
        </div>
    )
}
