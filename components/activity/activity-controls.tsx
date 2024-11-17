import { useActivities } from '@/hooks/use-activities'
import { Box, Flex, Heading, HStack, Text } from '@chakra-ui/react'
import { Check, Pause, Pencil, Play, RotateCcw, Save } from 'lucide-react'
import ActivityForm from '@/components/activity/activity-form'
import {
    PopoverArrow,
    PopoverBody,
    PopoverContent,
    PopoverRoot,
    PopoverTitle,
    PopoverTrigger,
} from "@/components/ui/popover"
import { Button } from "@/components/ui/button"
import { useZoho } from '@/hooks/use-zoho'
import { useContext } from 'react'
import { AppContext } from '@/context/app-context'
import { Activity } from '@/context/persistent-app-context'

interface ActivityControlProps {
    name: string,
    activity: Activity,
}
export default function ActivityControls(props: ActivityControlProps) {
    const {
        complete,
        pause,
        start,
        reset,
        addTime,
    } = useActivities()
    const { commitActivity } = useZoho()
    const { isGeneratingRefreshToken, isSendingSavingRequest } = useContext(AppContext)

    const missingRequiredParameters = () => {
        return !(props.activity.options.key && props.activity.options.type && props.activity.offset > 60000)
    }

    const missingRequiredParametersForOverwrite = () => {
        return !(
            (props.activity.options.key || props.activity.overwrites?.key) &&
            (props.activity.options.type || props.activity.overwrites?.type) &&
            props.activity.offset > 60000
        )
    }

    const handleSave = (useOverwrite: boolean = false) => {
        commitActivity(props.name, props.activity, useOverwrite)
    }

    return (
        <Flex justify="space-between" width="100%">
            <HStack>
                <Button
                    size="xs"
                    variant="subtle"
                    onClick={() => complete(props.name)}
                    disabled={isSendingSavingRequest[props.name] || props.activity.isTracking}
                >
                    <Check /> Complete
                </Button>
                <PopoverRoot positioning={{ placement: 'bottom-start' }}>
                    <PopoverTrigger asChild>
                        <Button
                            size="xs"
                            variant="subtle"
                            disabled={isSendingSavingRequest[props.name] || props.activity.isTracking}
                        >
                            <Pencil /> Quick-Edit
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent width={'2xl'}>
                        <PopoverArrow />
                        <PopoverBody>
                            <PopoverTitle asChild>
                                <Box px={1}>
                                    <Heading size="md" mb="2">Quick Edit</Heading>
                                    <Text fontSize="xs" color="fg.muted" mb="4">
                                        Override the default options with temporary values. These values are reset after the form is submitted.
                                    </Text>
                                </Box>
                            </PopoverTitle>
                            <ActivityForm name={props.name} options={props.activity.overwrites || {}} isOverwrites={true} onSubmit={missingRequiredParametersForOverwrite() ? undefined : () => handleSave(true)} />
                            <HStack px={1} mt={4} justify={'flex-end'}>
                                <Button
                                    disabled={isSendingSavingRequest[props.name] || props.activity.isTracking || missingRequiredParametersForOverwrite()}
                                    loading={isSendingSavingRequest[props.name]}
                                    loadingText={isGeneratingRefreshToken ? 'Generating access token...' : 'Sending...'}
                                    onClick={() => handleSave(true)}
                                ><Save /> Send</Button>
                            </HStack>
                        </PopoverBody>
                    </PopoverContent>
                </PopoverRoot>

                <Button
                    size="xs"
                    variant="solid"
                    onClick={() => handleSave()}
                    disabled={isSendingSavingRequest[props.name] || props.activity.isTracking || missingRequiredParameters()}
                    loading={isSendingSavingRequest[props.name]}
                    loadingText={isGeneratingRefreshToken ? 'Generating access token...' : 'Sending...'}
                >
                    <Save /> Send
                </Button>
            </HStack>
            <HStack>
                <Button
                    size="xs"
                    variant="subtle"
                    onClick={() => props.activity.isTracking ? pause(props.name) : start(props.name)}
                    disabled={isSendingSavingRequest[props.name]}
                >
                    {props.activity.isTracking ? <Pause/> : <Play/>}
                </Button>
                <Button
                    size="xs"
                    variant="subtle"
                    onClick={() => reset(props.name)}
                    disabled={isSendingSavingRequest[props.name] || props.activity.isTracking}
                >
                    <RotateCcw />
                </Button>
                <Button
                    size="xs"
                    variant="subtle"
                    onClick={() => addTime(props.name, 5 * 60000)}
                    disabled={isSendingSavingRequest[props.name]}
                >
                    +5m
                </Button>
                <Button
                    size="xs"
                    variant="subtle"
                    onClick={() => addTime(props.name, 30 * 60000)}
                    disabled={isSendingSavingRequest[props.name]}
                >
                    +30m
                </Button>
                <Button
                    size="xs"
                    variant="subtle"
                    onClick={() => addTime(props.name, 60 * 60000)}
                    disabled={isSendingSavingRequest[props.name]}
                >
                    +60m
                </Button>
                {props.activity.options.duration && (
                    <Button
                        size="xs"
                        variant="subtle"
                        onClick={() => addTime(props.name, (props.activity.options.duration || 0) * 60000)}
                        disabled={isSendingSavingRequest[props.name]}
                    >
                        +{props.activity.options.duration}m
                    </Button>
                )}
            </HStack>
        </Flex>
    )
}
