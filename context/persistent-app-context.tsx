import React, { SetStateAction } from 'react'

export interface ActivityOptions {
    duration?: number
    key?: string
    notes?: string
    type?: string
    department?: string
    date?: string
}

export interface Activity {
    overwrites?: ActivityOptions
    options: ActivityOptions
    isTracking: boolean
    startTime: number
    offset: number
    isCompleted: boolean
}

export interface Activities {
    [key: string]: Activity
}

export interface OAuth2 {
    accessToken?: string
    refreshToken?: string
    expireDate?: number
}

export interface Task {
    id: string,
    projectId: string
}

export interface Tasks { [key: string]: Task; }

export interface PersistentAppState {
    activities: Activities
    OAuth2: OAuth2
    tasks: Tasks
    setActivities: React.Dispatch<SetStateAction<Activities>>
    setTasks: React.Dispatch<SetStateAction<Tasks>>
    setOAuth2: React.Dispatch<SetStateAction<OAuth2>>
}

const defaultState: PersistentAppState = {
    activities: {},
    OAuth2: {},
    tasks: {},
    setActivities: () => {},
    setTasks: () => {},
    setOAuth2: () => {},
}

export const PersistentAppContext = React.createContext<PersistentAppState>(defaultState)
