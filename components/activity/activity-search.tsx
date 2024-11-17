import { Search } from 'lucide-react'
import { Flex, Input } from '@chakra-ui/react'
import { useContext } from 'react'
import { AppContext } from '@/context/app-context'

export default function ActivitySearch() {
    const { searchQuery, updateAppState } = useContext(AppContext)
    return (
        <Flex align="center" gap="2" px={1}>
            <Search />
            <Input value={searchQuery} onChange={e => updateAppState({ searchQuery: e.target.value })} placeholder="Search..." variant="outline"  />
        </Flex>
    )
}
