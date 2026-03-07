'use client';
import Image from 'next/image';
import React from 'react'
import { BiCheckCircle } from 'react-icons/bi';
import { BsFillPersonBadgeFill } from 'react-icons/bs';
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
            <h2 className='text-2xl font-semibold flex items-center gap-2 mb-10'>
                <BsFillPersonBadgeFill className='inline-block text-primary' size={30} />
                Escoja un Profesional
            </h2>

            {
                loading && <span className='loading loading-spinner loading-xl' />
            }
            <div className='grid grid-cols-4 gap-4 mt-4'>
                {employes.map(({ employee, service }) => (
                    <div onClick={() => setSelectedEmployee({ employee, service })} key={employee?.id} className={`relative border-gray-200 p-4 rounded-full border-2 hover:border-primary transition-all cursor-pointer flex items-center gap-4 ${selectedEmployee?.employee?.id === employee?.id ? 'border-primary' : ''}`}>
                        <Image src={employee?.photo || ''} alt={employee?.name || ''} width={50} height={50} className='rounded-full w-20 h-20 object-cover' />
                        <div>
                            <h3 className='text-lg font-bold'>{employee?.name}</h3>
                            <p className='text-gray-600'>{employee?.title}</p>
                        </div>
                        {selectedEmployee?.employee?.id === employee?.id && (
                            <BiCheckCircle className='text-primary top-10 right-10 absolute' />
                        )}
                    </div>
                ))}
            </div>
        </div>
    )
}
