import 'server-only'
import { getApps, initializeApp, cert } from 'firebase-admin/app'
import serviceAccount from '@/service-account.json'

export const firebaseAdmin =
    getApps().length === 0
        ? initializeApp({
            credential: cert({
                projectId: serviceAccount.project_id,
                clientEmail: serviceAccount.client_email,
                privateKey: serviceAccount.private_key.replace(/\\n/g, '\n'),
            }),
        })
        : getApps()[0]