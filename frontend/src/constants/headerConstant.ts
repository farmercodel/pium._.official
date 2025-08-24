import {
    DocumentChartBarIcon,
    BookOpenIcon,
} from '@heroicons/react/24/outline'

import { PhoneIcon, PlayCircleIcon } from '@heroicons/react/20/solid'

const LOGO_ITEMS = {
    name: 'LOGO',
    url: 'assets/logo.png',
    alt: 'PIUM_LOGO'
} as const

const MAIN_NAVIGATION_ITEMS = [
    {
        name: 'AI',
        navigationText: 'ai',
    },
    {
        name: 'Plans',
        navigationText: 'plans',
    },
    {
        name: 'Preview',
        navigationText: 'preview',
    },
    {
        name: 'About',
        navigationText: 'about',
    },
    {
        name: 'Login',
        navigationText: 'login',
    },
    {
        name: 'Sign Up',
        navigationText: 'sign up',
    },
] as const

const POPUP_NAVIGATION_ITEMS = [
    {
        name: '마케팅 생성', 
        description: '마케팅 관련 콘텐츠 생성', 
        navigationText: 'survey', 
        icon: DocumentChartBarIcon
    },
    { 
        name: '가이드', 
        description: 'Product 사용 가이드', 
        navigationText: 'guide', 
        icon: BookOpenIcon 
    },
] as const

const POPUP_ACTION_ITEMS = [
    { 
        name: 'Watch demo', 
        navigationText: 'watchDemo', 
        icon: PlayCircleIcon 
    },
    { 
        name: 'Contact sales', 
        navigationText: 'main', 
        icon: PhoneIcon 
    },
] as const

export { 
    LOGO_ITEMS, 
    MAIN_NAVIGATION_ITEMS, 
    POPUP_NAVIGATION_ITEMS, 
    POPUP_ACTION_ITEMS 
}