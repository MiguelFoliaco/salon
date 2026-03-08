import { ProfilePage } from "@/module/profile"
import { getClient } from "@/module/profile/actions/get-client"
import { createClient } from "@/supabase/server"
import { redirect } from "next/navigation";

export default async function ProfileRoute() {
    const client = await createClient()
    const { data: session } = await client.auth.getUser();

    if (!session?.user) {
        return redirect('/auth/login')
    }

    const dataClient = await getClient()

    return <ProfilePage clientData={dataClient} />
}
