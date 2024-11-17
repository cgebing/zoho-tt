import { NextRequest, NextResponse } from "next/server"

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
    const code = request.nextUrl.searchParams.get('code')
    const clientId = process.env.NEXT_PUBLIC_ZOHO_CLIENT_ID || ''
    const clientSecret = process.env.ZOHO_CLIENT_SECRET || ''
    const redirectUri = process.env.NEXT_PUBLIC_ZOHO_REDIRECT_URI || ''
    if (!code) {
        return NextResponse.json({error: 'missing code parameter'}, {status: 400})
    }
    if (!clientId) {
        return NextResponse.json({error: 'missing NEXT_PUBLIC_ZOHO_CLIENT_ID environment variable'}, {status: 400})
    }
    if (!clientSecret) {
        return NextResponse.json({error: 'missing ZOHO_CLIENT_SECRET environment variable'}, {status: 500})
    }
    if (!redirectUri) {
        return NextResponse.json({error: 'missing NEXT_PUBLIC_ZOHO_REDIRECT_URI environment variable'}, {status: 500})
    }
    try {
        const tokenUrl = new URL('https://accounts.zoho.com/oauth/v2/token')
        const body = new FormData()
        body.append('client_id', clientId)
        body.append('client_secret', clientSecret)
        body.append('redirect_uri', redirectUri)
        body.append('code', code)
        body.append('grant_type', 'authorization_code')
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
