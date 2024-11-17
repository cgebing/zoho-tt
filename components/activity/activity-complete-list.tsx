import { useActivities } from '@/hooks/use-activities'
import { Box, Flex, HStack, Stack, Text } from '@chakra-ui/react'
import { Button } from '@/components/ui/button'
import { ArrowLeftCircle, Trash } from 'lucide-react'
import { useContext } from 'react'
import { PersistentAppContext } from '@/context/persistent-app-context'

export default function ActivityCompleteList() {
    const { removeCompleted, remove, unComplete } = useActivities()
    const { activities } = useContext(PersistentAppContext)
    const completedActivities = Object.entries(activities).filter(([activity, state]) =>
        state.isCompleted && activity !== ''
    )
    if (completedActivities.length === 0) {
        return (
            <Box textAlign={'center'} background={'bg.subtle'} borderRadius=".5rem" py={4}>
                <Text fontSize={'md'}>No completed activities yet.</Text>
            </Box>
        )
    }
    return (
        <Stack>
            <Box textAlign={'right'}>
                <Button colorPalette={'red'} size={'xs'} variant={'subtle'} onClick={() => removeCompleted()}><Trash />Delete all</Button>
            </Box>
            {completedActivities.map(([name]) => (
                <Box key={name} background={'bg.subtle'} borderRadius=".5rem" px={4} py={2}>
                    <Flex justify={'space-between'} align={'baseline'}>
                        <Text>{name}</Text>
                        <HStack>
                            <Button size={'xs'} variant={'subtle'} onClick={() => unComplete(name)}><ArrowLeftCircle />Move back</Button>
                            <Button colorPalette={'red'} size={'xs'} variant={'subtle'} onClick={() => remove(name)}><Trash /></Button>
                        </HStack>
                    </Flex>
                </Box>
            ))}
        </Stack>
    )
}
