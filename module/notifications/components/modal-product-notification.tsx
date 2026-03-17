'use client';
import React, { useState, useRef } from 'react'
import { BsImage, BsX, BsUpload, BsSend } from 'react-icons/bs';
import { BiPackage } from 'react-icons/bi';
import { SearchInput } from '@/module/search/components/input-search';
import { InputImage } from '@/module/common/components/input-image';
import { saveNotificationDB, sendNotifications } from '../actions/send-notification';

interface ModalProductNotificationProps {
    onClose: () => void;
    onSubmit?: (data: NotificationFormData) => void;
}

interface NotificationFormData {
    productId: string;
    productName: string;
    title: string;
    description: string;
    image: string | null;
}

const products = [
    { id: '1', name: 'Café Espresso Premium', category: 'Bebidas' },
    { id: '2', name: 'Cappuccino Especial', category: 'Bebidas' },
    { id: '3', name: 'Croissant de Almendras', category: 'Panadería' },
    { id: '4', name: 'Cheesecake de Frutos Rojos', category: 'Postres' },
    { id: '5', name: 'Té Matcha Latte', category: 'Bebidas' },
    { id: '6', name: 'Brownie de Chocolate', category: 'Postres' },
];

export const ModalProductNotification = ({ onClose, onSubmit }: ModalProductNotificationProps) => {
    const [formData, setFormData] = useState<NotificationFormData>({
        productId: '',
        productName: '',
        title: '',
        description: '',
        image: null
    });
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState<Partial<Record<keyof NotificationFormData, string>>>({});


    const validateForm = () => {
        const newErrors: Partial<Record<keyof NotificationFormData, string>> = {};

        if (!formData.productId) {
            newErrors.productId = 'Selecciona un producto';
        }
        if (!formData.title.trim()) {
            newErrors.title = 'El título es obligatorio';
        } else if (formData.title.length > 100) {
            newErrors.title = 'Máximo 100 caracteres';
        }
        if (!formData.description.trim()) {
            newErrors.description = 'La descripción es obligatoria';
        } else if (formData.description.length > 500) {
            newErrors.description = 'Máximo 500 caracteres';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) return;

        setLoading(true);
        await sendNotifications({
            body: formData.description,
            categoryId: 'product',
            to: 'all',
            title: formData.title,
            richContent: {
                image: formData.image!,
            },
            data: {
                type: 'PRODUCT',
                productId: formData.productId,
                image: formData.image!,
                deepLink: `/product/${formData.productId}`
            }
        })
        const saved = await saveNotificationDB({
            description: formData.description,
            title: formData.title,
            image: formData.image!,
            type: 'PRODUCT',
            //@ts-ignore
            data: formData,
        })
        console.log(saved)
        // await new Promise(resolve => setTimeout(resolve, 1500));
        console.log('Info: ', formData)
        onSubmit?.(formData);
        setLoading(false);
        handleClose();
    };

    const handleClose = () => {
        setFormData({ productId: '', title: '', description: '', image: null, productName: '' });
        setImagePreview(null);
        setErrors({});
        onClose();
    };


    return (
        <div className=" w-full p-4 rounded-md max-w-2xl bg-base-100 border-2 border-base-100 shadow-2xl" onClick={(e) => e.stopPropagation()}>
            {/* Header */}
            <div className="flex items-center justify-between pb-4 border-b border-base-300">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-box bg-primary/10 flex items-center justify-center">
                        <BiPackage className="text-xl text-primary" />
                    </div>
                    <div>
                        <h3 className="font-bold text-lg text-base-content">Nueva Notificación de Producto</h3>
                        <p className="text-xs text-base-content/60">Completa los campos para enviar</p>
                    </div>
                </div>
                <button
                    onClick={handleClose}
                    className="btn btn-ghost btn-sm btn-circle"
                >
                    <BsX className="text-xl" />
                </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="mt-6 space-y-5">
                {/* Product Select */}
                <div className="form-control w-full">
                    <label className="label">
                        <span className="label-text font-medium">Producto</span>
                        <span className="label-text-alt text-base-content/50">Obligatorio</span>
                    </label>
                    <div>
                        <SearchInput onClick={(item) => setFormData(prev => ({ ...prev, productId: item.id, productName: item.name, image: item.image }))} />
                        <p className="text-xs mt-2 ">Producto: {formData.productName}</p>
                    </div>
                    {errors.productId && (
                        <label className="label">
                            <span className="label-text-alt text-error">{errors.productId}</span>
                        </label>
                    )}
                </div>

                {/* Image Upload */}
                <InputImage
                    label="Imagen"
                    onImageUpload={(url) => setFormData(prev => ({ ...prev, image: url }))}
                    initialImage={formData.image!}
                />

                {/* Title */}
                <div className="form-control w-full">
                    <label className="label">
                        <span className="label-text font-medium">Título de la notificación</span>
                        <span className="label-text-alt text-base-content/50">
                            {formData.title.length}/100
                        </span>
                    </label>
                    <input
                        type="text"
                        placeholder="Ej: Nuevo sabor disponible"
                        className={`input input-bordered w-full rounded-sm bg-base-100 ${errors.title ? 'input-error' : ''}`}
                        value={formData.title}
                        onChange={(e) => {
                            setFormData(prev => ({ ...prev, title: e.target.value }));
                            setErrors(prev => ({ ...prev, title: undefined }));
                        }}
                        maxLength={100}
                    />
                    {errors.title && (
                        <label className="label">
                            <span className="label-text-alt text-error">{errors.title}</span>
                        </label>
                    )}
                </div>

                {/* Description */}
                <div className="form-control w-full">
                    <label className="label">
                        <span className="label-text font-medium">Descripción</span>
                        <span className="label-text-alt text-base-content/50">
                            {formData.description.length}/500
                        </span>
                    </label>
                    <textarea
                        placeholder="Describe la notificación que recibirán los usuarios..."
                        className={`textarea textarea-bordered rounded-sm w-full bg-base-100 min-h-[120px] resize-none ${errors.description ? 'textarea-error' : ''}`}
                        value={formData.description}
                        onChange={(e) => {
                            setFormData(prev => ({ ...prev, description: e.target.value }));
                            setErrors(prev => ({ ...prev, description: undefined }));
                        }}
                        maxLength={500}
                    />
                    {errors.description && (
                        <label className="label">
                            <span className="label-text-alt text-error">{errors.description}</span>
                        </label>
                    )}
                </div>

                {/* Actions */}
                <div className="flex items-center justify-end gap-3 pt-4 border-t border-base-300">
                    <button
                        type="button"
                        onClick={handleClose}
                        className="btn btn-ghost"
                        disabled={loading}
                    >
                        Cancelar
                    </button>
                    <button
                        type="submit"
                        className="btn btn-primary gap-2"
                        disabled={loading}
                    >
                        {loading ? (
                            <>
                                <span className="loading loading-spinner loading-sm"></span>
                                Enviando...
                            </>
                        ) : (
                            <>
                                <BsSend className="text-sm" />
                                Enviar Notificación
                            </>
                        )}
                    </button>
                </div>
            </form>
        </div>
    )
}
