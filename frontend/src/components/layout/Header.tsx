'use client'

import { useState } from 'react'
import {
    Dialog,
    DialogPanel,
    Disclosure,
    DisclosureButton,
    DisclosurePanel,
    Popover,
    PopoverButton,
    PopoverGroup,
    PopoverPanel,
} from '@headlessui/react'
import {
    Bars3Icon,
    XMarkIcon,
} from '@heroicons/react/24/outline'
import { ChevronDownIcon } from '@heroicons/react/20/solid'

import useNavigation from '../../hooks/useNavigation'

import {
    LOGO_ITEMS,
    MAIN_NAVIGATION_ITEMS,
    POPUP_NAVIGATION_ITEMS,
    POPUP_ACTION_ITEMS
} from '../../constants/headerConstant'

import Button from '../common/Button'

function Header() {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
    const {
        goToAdmin,
        goToMain,
        goToPreview,
        goToAbout,
        goToSurvey,
        goToGeneration,
        goToResult,
        goToGuide
    } = useNavigation()

    const navigationMap = {
        'main': goToMain,
        'survey': goToSurvey,
        'preview': goToPreview,
        'about': goToAbout,
        'guide': goToGuide,
        'admin': goToAdmin,
        'generation': goToGeneration,
        'result': goToResult,
    }

    const handleItemClick = (itemName: string) => {
        const navigationFn = navigationMap[itemName as keyof typeof navigationMap]
        if (navigationFn) {
            navigationFn()
        } else {
            console.log("Unknown navigation item:", itemName)
        }
    }

    return (
        <div className="w-full h-19">
            <header className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200 shadow-sm">
                {/** Header */}
                <nav aria-label="Global" className="mx-auto flex max-w-7xl items-center justify-between p-2 lg:px-8">
                    {/** Desktop Header */}
                    <div className="flex lg:flex-1">
                        {/** Logo */}
                        <div
                            className="mx-1.5 px-1.5 cursor-pointer"
                            onClick={() => handleItemClick('main')}
                        >
                            <img src={LOGO_ITEMS.url} alt={LOGO_ITEMS.alt} className="h-15 w-auto" />
                        </div>
                    </div>

                    {/** Mobile Header */}
                    <div className="flex lg:hidden">
                        <Button
                            variant="custom"
                            size="custom"
                            onClick={() => setMobileMenuOpen(true)}
                            className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700"
                        >
                            <Bars3Icon aria-hidden="true" className="size-6" />
                        </Button>
                    </div>

                    {/** Desktop Menu */}
                    <PopoverGroup className="hidden lg:flex lg:gap-x-12">
                        <Popover className="relative">
                            <PopoverButton className="flex items-center gap-x-1 text-sm/6 font-semibold text-gray-900 cursor-pointer">
                                {MAIN_NAVIGATION_ITEMS[0].name}
                                <ChevronDownIcon aria-hidden="true" className="size-5 flex-none text-gray-400" />
                            </PopoverButton>

                            <PopoverPanel
                                transition
                                className="absolute left-1/2 z-10 mt-3 w-screen max-w-md -translate-x-1/2 overflow-hidden rounded-3xl bg-white shadow-lg outline-1 outline-gray-900/5 transition data-closed:translate-y-1 data-closed:opacity-0 data-enter:duration-200 data-enter:ease-out data-leave:duration-150 data-leave:ease-in"
                            >
                                <div className="p-4">
                                    {POPUP_NAVIGATION_ITEMS.map((item) => (
                                        <div
                                            key={item.name}
                                            className="group relative flex items-center gap-x-6 rounded-lg p-4 text-sm/6 hover:bg-gray-50"
                                        >
                                            <div className="flex size-11 flex-none items-center justify-center rounded-lg bg-gray-50 group-hover:bg-white">
                                                <item.icon aria-hidden="true" className="size-6 text-gray-600 group-hover:text-indigo-600" />
                                            </div>
                                            <div className="flex-auto">
                                                <div
                                                    onClick={() => handleItemClick(item.navigationText)}
                                                    className="block font-semibold text-gray-900 cursor-pointer"
                                                >
                                                    {item.name}
                                                    <span className="absolute inset-0" />
                                                </div>
                                                <p className="mt-1 text-gray-600">{item.description}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <div className="grid grid-cols-2 divide-x divide-gray-900/5 bg-gray-50">
                                    {POPUP_ACTION_ITEMS.map((item) => (
                                        <div
                                            key={item.name}
                                            onClick={() => handleItemClick(item.navigationText)}
                                            className="flex items-center justify-center gap-x-2.5 p-3 text-sm/6 font-semibold text-gray-900 hover:bg-gray-100"
                                        >
                                            <item.icon aria-hidden="true" className="size-5 flex-none text-gray-400" />
                                            {item.name}
                                        </div>
                                    ))}
                                </div>
                            </PopoverPanel>
                        </Popover>

                        <div
                            onClick={() => handleItemClick(MAIN_NAVIGATION_ITEMS[1].navigationText)}
                            className="text-sm/6 font-semibold text-gray-900 cursor-pointer"
                        >
                            {MAIN_NAVIGATION_ITEMS[1].name}
                        </div>
                        <div
                            onClick={() => handleItemClick(MAIN_NAVIGATION_ITEMS[2].navigationText)}
                            className="text-sm/6 font-semibold text-gray-900 cursor-pointer"
                        >
                            {MAIN_NAVIGATION_ITEMS[2].name}
                        </div>
                        <div
                            onClick={() => handleItemClick(MAIN_NAVIGATION_ITEMS[3].navigationText)}
                            className="text-sm/6 font-semibold text-gray-900 cursor-pointer"
                        >
                            {MAIN_NAVIGATION_ITEMS[3].name}
                        </div>
                    </PopoverGroup>
                    <div className="hidden lg:flex lg:flex-1"></div>
                </nav>

                {/** Mobile Menu */}
                <Dialog open={mobileMenuOpen} onClose={setMobileMenuOpen} className="lg:hidden">
                    <div className="fixed inset-0 z-50" />
                    <DialogPanel className="fixed inset-y-0 right-0 z-50 w-full overflow-y-auto bg-white p-6 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10">
                        <div className="flex items-center justify-between">
                            {/** Logo */}
                            <div
                                className="m-1.5 p-1.5 cursor-pointer"
                                onClick={() => {
                                    handleItemClick('main')
                                    setMobileMenuOpen(false)
                                }}
                            >
                                <img src={LOGO_ITEMS.url} alt={LOGO_ITEMS.alt} className="h-10 w-auto" />
                            </div>

                            <button
                                type="button"
                                onClick={() => setMobileMenuOpen(false)}
                                className="-m-2.5 rounded-md p-2.5 text-gray-700"
                            >
                                <span className="sr-only">Close menu</span>
                                <XMarkIcon aria-hidden="true" className="size-6" />
                            </button>
                        </div>
                        <div className="mt-6 flow-root">
                            <div className="-my-6 divide-y divide-gray-500/10">
                                <div className="space-y-2 py-6">
                                    <Disclosure as="div" className="-mx-3">
                                        <DisclosureButton className="group flex w-full items-center justify-between rounded-lg py-2 pr-3.5 pl-3 text-base/7 font-semibold text-gray-900 hover:bg-gray-50 cursor-pointer">
                                            {MAIN_NAVIGATION_ITEMS[0].name}
                                            <ChevronDownIcon aria-hidden="true" className="size-5 flex-none group-data-open:rotate-180" />
                                        </DisclosureButton>
                                        <DisclosurePanel className="mt-2 space-y-2">
                                            {[...POPUP_NAVIGATION_ITEMS, ...POPUP_ACTION_ITEMS].map((item) => (
                                                <DisclosureButton
                                                    key={item.name}
                                                    as="a"
                                                    onClick={() => {
                                                        handleItemClick(item.navigationText)
                                                        setMobileMenuOpen(false)
                                                    }}
                                                    className="block rounded-lg py-2 pr-3 pl-6 text-sm/7 font-semibold text-gray-900 hover:bg-gray-50"
                                                >
                                                    {item.name}
                                                </DisclosureButton>
                                            ))}
                                        </DisclosurePanel>
                                    </Disclosure>
                                    <div
                                        onClick={() => {
                                            handleItemClick(MAIN_NAVIGATION_ITEMS[1].navigationText)
                                            setMobileMenuOpen(false)
                                        }}
                                        className="-mx-3 block rounded-lg px-3 py-2 text-base/7 font-semibold text-gray-900 hover:bg-gray-50 cursor-pointer"
                                    >
                                        {MAIN_NAVIGATION_ITEMS[1].name}
                                    </div>
                                    <div
                                        onClick={() => {
                                            handleItemClick(MAIN_NAVIGATION_ITEMS[1].navigationText)
                                            setMobileMenuOpen(false)
                                        }}
                                        className="-mx-3 block rounded-lg px-3 py-2 text-base/7 font-semibold text-gray-900 hover:bg-gray-50 cursor-pointer"
                                    >
                                        {MAIN_NAVIGATION_ITEMS[2].name}
                                    </div>
                                    <div
                                        onClick={() => {
                                            handleItemClick(MAIN_NAVIGATION_ITEMS[1].navigationText)
                                            setMobileMenuOpen(false)
                                        }}
                                        className="-mx-3 block rounded-lg px-3 py-2 text-base/7 font-semibold text-gray-900 hover:bg-gray-50 cursor-pointer"
                                    >
                                        {MAIN_NAVIGATION_ITEMS[3].name}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </DialogPanel>
                </Dialog>
            </header>
        </div>
    )
}

export default Header