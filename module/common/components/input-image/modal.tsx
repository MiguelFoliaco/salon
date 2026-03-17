/* eslint-disable react-hooks/preserve-manual-memoization */
"use client"

import type React from "react"

import { useState, useRef, useCallback } from "react"
import { FiUploadCloud, FiX, FiImage, FiTrash2, FiCheck, FiAlertCircle, FiFile } from "react-icons/fi"
import { HiOutlinePhotograph } from "react-icons/hi"
import { uploadOneImage, listImages } from "./action"
import Image from "next/image"

type UploadedFile = {
    id: string
    file: File
    preview: string
    progress: number
    status: "pending" | "uploading" | "completed" | "error"
    error?: string
}

type Props = {
    isOpen: boolean
    onClose: () => void
    onUpload?: (files: File[]) => Promise<void>
    onSelect?: (url: string) => void
    maxFiles?: number
    maxSizeMB?: number
    acceptedTypes?: string[]
    title?: string
    authId?: string
}

export const UploadImageModal = ({
    isOpen,
    onClose,
    onUpload,
    onSelect,
    maxFiles = 5,
    maxSizeMB = 10,
    acceptedTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"],
    title = "Subir imágenes",
    authId = "user_placeholder",
}: Props) => {
    const [files, setFiles] = useState<UploadedFile[]>([])
    const [isDragging, setIsDragging] = useState(false)
    const [isUploading, setIsUploading] = useState(false)
    const [mode, setMode] = useState<'upload' | 'library'>('upload')
    const [libraryImages, setLibraryImages] = useState<any[]>([])
    const [isLoadingLibrary, setIsLoadingLibrary] = useState(false)
    const inputRef = useRef<HTMLInputElement>(null)

    const fetchLibrary = async () => {
        setIsLoadingLibrary(true)
        try {
            const images = await listImages(authId)
            setLibraryImages(images)
        } catch (error) {
            console.error(error)
        } finally {
            setIsLoadingLibrary(false)
        }
    }

    const validateFile = (file: File): string | null => {
        if (!acceptedTypes.includes(file.type)) {
            return `Tipo no permitido. Usa: ${acceptedTypes.map((t) => t.split("/")[1]).join(", ")}`
        }
        if (file.size > maxSizeMB * 1024 * 1024) {
            return `El archivo excede ${maxSizeMB}MB`
        }
        return null
    }

    const addFiles = useCallback(
        (newFiles: FileList | File[]) => {
            const fileArray = Array.from(newFiles)
            const remainingSlots = maxFiles - files.length

            if (remainingSlots <= 0) return

            const filesToAdd = fileArray.slice(0, remainingSlots).map((file) => {
                const error = validateFile(file)
                return {
                    id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
                    file,
                    preview: file.type.startsWith("image/") ? URL.createObjectURL(file) : "",
                    progress: 0,
                    status: error ? "error" : "pending",
                    error,
                } as UploadedFile
            })

            setFiles((prev) => [...prev, ...filesToAdd])
        },
        [files.length, maxFiles, acceptedTypes, maxSizeMB],
    )

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault()
        setIsDragging(true)
    }

    const handleDragLeave = (e: React.DragEvent) => {
        e.preventDefault()
        setIsDragging(false)
    }

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault()
        setIsDragging(false)
        if (e.dataTransfer.files) {
            addFiles(e.dataTransfer.files)
        }
    }

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            addFiles(e.target.files)
        }
    }

    const removeFile = (id: string) => {
        setFiles((prev) => {
            const file = prev.find((f) => f.id === id)
            if (file?.preview) {
                URL.revokeObjectURL(file.preview)
            }
            return prev.filter((f) => f.id !== id)
        })
    }

    const clearAll = () => {
        files.forEach((f) => {
            if (f.preview) URL.revokeObjectURL(f.preview)
        })
        setFiles([])
    }

    const handleUpload = async () => {
        const pendingFiles = files.filter((f) => f.status === "pending")
        if (pendingFiles.length === 0) return

        setIsUploading(true)

        try {
            const uploadedUrls: string[] = []
            
            for (const uploadFile of pendingFiles) {
                setFiles((prev) => prev.map((f) => (f.id === uploadFile.id ? { ...f, status: "uploading", progress: 30 } : f)))

                try {
                    // We need auth_id. For now using a placeholder or assuming it can be passed.
                    // Let's assume user.id is available or passed via props.
                    const result = await uploadOneImage(uploadFile.file, 'user_placeholder')
                    
                    setFiles((prev) => prev.map((f) => (f.id === uploadFile.id ? { ...f, status: "completed", progress: 100 } : f)))
                    uploadedUrls.push(result.secure_url)
                } catch (err: any) {
                    setFiles((prev) => prev.map((f) => (f.id === uploadFile.id ? { ...f, status: "error", error: err.message || "Error al subir" } : f)))
                }
            }

            if (onSelect && uploadedUrls.length > 0) {
                onSelect(uploadedUrls[0])
                onClose()
            }

            if (onUpload && uploadedUrls.length > 0) {
                await onUpload(pendingFiles.filter(f => uploadedUrls.includes(f.preview)).map(f => f.file))
            }
        } finally {
            setIsUploading(false)
        }
    }

    const handleClose = () => {
        if (!isUploading) {
            clearAll()
            onClose()
        }
    }

    const pendingCount = files.filter((f) => f.status === "pending").length
    const completedCount = files.filter((f) => f.status === "completed").length
    if (!isOpen) return null

    return (
        <dialog className="modal modal-open">
            <div className="modal-backdrop bg-base-300/80 backdrop-blur-sm" onClick={handleClose} />

            <div className="modal-box bg-base-100 border border-base-300 shadow-2xl max-w-2xl w-full p-0 overflow-hidden">
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b border-base-300">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                            <HiOutlinePhotograph className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                            <h3 className="font-semibold text-base-content">{title}</h3>
                            <p className="text-xs text-base-content/60">
                                Máximo {maxFiles} archivos, {maxSizeMB}MB cada uno
                            </p>
                        </div>
                    </div>
                    <button onClick={handleClose} disabled={isUploading} className="btn btn-ghost btn-sm btn-circle">
                        <FiX className="w-5 h-5" />
                    </button>
                </div>

                {/* Content */}
                <div className="p-4 space-y-4">
                    {/* Tabs */}
                    <div className="flex px-4 border-b border-base-300">
                        <button 
                            onClick={() => setMode('upload')}
                            className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${mode === 'upload' ? 'border-primary text-primary' : 'border-transparent text-base-content/60 hover:text-base-content'}`}
                        >
                            Subir nueva
                        </button>
                        <button 
                            onClick={() => {
                                setMode('library')
                                fetchLibrary()
                            }}
                            className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${mode === 'library' ? 'border-primary text-primary' : 'border-transparent text-base-content/60 hover:text-base-content'}`}
                        >
                            Biblioteca
                        </button>
                    </div>

                    {mode === 'upload' ? (
                        <div
                            onDragOver={handleDragOver}
                            onDragLeave={handleDragLeave}
                            onDrop={handleDrop}
                            onClick={() => inputRef.current?.click()}
                            className={`
                                relative border-2 border-dashed rounded-xl p-8
                                flex flex-col items-center justify-center gap-3
                                cursor-pointer transition-all duration-200
                                ${isDragging
                                    ? "border-primary bg-primary/5 scale-[1.02]"
                                    : "border-base-300 hover:border-primary/50 hover:bg-base-200/50"
                                }
                                ${files.length >= maxFiles ? "opacity-50 pointer-events-none" : ""}
                            `}
                        >
                            <input
                                ref={inputRef}
                                type="file"
                                multiple
                                accept={acceptedTypes.join(",")}
                                onChange={handleFileSelect}
                                className="hidden"
                            />

                            <div
                                className={`
                                w-16 h-16 rounded-2xl flex items-center justify-center
                                transition-all duration-200
                                ${isDragging ? "bg-primary/20 scale-110" : "bg-base-200"}
                            `}
                            >
                                <FiUploadCloud
                                    className={`
                                    w-8 h-8 transition-colors
                                    ${isDragging ? "text-primary" : "text-base-content/40"}
                                `}
                                />
                            </div>

                            <div className="text-center">
                                <p className="font-medium text-base-content">
                                    {isDragging ? "Suelta aquí tus archivos" : "Arrastra y suelta tus imágenes"}
                                </p>
                                <p className="text-sm text-base-content/60 mt-1">
                                    o <span className="text-primary font-medium">haz clic para seleccionar</span>
                                </p>
                            </div>

                            <div className="flex items-center gap-2 text-xs text-base-content/50">
                                <FiImage className="w-3.5 h-3.5" />
                                <span>JPG, PNG, GIF, WEBP</span>
                            </div>
                        </div>
                    ) : (
                        <div className="min-h-[200px] max-h-[400px] overflow-y-auto">
                            {isLoadingLibrary ? (
                                <div className="flex items-center justify-center p-12">
                                    <span className="loading loading-spinner text-primary" />
                                </div>
                            ) : libraryImages.length === 0 ? (
                                <div className="flex flex-col items-center justify-center p-12 text-base-content/40 gap-2">
                                    <FiImage className="w-8 h-8" />
                                    <p className="text-sm">No hay imágenes en la biblioteca</p>
                                </div>
                            ) : (
                                <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 p-1">
                                    {libraryImages.map((img: any) => (
                                        <button
                                            key={img.public_id}
                                            onClick={() => {
                                                if (onSelect) onSelect(img.secure_url)
                                                onClose()
                                            }}
                                            className="group relative aspect-square rounded-lg overflow-hidden border border-base-300 hover:border-primary transition-colors focus:ring-2 focus:ring-primary"
                                        >
                                            <Image 
                                                src={img.secure_url} 
                                                alt={img.public_id}
                                                fill
                                                className="object-cover transition-transform group-hover:scale-105"
                                            />
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}

                    {/* File List */}
                    {files.length > 0 && (
                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <span className="text-sm font-medium text-base-content">
                                    Archivos ({files.length}/{maxFiles})
                                </span>
                                {files.length > 0 && !isUploading && (
                                    <button onClick={clearAll} className="text-xs text-error hover:underline">
                                        Limpiar todo
                                    </button>
                                )}
                            </div>

                            <div className="max-h-48 overflow-y-auto space-y-2 pr-1">
                                {files.map((file) => (
                                    <div
                                        key={file.id}
                                        className={`
                                            flex items-center gap-3 p-3 rounded-lg border
                                            transition-all duration-200
                                            ${file.status === "error"
                                                ? "bg-error/5 border-error/30"
                                                : file.status === "completed"
                                                    ? "bg-success/5 border-success/30"
                                                    : "bg-base-200/50 border-base-300"
                                            }
                                        `}
                                    >
                                        {/* Preview */}
                                        <div className="w-12 h-12 rounded-lg overflow-hidden bg-base-300 flex-shrink-0">
                                            {file.preview ? (
                                                <img
                                                    src={file.preview || "/placeholder.svg"}
                                                    alt={file.file.name}
                                                    className="w-full h-full object-cover"
                                                />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center">
                                                    <FiFile className="w-5 h-5 text-base-content/40" />
                                                </div>
                                            )}
                                        </div>

                                        {/* Info */}
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-medium text-base-content truncate">{file.file.name}</p>
                                            <div className="flex items-center gap-2 mt-0.5">
                                                <span className="text-xs text-base-content/60">
                                                    {(file.file.size / 1024 / 1024).toFixed(2)} MB
                                                </span>
                                                {file.status === "error" && <span className="text-xs text-error">{file.error}</span>}
                                            </div>

                                            {/* Progress Bar */}
                                            {file.status === "uploading" && (
                                                <div className="mt-2">
                                                    <progress
                                                        className="progress progress-primary w-full h-1.5"
                                                        value={file.progress}
                                                        max="100"
                                                    />
                                                </div>
                                            )}
                                        </div>

                                        {/* Status/Action */}
                                        <div className="flex-shrink-0">
                                            {file.status === "completed" ? (
                                                <div className="w-8 h-8 rounded-full bg-success/20 flex items-center justify-center">
                                                    <FiCheck className="w-4 h-4 text-success" />
                                                </div>
                                            ) : file.status === "error" ? (
                                                <div className="w-8 h-8 rounded-full bg-error/20 flex items-center justify-center">
                                                    <FiAlertCircle className="w-4 h-4 text-error" />
                                                </div>
                                            ) : file.status === "uploading" ? (
                                                <span className="loading loading-spinner loading-sm text-primary" />
                                            ) : (
                                                <button
                                                    onClick={() => removeFile(file.id)}
                                                    className="btn btn-ghost btn-sm btn-circle text-base-content/60 hover:text-error hover:bg-error/10"
                                                >
                                                    <FiTrash2 className="w-4 h-4" />
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between p-4 border-t border-base-300 bg-base-200/30">
                    <div className="text-sm text-base-content/60">
                        {completedCount > 0 && <span className="text-success">{completedCount} completado(s)</span>}
                        {completedCount > 0 && pendingCount > 0 && <span className="mx-1">·</span>}
                        {pendingCount > 0 && <span>{pendingCount} pendiente(s)</span>}
                    </div>

                    <div className="flex items-center gap-2">
                        <button onClick={handleClose} disabled={isUploading} className="btn btn-ghost btn-sm">
                            Cancelar
                        </button>
                        <button
                            onClick={handleUpload}
                            disabled={pendingCount === 0 || isUploading}
                            className="btn btn-primary btn-sm gap-2"
                        >
                            {isUploading ? (
                                <>
                                    <span className="loading loading-spinner loading-xs" />
                                    Subiendo...
                                </>
                            ) : (
                                <>
                                    <FiUploadCloud className="w-4 h-4" />
                                    Subir {pendingCount > 0 ? `(${pendingCount})` : ""}
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </dialog>
    )
}
