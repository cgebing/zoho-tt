import { useContext } from 'react'
import { PersistentAppContext } from '@/context/persistent-app-context'
import TrackerView from '@/components/view/tracker-view'
import ConnectView from '@/components/view/connect-view'

export default function CurrentView() {
    const { OAuth2 } = useContext(PersistentAppContext)

    return (
        <>
            {OAuth2.accessToken ? <TrackerView /> : <ConnectView/>}
        </>
    )
}
