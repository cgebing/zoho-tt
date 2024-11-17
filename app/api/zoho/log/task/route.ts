import { NextRequest, NextResponse } from "next/server"

export const dynamic = 'force-dynamic'

interface RequestBody {
    date?: string,
    billStatus?: string,
    hours?: string,
    taskId?: string,
    projectId?: string,
    owner?: string,
    notes?: string,
    customFields?: {[key: string]: string},
    costPerHour?: number
}

export async function POST(request: NextRequest) {
    const portalId: string = process.env.NEXT_PUBLIC_ZOHO_PORTAL_ID || ''
    const portalHost: string = process.env.NEXT_PUBLIC_ZOHO_PORTAL_DOMAIN || ''
    const portalPath: string = process.env.NEXT_PUBLIC_ZOHO_PORTAL_PATH || ''
    const auth = request.headers.get('Authorization')
    const data: RequestBody = await request.json()
    if (!auth) {
        return NextResponse.json({error: 'missing Authorization header.'}, { status: 400 })
    }
    if (!portalId) {
        return NextResponse.json({error: 'missing NEXT_PUBLIC_ZOHO_PORTAL_ID environment variable.'}, { status: 400 })
    }
    if (!portalHost) {
        return NextResponse.json({error: 'missing NEXT_PUBLIC_ZOHO_PORTAL_DOMAIN environment variable.'}, { status: 400 })
    }
    if (!portalPath) {
        return NextResponse.json({error: 'missing NEXT_PUBLIC_ZOHO_PORTAL_PATH environment variable.'}, { status: 400 })
    }
    if (!data.date) {
        return NextResponse.json({error: 'missing date in the request body.'}, { status: 400 })
    }
    if (!data.billStatus) {
        return NextResponse.json({error: 'missing billStatus in the request body.'}, { status: 400 })
    }
    if (!data.hours) {
        return NextResponse.json({error: 'missing hours in the request body.'}, { status: 400 })
    }
    if (!data.taskId) {
        return NextResponse.json({error: 'missing taskId in the request body.'}, { status: 400 })
    }
    if (!data.projectId) {
        return NextResponse.json({error: 'missing taskId in the request body.'}, { status: 400 })
    }
    try {
        const body = new FormData
        body.append('date', data.date)
        body.append('bill_status', data.billStatus)
        body.append('hours', data.hours)
        if (data.notes) {
            body.append('notes', data.notes)
        }
        if (data.customFields) {
            body.append('custom_fields', JSON.stringify(data.customFields))
        }
        if (data.costPerHour) {
            body.append('cost_per_hour', String(data.costPerHour))
        }
        const response = await fetch(`https://${portalHost}/restapi/portal/${portalId}/projects/${data.projectId}/tasks/${data.taskId}/logs/`, {
            method: 'POST',
            body: body,
            headers: { 'Authorization': auth }
        })
        const json = await response.json()
        if (json?.timelogs?.tasklogs && json?.timelogs?.tasklogs[0]) {
            const [tasklog] = json?.timelogs?.tasklogs
            return NextResponse.json({
                // link: `https://${portalHost}${portalPath}#timesheetdetail/${data.projectId}/task/${tasklog.id_string}`,
                link: `https://${portalHost}${portalPath}#taskdetail/${data.projectId}/${tasklog.task_list.id}/${data.taskId}`,
            }, { status: 201 })
        } else {
            return NextResponse.json({ error: 'failed to process zoho api response.', response: json }, { status: 500 })
        }
    } catch (e) {
        return NextResponse.json({ error: 'failed to add time log: ' + e }, { status: 500 })
    }
}
