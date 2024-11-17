import { useActivities } from '@/hooks/use-activities'
import {
    SimpleGrid,
    Input,
    Stack, HStack
} from '@chakra-ui/react'
import { Field } from '@/components/ui/field'
import { createListCollection } from "@chakra-ui/react"
import {
    SelectContent,
    SelectItem,
    SelectLabel,
    SelectRoot,
    SelectTrigger,
    SelectValueText,
} from "@/components/ui/select"
import { Textarea, Text } from "@chakra-ui/react"
import { ActivityOptions } from '@/context/persistent-app-context'
import { FormEvent, useContext } from 'react'
import { AppContext } from '@/context/app-context'

interface ActivityFormProps {
    name: string
    options: ActivityOptions
    isOverwrites?: boolean
    onSubmit?: () => void
}

export default function ActivityForm(props: ActivityFormProps) {
    const { isSendingSavingRequest } = useContext(AppContext)
    const typesCollection = createListCollection({
        items: [
            { label: 'Task Bearbeitung', value: 'Task Bearbeitung' },
            { label: 'Ausschreibung', value: 'Ausschreibung' },
            { label: 'Akquise', value: 'Akquise' },
            { label: 'Abstimmung intern', value: 'Abstimmung intern' },
            { label: 'Abstimmung extern', value: 'Abstimmung extern' },
            { label: 'Testing', value: 'Testing' },
            { label: 'Maintenance', value: 'Maintenance' },
            { label: 'Schooling', value: 'Schooling' },
            { label: 'Bugfix', value: 'Bugfix' },
        ],
    })
    const department = createListCollection({
        items: [
            { label: 'Entwicklung', value: 'Entwicklung' },
            { label: 'IoT', value: 'IoT' },
            { label: 'Grafik', value: 'Grafik' },
            { label: 'PM', value: 'PM' },
            { label: 'Kundenbetreuung', value: 'Kundenbetreuung' },
            { label: 'QS', value: 'QS' },
            { label: 'Vertrieb', value: 'Vertrieb' },
            { label: 'intern PM', value: 'intern PM' },
        ],
    })
    const {
        updateOptions,
        updateOverwrites
    } = useActivities()
    const update = props.isOverwrites ? updateOverwrites : updateOptions
    const handleDurationChange = (value: string) => {
        update(props.name, { duration: parseInt(value) })
    }
    const handleKeyChange = (value: string) => {
        update(props.name, { key: value })
    }
    const handleDateChange = (value: string) => {
        update(props.name, { date: value })
    }
    const handleTypeChange = (value: string) => {
        update(props.name, { type: value })
    }
    const handleDepartmentChange = (value: string) => {
        update(props.name, { department: value })
    }
    const handleNotesChange = (value: string) => {
        update(props.name, { notes: value })
    }
    const handleSubmit = (e: FormEvent) => {
        e.preventDefault()
        if (props.onSubmit) {
            props.onSubmit()
        }
    }

    return (
        <form onSubmit={e => handleSubmit(e)}>
            <Stack px="1" gap={4}>
                <SimpleGrid columns={2} gap={4}>
                    <Field label="Task Key (e.g. A28P-T971)" required={!props.isOverwrites}>
                        <Input value={props.options.key || ''} onChange={e => handleKeyChange(e.target.value)} disabled={isSendingSavingRequest[props.name]} />
                    </Field>
                    { !props.isOverwrites && <Field label="Custom Duration Button (minutes)">
                      <Input value={props.options.duration || ''} onChange={e => handleDurationChange(e.target.value)} disabled={isSendingSavingRequest[props.name]} />
                    </Field> }
                    <Field label="Date (Default: Today)">
                        <Input type="date" value={props.options.date || ''} onChange={e => handleDateChange(e.target.value)} disabled={isSendingSavingRequest[props.name]} />
                    </Field>
                    <SelectRoot collection={typesCollection} value={props.options.type ? [props.options.type] : undefined} onValueChange={details => handleTypeChange(details.value[0] || '')} disabled={isSendingSavingRequest[props.name]}>
                        <SelectLabel><HStack gap={1}><Text>Activity</Text>{!props.isOverwrites && <Text color="red">*</Text>}</HStack></SelectLabel>
                        <SelectTrigger clearable>
                            <SelectValueText placeholder="Select a activity" />
                        </SelectTrigger>
                        <SelectContent zIndex={3000}>
                            {typesCollection.items.map((type) => (
                                <SelectItem item={type} key={type.value} _hover={ { bg: 'bg.subtle' } }>
                                    {type.label}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </SelectRoot>
                    <SelectRoot collection={department} value={props.options.department ? [props.options.department] : undefined} onValueChange={details => handleDepartmentChange(details.value[0] || '')} disabled={isSendingSavingRequest[props.name]}>
                        <SelectLabel>Department</SelectLabel>
                        <SelectTrigger clearable>
                            <SelectValueText placeholder="Select a department" />
                        </SelectTrigger>
                        <SelectContent zIndex={3000}>
                            {department.items.map((department) => (
                                <SelectItem item={department} key={department.value} _hover={ { bg: 'bg.subtle' } }>
                                    {department.label}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </SelectRoot>
                </SimpleGrid>
                <Field label="Comment">
                    <Textarea value={props.options.notes} onChange={e => handleNotesChange(e.target.value)} disabled={isSendingSavingRequest[props.name]} />
                </Field>
            </Stack>
        </form>
    )
}
