import { ColorModeButton, useColorMode } from '@/components/ui/color-mode'
import { Flex, IconButton } from '@chakra-ui/react'
import { ReactComponent as GithubLight } from "../../assets/svg/github-mark-white.svg";
import { ReactComponent as GithubDark } from "../../assets/svg/github-mark.svg";

export default function Header() {
    const { colorMode } = useColorMode()
    return (
        <Flex justify="flex-end">
            <ColorModeButton />
            <IconButton onClick={() => window.open('https://github.com/cgebing/zoho-tt', '_blank')} variant="ghost" size="sm">
                { colorMode === 'light' ? <GithubDark width="1em" height="1em" /> : <GithubLight width="1em" height="1em" /> }
            </IconButton>
        </Flex>
    )
}
