import { NextRequest, NextResponse } from "next/server"

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
    const refreshToken = request.nextUrl.searchParams.get('refreshToken')
    const clientId = process.env.NEXT_PUBLIC_ZOHO_CLIENT_ID || ''
    const clientSecret = process.env.ZOHO_CLIENT_SECRET || ''
    if (!refreshToken) {
        return NextResponse.json({error: 'missing refreshToken parameter'}, {status: 400})
    }
    if (!clientId) {
        return NextResponse.json({error: 'missing clientId environment variable'}, {status: 400})
    }
    if (!clientSecret) {
        return NextResponse.json({error: 'missing clientSecret environment variable'}, {status: 500})
    }
    try {
        const tokenUrl = new URL('https://accounts.zoho.com/oauth/v2/token')
        const body = new FormData()
        body.append('client_id', clientId)
        body.append('client_secret', clientSecret)
        body.append('grant_type', 'refresh_token')
        body.append('refresh_token', refreshToken)
        const response = await fetch(tokenUrl, {
            method: 'POST',
            body: body
        })
        const json = await response.json()
        return NextResponse.json(json)
    } catch (e) {
        return NextResponse.json({error: `failed to generate access token. ${String(e).replaceAll(clientSecret, '****')}`}, {status: 500})
    }
}
