import {
    DocumentChartBarIcon,
    BookOpenIcon,
/*
    ArrowPathIcon,
    FingerPrintIcon,
    SquaresPlusIcon,
*/
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
        name: 'AI',
        navigationIndex: 0,
    },
    {
        name: 'Preview',
        navigationIndex: 1,
    },
    {
        name: 'Marketplace',
        navigationIndex: 2,
    },
    {
        name: 'About',
        navigationIndex: 3,
    },
] as const

const POPUP_NAVIGATION_ITEMS = [
    {
        name: '마케팅 생성', 
        description: '마케팅 관련 콘텐츠 생성', 
        navigationIndex: 4, 
        icon: DocumentChartBarIcon
    },
    { 
        name: '가이드', 
        description: 'Product 사용 가이드', 
        navigationIndex: 7, 
        icon: BookOpenIcon 
    },
/*
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
*/
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

export { 
    LOGO_ITEMS, 
    MAIN_NAVIGATION_ITEMS, 
    POPUP_NAVIGATION_ITEMS, 
    POPUP_ACTION_ITEMS 
}