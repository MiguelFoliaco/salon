import { AdminOrdersTable } from "@/module/admin/components/orders";
import { getAdminEmployee } from "@/module/admin/actions/employees";
import { redirect } from "next/navigation";

export default async function OrdersAdminPage() {
    const admin = await getAdminEmployee();
    
    // Validar si el usuario tiene permisos (rol admin)
    if (admin?.rol !== 'admin') {
        return redirect('/admin');
    }

    return <AdminOrdersTable />;
}
