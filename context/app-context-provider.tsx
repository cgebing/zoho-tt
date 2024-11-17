import React, { useState } from 'react'
import { AppState, AppContext } from './app-context'

interface Props {
    children: React.ReactNode
}

export const AppContextProvider: React.FunctionComponent<Props> = (props: Props): React.JSX.Element => {
    const [state, setState] = useState({
        searchQuery: '',
        isGeneratingAccessToken: false,
        isGeneratingRefreshToken: false,
        isSendingSavingRequest: {},
    })

    const updateAppState = (newState: Partial<AppState>) => {
        setState({ ...state, ...newState })
    }

    return (
        <AppContext.Provider value={{ ...state, updateAppState }}>{props.children}</AppContext.Provider>
    )
}
