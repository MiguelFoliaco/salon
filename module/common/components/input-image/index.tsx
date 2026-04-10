import React, { useEffect, useState } from 'react'
import { UploadImageModal } from './modal'
import { FiImage, FiPlus } from 'react-icons/fi'
import Image from 'next/image'

type Props = {
    label?: string
    onImageUpload?: (url: string) => void
    initialImage?: string
    containerClassName?: string
    containerImageClassName?: string
}

export const InputImage = ({ label = "Imagen", onImageUpload, initialImage, containerClassName, containerImageClassName }: Props) => {
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [preview, setPreview] = useState<string | null>(initialImage || null)

    const handleSelect = (url: string) => {
        setPreview(url)
        if (onImageUpload) onImageUpload(url)
        setIsModalOpen(false)
    }

    useEffect(() => {
        if (initialImage) {
            setPreview(initialImage)
        }
    }, [initialImage])

    return (
        <div className={"form-control w-full  " + containerClassName}>
            {label && (
                <label className="label">
                    <span className="label-text font-medium text-slate-700">{label}</span>
                </label>
            )}

            <div
                className={`
                    relative w-40 h-40 rounded-2xl border-2 border-dashed 
                    flex flex-col items-center justify-center gap-2 overflow-hidden
                    transition-all duration-200 group
                    ${containerImageClassName}
                    ${preview ? 'border-primary/50 bg-base-100' : 'border-slate-300 bg-slate-50 hover:border-primary/50 hover:bg-white'}
                `}
            >
                {preview ? (
                    <>
                        <Image
                            src={preview}
                            alt="Preview"
                            fill
                            className="object-cover"
                        />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <button
                                onClick={() => setIsModalOpen(true)}
                                className="btn btn-circle btn-primary btn-sm"
                            >
                                <FiPlus className="w-4 h-4" />
                            </button>
                        </div>
                    </>
                ) : (
                    <button
                        type="button"
                        onClick={() => setIsModalOpen(true)}
                        className="flex flex-col items-center gap-2 text-slate-400 group-hover:text-primary transition-colors"
                    >
                        <div className="w-12 h-12 rounded-xl bg-white border border-slate-200 flex items-center justify-center shadow-sm">
                            <FiImage className="w-6 h-6" />
                        </div>
                        <span className="text-xs font-medium">Subir imagen</span>
                    </button>
                )}
            </div>

            <UploadImageModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSelect={handleSelect}
            />
        </div>
    )
}
