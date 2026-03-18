import { AdminPage } from "@/module/admin"
import { getAdminEmployee } from "@/module/admin/actions/employees"
import { redirect } from "next/navigation"

export default async function AdminPages() {
    const admin = await getAdminEmployee()
    if (admin?.rol === 'admin') {
        return <AdminPage />
    }
    return redirect('/')
}
