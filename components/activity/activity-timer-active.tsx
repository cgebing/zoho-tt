import { Activity } from '@/context/persistent-app-context'
import { HStack, Text } from '@chakra-ui/react'
import { Status } from '@/components/ui/status'
import { useEffect, useState } from 'react'

interface ActivityTimerActiveProps {
    activity: Activity
}

export default function ActivityTimerActive(props: ActivityTimerActiveProps) {
    const [elapsedTime, setElapsedTime] = useState(0)
    const formatElapsedTime = () => {
        const ms = elapsedTime + (props.activity.offset || 0)
        const hours = Math.floor(ms / (1000 * 60 * 60))
        const minutes = Math.floor((ms % (1000 * 60 * 60)) / (1000 * 60))
        const seconds = Math.floor((ms % (1000 * 60)) / 1000)

        const formattedHours = String(hours).padStart(2, '0')
        const formattedMinutes = String(minutes).padStart(2, '0')
        const formattedSeconds = String(seconds).padStart(2, '0')

        return `${formattedHours}:${formattedMinutes}:${formattedSeconds}`
    }
    useEffect(() => {
        const interval = setInterval(() => {
            setElapsedTime(Date.now() - props.activity.startTime)
        }, 1000)
        return () => clearInterval(interval)
    }, [setElapsedTime, props.activity])
    return (
        <HStack>
            <Status value="success" animation="pulse"/>
            <Text fontFamily="monospace">{formatElapsedTime()}</Text>
        </HStack>
    )
}
