import { Activity } from '@/context/persistent-app-context'
import { HStack, Text } from '@chakra-ui/react'
import { Status } from '@/components/ui/status'

interface ActivityTimerInactiveProps {
    activity: Activity
}

export default function ActivityTimerInactive(props: ActivityTimerInactiveProps) {
    const formatElapsedTime = () => {
        const ms = (props.activity.offset || 0)
        const hours = Math.floor(ms / (1000 * 60 * 60))
        const minutes = Math.floor((ms % (1000 * 60 * 60)) / (1000 * 60))
        const seconds = Math.floor((ms % (1000 * 60)) / 1000)

        const formattedHours = String(hours).padStart(2, '0')
        const formattedMinutes = String(minutes).padStart(2, '0')
        const formattedSeconds = String(seconds).padStart(2, '0')

        return `${formattedHours}:${formattedMinutes}:${formattedSeconds}`
    }

    return (
        <HStack>
            <Status colorPalette={'lightGray'}/>
            <Text fontFamily="monospace">{formatElapsedTime()}</Text>
        </HStack>
    )
}
