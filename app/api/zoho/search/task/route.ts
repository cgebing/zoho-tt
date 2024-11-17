import { NextRequest, NextResponse } from "next/server"

export const dynamic = 'force-dynamic';

interface Task {
    key: string
    id_string: string
    project: {
        id_string: string
    }
}
interface TaskCacheItem {
    id: string
    projectId: string
}

// store tasks in memory cache
const cache: Map<string, TaskCacheItem> = new Map

export async function GET(request: NextRequest) {
    const key = request.nextUrl.searchParams.get('key')
    const portalId = process.env.NEXT_PUBLIC_ZOHO_PORTAL_ID || ''
    const host = process.env.NEXT_PUBLIC_ZOHO_PORTAL_DOMAIN || ''
    const auth = request.headers.get('Authorization')
    if (!auth) {
        return NextResponse.json({error: 'missing Authorization header.'}, { status: 400 })
    }
    if (!key) {
        return NextResponse.json({error: 'missing key parameter.'}, { status: 400 })
    }
    if (!portalId) {
        return NextResponse.json({error: 'missing NEXT_PUBLIC_ZOHO_PORTAL_ID environment variable.'}, { status: 400 })
    }
    if (!host) {
        return NextResponse.json({error: 'missing NEXT_PUBLIC_ZOHO_PORTAL_DOMAIN environment variable.'}, { status: 400 })
    }
    if (cache.has(key)) {
        const task = cache.get(key)
        return NextResponse.json({
            projectId: String(task?.projectId),
            id: String(task?.id)
        })
    }
    try {
        const response = await fetch(
            `https://${host}/restapi/portal/678695406/search?index=0&range=5&search_term=${key}&module=tasks`,
            { headers: { 'Authorization': auth } }
        )
        const { tasks } = await response.json()
        const [task] = tasks?.filter((task: Task) => task.key === key) || []
        if (task && task.project.id_string && task.id_string) {
            cache.set(key, {
                id: task.id_string,
                projectId: task.project.id_string
            })
            return NextResponse.json({
                projectId: String(task.project.id_string),
                id: String(task.id_string)
            })
        } else {
            return NextResponse.json({error: `no task with the key ${key} found.`}, { status: 404 })
        }
    } catch (e) {
        return NextResponse.json({error: `api request failed. ${e}`}, { status: 500 })
    }
}
