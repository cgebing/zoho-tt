import React from 'react'

export interface AppState {
    searchQuery: string
    isGeneratingAccessToken: boolean
    isGeneratingRefreshToken: boolean
    isSendingSavingRequest: { [key: string]: boolean }
    updateAppState: (newState: Partial<AppState>) => void
}

const defaultState: AppState = {
    searchQuery: '',
    isGeneratingAccessToken: false,
    isGeneratingRefreshToken: false,
    isSendingSavingRequest: {},
    updateAppState: (newState: Partial<AppState>) => {
        return newState
    },
}

export const AppContext = React.createContext<AppState>(defaultState)
