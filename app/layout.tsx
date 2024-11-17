import { Provider } from "@/components/ui/provider"
import { Inter } from "next/font/google"
import { Metadata } from 'next'
import { ClientOnly } from '@chakra-ui/react'
import { SpeedInsights } from '@vercel/speed-insights/next';

const inter = Inter({
    subsets: ["latin"],
    display: "swap",
})

export const metadata: Metadata = {
    title: 'Zoho Time Tracker',
    robots: {
        index: false,
        follow: false,
    }
}

export default function RootLayout(props: { children: React.ReactNode }) {
    const {children} = props
    return (
        <html className={inter.className} suppressHydrationWarning lang="en">
        <body>
        <Provider>
            <ClientOnly>
                {children}
            </ClientOnly>
        </Provider>
        <SpeedInsights />
        </body>
        </html>
    )
}
