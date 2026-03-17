'use server';
import { CONSTANT } from '@/constant';
import { v2 as cloudinary, UploadApiResponse } from 'cloudinary'


export const uploadOneImage = async (file: File, auth_id: string): Promise<UploadApiResponse> => {
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    return new Promise<UploadApiResponse>((resolve, reject) => {
        cloudinary.uploader.upload_stream(
            {
                folder: `${CONSTANT.CLODINARY_CONFIG.FOLDER}/${auth_id}`,
                resource_type: 'image',
                public_id: file.name,
            },
            (error, result) => {
                if (error) reject(error)
                if (!result) reject(new Error('No result from cloudinary'))
                else resolve(result)
            }
        ).end(buffer)
    })
}


export const getImageWebp = async (id: string) => {
    return cloudinary.url(id, { format: 'jpg', })
}

export const listImages = async (auth_id: string) => {
    try {
        const result = await cloudinary.api.resources({
            type: 'upload',
            prefix: `${CONSTANT.CLODINARY_CONFIG.FOLDER}/${auth_id}`,
            max_results: 50
        })
        return result.resources
    } catch (error) {
        console.error('Error listing images:', error)
        return []
    }
}