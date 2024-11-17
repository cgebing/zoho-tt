import { useContext } from 'react'
import { toaster } from '@/components/ui/toaster'
import { Activity, ActivityOptions, OAuth2, PersistentAppContext, Task } from '@/context/persistent-app-context'
import { AppContext } from '@/context/app-context'

interface TimeLogData {
    date: string
    billStatus: string
    hours: string
    notes?: string
    customFields?: {[key: string]: string}
    costPerHour?: number
    taskId: string
    projectId: string
}

const useZoho = () => {
    const { OAuth2, tasks, activities, setTasks, setOAuth2, setActivities } = useContext(PersistentAppContext)
    const { updateAppState, isSendingSavingRequest } = useContext(AppContext)

    const authMiddleware = async (currentOAuth2: OAuth2) => {
        let newOAuth2: OAuth2 = { ...currentOAuth2 }
        if (!newOAuth2.accessToken || (!newOAuth2.accessToken && !newOAuth2.refreshToken)) {
            throw new Error('Unable to authenticate. No access and refresh token is set')
        }
        if (!newOAuth2.refreshToken && newOAuth2.expireDate && newOAuth2.expireDate < Date.now()) {
            throw new Error('Unable to refresh token. Token expired and no refresh token is set')
        }
        if (newOAuth2.refreshToken && newOAuth2.expireDate && newOAuth2.expireDate < Date.now()) {
            try {
                updateAppState({ isGeneratingRefreshToken: true })
                const response = await fetch(`/api/zoho/auth/refresh-token?refreshToken=${newOAuth2.refreshToken}`)
                const { access_token, expires_in, ...rest } = await response.json()
                if (!access_token) {
                    throw new Error(`Missing access_token in response: \n${JSON.stringify(rest, null, 2)}`)
                }
                newOAuth2 = {
                    ...newOAuth2,
                    accessToken: access_token || '',
                    expireDate: Date.now() + (parseInt(expires_in) || 3600) * 1000
                }
                setOAuth2(newOAuth2)
            } catch (e) {
                updateAppState({ isGeneratingRefreshToken: false })
                throw e
            }
            updateAppState({ isGeneratingRefreshToken: false })
        }
        return newOAuth2
    }

    const fetchGenerateAccessToken = (code: string) => {
        updateAppState({ isGeneratingAccessToken: true })
        return new Promise<void>(async (resolve, reject) => {
            try {
                const response = await fetch(`/api/zoho/auth/token?code=${code}`)
                const { access_token, refresh_token, expires_in, ...rest } = await response.json()
                if (!access_token) {
                    return reject(`Missing access_token in response: \n${JSON.stringify(rest, null, 2)}`)
                }
                setOAuth2(prevState => ({
                    ...prevState,
                    accessToken: access_token || '',
                    refreshToken: refresh_token || '',
                    expireDate: Date.now() + (parseInt(expires_in) || 3600) * 1000
                }))
            } catch (e) {
                updateAppState({ isGeneratingAccessToken: false })
                return reject(`Failed to generate an access token for the Zoho API. ${e}`)
            }
            updateAppState({ isGeneratingAccessToken: false })
            return resolve()
        })
    }

    const fetchRevokeToken = () => {
        fetch(`/api/zoho/auth/revoke-token?accessToken=${OAuth2.accessToken}`)
        setOAuth2(prevState => ({
            ...prevState,
            accessToken: '',
            refreshToken: '',
            expireDate: 0
        }))
        toaster.create({title: 'Access Token', description: `Revoke access token request sent.`, type: 'info'})
    }

    const openAuthLink = () => {
        const url = new URL('https://accounts.zoho.com/oauth/v2/auth')
        url.searchParams.append('scope', 'ZohoProjects.search.READ,ZohoProjects.timesheets.CREATE')
        url.searchParams.append('client_id', process.env.NEXT_PUBLIC_ZOHO_CLIENT_ID || '')
        url.searchParams.append('response_type', 'code')
        url.searchParams.append('access_type', 'offline')
        url.searchParams.append('prompt', 'consent')
        url.searchParams.append('redirect_uri', process.env.NEXT_PUBLIC_ZOHO_REDIRECT_URI || '')
        window.open(url, '_self')
    }

    const formatTimeLogDataDate = (dateValue: string | number) => {
        const date = new Date(dateValue)

        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');

        return `${month}-${day}-${year}`;
    }

    const formatTimeLogDataTime = (milliseconds: number) => {
        const totalSeconds = Math.floor(milliseconds / 1000);
        const totalMinutes = Math.floor(totalSeconds / 60);
        const hours = Math.floor(totalMinutes / 60);
        const minutes = totalMinutes % 60;

        const formattedHours = String(hours).padStart(1, '0');
        const formattedMinutes = String(minutes).padStart(1, '0');

        return `${formattedHours}:${formattedMinutes}`;
    }

    const formatTimeLogData = (activity: Activity, options: ActivityOptions) => {
        const data: TimeLogData = {
            date: formatTimeLogDataDate(options.date || Date.now()),
            billStatus: 'Billable',
            hours: formatTimeLogDataTime(activity.offset),
            customFields: {
                UDF_CHAR2: options.type || '',
                UDF_CHAR1: options.department || ''
            },
            taskId: '',
            projectId: ''
        }
        if (options.notes) {
            data.notes = options.notes
        }
        return data
    }

    const fetchSearchTask = async (key: string, oAuth2: OAuth2, useCache: boolean = true) => {
        if (useCache && tasks[key]) {
            return tasks[key]
        }
        const response = await fetch(`/api/zoho/search/task?key=${key}`, { headers: { 'Authorization': `Bearer ${oAuth2.accessToken}` } })
        const { projectId, id, ...rest } = await response.json()
        if (!projectId) {
            throw new Error(`Missing project id in response: \n${JSON.stringify(rest, null, 2)}`)
        }
        if (!id) {
            throw new Error(`Missing id in response: \n${JSON.stringify(rest, null, 2)}`)
        }
        const task = { projectId: String(projectId), id: String(id) }
        setTasks(prevState => ({
            ...prevState,
            [key]: task
        }))
        return task
    }

    const commitActivity = (name: string, activity: Activity, useOverwrites: boolean = false) => {
        updateAppState({
            isSendingSavingRequest: {
                ...isSendingSavingRequest,
                [name]: true
            }
        })
        const options = {
            ...activity.options,
            ...(!useOverwrites ? {} : Object.fromEntries(Object.entries(activity.overwrites || {}).filter(([name, value]) => !!value && !!name)))
        }
        options.notes = (options.notes || '').replaceAll('\n', '<br>')
        return new Promise<void>(async (resolve, reject) => {
            let errorMessage = null
            const newOAuth2 = await authMiddleware(OAuth2)
            const task = await fetchSearchTask(options.key || '', newOAuth2)
            if (!task) {
                errorMessage = `Unable to find the task with the key ${options.key}`
            } else {
                try {
                    const data: TimeLogData = { ...formatTimeLogData(activity, options), taskId: task.id, projectId: task.projectId }
                    const link = await fetchAddTaskTimeLog(data, newOAuth2)
                    setActivities(prevState => ({
                        ...prevState,
                        [name]: { ...activity, overwrites: (useOverwrites ? {} : activity.overwrites), offset: 0 }
                    }))
                    toaster.create({
                        title: 'Time Log Added',
                        description: `Time log was added to the task ${options.key}`,
                        action: {
                            label: 'Open Task',
                            onClick: () => window.open(link, '_blank')?.focus(),
                        },
                        duration: 7500,
                        type: 'success'
                    })
                } catch (e) {
                    errorMessage = String(e)
                }
            }
            updateAppState({
                isGeneratingRefreshToken: false,
                isSendingSavingRequest: {
                    ...isSendingSavingRequest,
                    [name]: false
                }
            })
            if (errorMessage) {
                toaster.create({
                    title: 'Time Log',
                    description: `Failed to add time log for the task. Error: ${errorMessage}`,
                    type: 'error'
                })
                return reject(errorMessage)
            }
            return resolve()
        })
    }

    const fetchAddTaskTimeLog = async (data: TimeLogData, oAuth2: OAuth2) => {
        const response = await fetch(`/api/zoho/log/task`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${oAuth2.accessToken}`
            },
            body: JSON.stringify(data)
        })
        const { link, ...rest } = await response.json()
        if (link) {
            return link
        } else {
            throw new Error(`Unknown error. Response: ${JSON.stringify(rest, null, 2)}`)
        }
    }

    return {
        fetchGenerateAccessToken,
        openAuthLink,
        commitActivity,
        fetchRevokeToken,
    }
}

export { useZoho }
