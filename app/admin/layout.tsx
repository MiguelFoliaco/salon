import { createClient } from "@/supabase/server";
import { redirect } from "next/navigation";
import { SidebarAdmin } from "@/module/admin/components/sidebar";

export default async function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const supabase = await createClient();
    const { data: { user }, error: userError } = await supabase.auth.getUser();

    if (userError || !user) {
        redirect('/login');
    }

    // Check if the user is an employee and has the 'admin' role
    const { data: employe, error: employeError } = await supabase
        .from('employes')
        .select('rol')
        .eq('auth_id', user.id)
        .eq('rol', 'admin')
        .maybeSingle();

    if (employeError || !employe || employe.rol !== 'admin') {
        redirect('/'); // Redirect to home if not an admin
    }

    return (
        <div className="flex h-screen bg-slate-50 flex-col md:flex-row">
            <SidebarAdmin />
            <main className="flex-1 overflow-y-auto">
                {children}
            </main>
        </div>
    );
}
