import { Button } from "@/components/ui/button"
import { useZoho } from '@/hooks/use-zoho'
import { useContext, useEffect } from 'react'
import { toaster } from "@/components/ui/toaster"
import { AppContext } from '@/context/app-context'

export default function ConnectView() {
    const { isGeneratingAccessToken } = useContext(AppContext)
    const { openAuthLink, fetchGenerateAccessToken } = useZoho()
    useEffect(() => {
        const currentURL = new URL(window.location.toString())
        const code = currentURL.searchParams.get('code') || ''
        if (code) {
            window.history.pushState({}, document.title, '/')
            fetchGenerateAccessToken(code)
                .catch(e => toaster.create({title: 'Access token', description: e, type: 'error'}))
        }
    }, [fetchGenerateAccessToken])
    return (
        <Button onClick={() => openAuthLink()} loading={isGeneratingAccessToken} loadingText="Generating Access Token...">
            Connect
        </Button>
    )
}
