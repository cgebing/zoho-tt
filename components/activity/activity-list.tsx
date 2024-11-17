import {
    AccordionItem,
    AccordionItemContent,
    AccordionItemTrigger,
    AccordionRoot,
} from "@/components/ui/accordion"
import { Box, Flex } from '@chakra-ui/react'
import ActivityControls from '@/components/activity/activity-controls'
import { useContext } from 'react'
import ActivityForm from '@/components/activity/activity-form'
import { PersistentAppContext } from '@/context/persistent-app-context'
import { AppContext } from '@/context/app-context'
import ActivityTimerActive from '@/components/activity/activity-timer-active'
import ActivityTimerInactive from '@/components/activity/activity-timer-inactive'

export default function ActivityList() {
    const { activities } = useContext(PersistentAppContext)
    const { searchQuery } = useContext(AppContext)

    const filteredActivities = Object.entries(activities).filter(([activity, state]) =>
        {
            return !state.isCompleted && activity.toLowerCase().includes(searchQuery.toLowerCase())
        }
    )

    return (
        <AccordionRoot collapsible variant="outline">
            {filteredActivities.map(([name, activity]) => (
                <AccordionItem key={name} value={name}>
                    <AccordionItemTrigger cursor="pointer">
                        <Flex justify="space-between" align={'baseline'} width="100%" px={1} gap={4}>
                            <div>{name}</div>
                            { activity.isTracking ? <ActivityTimerActive activity={activity} /> : <ActivityTimerInactive activity={activity} /> }
                        </Flex>
                    </AccordionItemTrigger>
                    <Box pb="4" px={1}>
                        <ActivityControls name={name} activity={activity} />
                    </Box>
                    <AccordionItemContent>
                        <Box mt="-2"><ActivityForm name={name} options={activity.options} /></Box>
                    </AccordionItemContent>
                </AccordionItem>
            ))}
        </AccordionRoot>
    )
}
