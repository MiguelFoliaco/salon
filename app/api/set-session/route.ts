// app/api/set-session/route.ts
import { createClient } from "@/supabase/server";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    console.log('HOLA MUNDO')
    const { user_auth, refresh_token } = await req.json();

    const supabase = await createClient();

    await supabase.auth.setSession({
        access_token: user_auth,
        refresh_token
    });

    return NextResponse.json({ ok: true });
}