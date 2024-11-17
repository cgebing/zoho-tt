import { Tabs } from "@chakra-ui/react"
import { ClipboardCheck, Settings, Clipboard, } from 'lucide-react'
import ActivitiesTab from '@/components/tabs/activities-tab'
import CompletedTab from '@/components/tabs/completed-tab'
import SettingsTab from '@/components/tabs/settings-tab'

export default function TrackerView() {
    return (
        <Tabs.Root defaultValue="activities" variant="subtle" fitted>
            <Tabs.List>
                <Tabs.Trigger value="activities">
                    <Clipboard /> Activities
                </Tabs.Trigger>
                <Tabs.Trigger value="completed">
                    <ClipboardCheck /> Completed
                </Tabs.Trigger>
                <Tabs.Trigger value="settings">
                    <Settings /> Settings
                </Tabs.Trigger>
            </Tabs.List>
            <Tabs.Content value="activities"><ActivitiesTab /></Tabs.Content>
            <Tabs.Content value="completed"><CompletedTab /></Tabs.Content>
            <Tabs.Content value="settings"><SettingsTab /></Tabs.Content>
        </Tabs.Root>
    )
}
