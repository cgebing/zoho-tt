import { NextRequest, NextResponse } from "next/server"

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
    const accessToken = request.nextUrl.searchParams.get('accessToken')
    try {
        await fetch(`https://accounts.zoho.com/oauth/v2/token/revoke?token=${accessToken}`)
    } catch {
    }
    return NextResponse.json({ status: 'ok' })
}
