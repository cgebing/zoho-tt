import React from 'react'
import { PersistentAppContext, OAuth2, Activities, Tasks } from './persistent-app-context'
import useLocalStorageState from 'use-local-storage-state'

interface Props {
    children: React.ReactNode
}

export const PersistentAppContextProvider: React.FunctionComponent<Props> = (props: Props): React.JSX.Element => {
    const [tasks, setTasks] = useLocalStorageState<Tasks>('zoho_tt/tasks', {
        defaultValue: {
        }
    })
    const [activities, setActivities] = useLocalStorageState<Activities>('zoho_tt/activities', {
        defaultValue: {
        }
    })
    const [OAuth2, setOAuth2] = useLocalStorageState<OAuth2>('zoho_tt/oauth2', {
        defaultValue: {
        }
    })

    return (
        <PersistentAppContext.Provider value={{ tasks, setTasks, activities, setActivities, OAuth2, setOAuth2 }}>{props.children}</PersistentAppContext.Provider>
    )
}
