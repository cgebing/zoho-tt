'use client'

import { Container, Card, Heading } from "@chakra-ui/react"
import { Toaster } from '@/components/ui/toaster'
import { PersistentAppContextProvider } from '@/context/persistent-app-context-provider'
import { AppContextProvider } from '@/context/app-context-provider'
import CurrentView from '@/components/view/current-view'
import Header from '@/components/layout/header'

export default function Page() {
    return (
        <PersistentAppContextProvider>
            <AppContextProvider>
                <Container maxW="4xl">
                    <Header />
                    <Card.Root my="6">
                        <Card.Header>
                            <Heading textAlign="center">Zoho Time Tracking</Heading>
                        </Card.Header>
                        <Card.Body>
                            <CurrentView />
                        </Card.Body>
                    </Card.Root>
                </Container>
                <Toaster />
            </AppContextProvider>
        </PersistentAppContextProvider>
    )
}
