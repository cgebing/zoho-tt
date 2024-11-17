import { HStack, Input, Stack, Textarea } from '@chakra-ui/react'
import { Field } from '@/components/ui/field'
import { useZoho } from '@/hooks/use-zoho'
import { Button } from '@/components/ui/button'
import { Trash } from 'lucide-react'
import { useContext } from 'react'
import { PersistentAppContext } from '@/context/persistent-app-context'

export default function SettingsTab() {
    const { OAuth2, activities, setActivities } = useContext(PersistentAppContext)
    const { fetchRevokeToken } = useZoho()
    const handleJsonConfigChange = (value: string) => {
        try {
            setActivities(JSON.parse(value))
        } catch {
        }
    }
    return (
        <Stack>
            <Field label="Zoho Access Token" >
                <HStack width="100%">
                    <Input value={OAuth2.accessToken} disabled />
                    <Button onClick={() => fetchRevokeToken()} colorPalette={'red'} size={'sm'} variant={'subtle'}><Trash/> Revoke access token</Button>
                </HStack>
            </Field>
            <Field label="Zoho Refresh Token" >
                <Input value={OAuth2.refreshToken} disabled />
            </Field>
            <Field label="Zoho Token Expire Date" >
                <Input value={new Date(OAuth2.expireDate || '').toString()} disabled />
            </Field>
            <Field label="Activities">
                <Textarea rows={20} value={JSON.stringify(Object.assign({}, activities), null, 2)} onChange={e => handleJsonConfigChange(e.target.value)} />
            </Field>
        </Stack>
    )
}
