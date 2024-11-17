import { Input, Flex, Stack, Button } from "@chakra-ui/react"
import { Plus } from 'lucide-react'
import ActivityList from '@/components/activity/activity-list'
import ActivitySearch from '@/components/activity/activity-search'
import { useActivities } from '@/hooks/use-activities'
import { FormEvent, useState } from 'react'

export default function ActivitiesTab() {
    const {add} = useActivities()
    const [activityName, setActivityName] = useState<string>('')
    const handleAddActivitySubmit = (e: FormEvent) => {
        e.preventDefault()
        if (add(activityName)) {
            setActivityName('')
        }
    }
    return (
        <Stack gap="4">
            <ActivitySearch />
            <form onSubmit={e => handleAddActivitySubmit(e)}>
                <Flex align="center" gap="2" px={1}>
                    <Input placeholder="New Activitiy" variant="outline" value={activityName} onChange={e => setActivityName(e.target.value)}  />
                    <Button type="submit" variant="subtle"><Plus /> Add</Button>
                </Flex>
            </form>
            <ActivityList />
        </Stack>
    )
}
