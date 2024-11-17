import { useContext } from 'react'
import { toaster } from '@/components/ui/toaster'
import { Activity, ActivityOptions, PersistentAppContext } from '@/context/persistent-app-context'

const useActivities = () => {
    const { activities, setActivities } = useContext(PersistentAppContext)

    const add = (name: string) => {
        if (activities[name]) {
            toaster.create({title: 'Activity already exists', description: 'Please choose a different name for your new activity.', type: 'error'})
            return false
        } else {
            setActivities(prevState => ({
                [name]: {
                    isTracking: false,
                    isCompleted: false,
                    startTime: 0,
                    offset: 0,
                    overwrites: {},
                    options: {},
                },
                ...prevState,
            }))
            toaster.create({title: 'New activity added', description: `${name} has been added to your tracking list.`, type: 'info'})
            return true
        }
    }

    const remove = (name: string) => {
        delete activities[name]
        setActivities(activities)
        toaster.create({title: 'Activity removed', description: `${name} has been removed from your tracking list.`, type: 'info'})
    }

    const removeCompleted = () => {
        setActivities(Object.fromEntries(Object.entries(activities).filter(([name, activity]) => !activity.isCompleted && name)))
        toaster.create({title: 'Activities removed', description: `All completed activities have been removed.`, type: 'info'})
    }

    const complete = (name: string) => {
        setActivities(prevState => ({
            ...prevState,
            [name]: {...prevState[name], isCompleted: true}
        }))
        toaster.create({title: 'Activity completed', description: `${name} has been marked as completed.`, type: 'info'})
    }

    const unComplete = (name: string) => {
        setActivities(prevState => ({
            ...prevState,
            [name]: {...prevState[name], isCompleted: false}
        }))
        toaster.create({title: 'Activity moved back', description: `${name} has been moved back to active activities.`, type: 'info'})
    }

    const update = (name: string, activity: Activity) => {
        setActivities(prevState => ({
            ...prevState,
            [name]: {...prevState[name], ...activity}
        }))
    }

    const pause = (name: string) => {
        const activity = activities[name]
        const newOffset = activity.startTime !== 0 ?
            activity.offset + (new Date().setMilliseconds(0)) - activity.startTime :
            activity.offset
        setActivities(prevState => ({
            ...prevState,
            [name]: {...prevState[name], ...{offset: newOffset, startTime: 0, isTracking: false}}
        }))
    }

    const start = (name: string) => {
        setActivities(prevState => ({
            ...prevState,
            [name]: {...prevState[name], ...{isTracking: true, startTime: new Date().setMilliseconds(0)}}
        }))
    }

    const reset = (name: string) => {
        setActivities(prevState => ({
            ...prevState,
            [name]: {...prevState[name], ...{offset: 0, startTime: 0, isTracking: false}}
        }))
    }

    const addTime = (name: string, millis: number) => {
        setActivities(prevState => ({
            ...prevState,
            [name]: {...prevState[name], ...{offset: (prevState[name].offset || 0) + millis}}
        }))
    }

    const updateOptions = (name: string, options: ActivityOptions) => {
        setActivities(prevState => ({
            ...prevState,
            [name]: {...prevState[name], options: {...(prevState[name].options || {}), ...options}}
        }))
    }

    const updateOverwrites = (name: string, options: ActivityOptions) => {
        setActivities(prevState => ({
            ...prevState,
            [name]: {...prevState[name], overwrites: {...(prevState[name].overwrites || {}), ...options}}
        }))
    }

    return {
        add,
        remove,
        unComplete,
        update,
        updateOptions,
        updateOverwrites,
        complete,
        pause,
        start,
        reset,
        addTime,
        removeCompleted
    }
}

export { useActivities }
