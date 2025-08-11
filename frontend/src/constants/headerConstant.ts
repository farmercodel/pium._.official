import {
    ArrowPathIcon,
    ChartPieIcon,
    CursorArrowRaysIcon,
    FingerPrintIcon,
    SquaresPlusIcon,
} from '@heroicons/react/24/outline'

import { PhoneIcon, PlayCircleIcon } from '@heroicons/react/20/solid'

const LOGO_ITEMS = {
    name: 'LOGO',
    // 임시 uiia cat image
    url: 'https://oiiai.cat/cat.png',
    alt: 'PIUM_LOGO'
} as const

const MAIN_NAVIGATION_ITEMS = [
    {
        name: 'Product',
        navigationIndex: 0,
    },
    {
        name: 'Features',
        navigationIndex: 0,
    },
    {
        name: 'Marketplace',
        navigationIndex: 0,
    },
    {
        name: 'About',
        navigationIndex: 0,
    },
] as const

const POPUP_NAVIGATION_ITEMS = [
    {
        name: 'Analytics', 
        description: 'Get a better understanding of your traffic', 
        navigationIndex: 0, 
        icon: ChartPieIcon
    },
    { 
        name: 'Engagement', 
        description: 'Speak directly to your customers', 
        navigationIndex: 0, 
        icon: CursorArrowRaysIcon 
    },
    {
         name: 'Security', 
         description: 'Your customers’ data will be safe and secure', 
         navigationIndex: 0, 
         icon: FingerPrintIcon 
    },
    { 
        name: 'Integrations', 
        description: 'Connect with third-party tools', 
        navigationIndex: 0, 
        icon: SquaresPlusIcon 
    },
    { 
        name: 'Automations', 
        description: 'Build strategic funnels that will convert', 
        navigationIndex: 0, 
        icon: ArrowPathIcon 
    },
] as const

const POPUP_ACTION_ITEMS = [
    { 
        name: 'Watch demo', 
        navigationIndex: 0, 
        icon: PlayCircleIcon 
    },
    { 
        name: 'Contact sales', 
        navigationIndex: 0, 
        icon: PhoneIcon 
    },
] as const

export { LOGO_ITEMS, MAIN_NAVIGATION_ITEMS, POPUP_NAVIGATION_ITEMS, POPUP_ACTION_ITEMS }