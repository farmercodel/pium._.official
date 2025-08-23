'use client';

import { useEffect, useState } from 'react';
import {
    Dialog, DialogPanel, Disclosure, DisclosureButton, DisclosurePanel,
    Popover, PopoverButton, PopoverGroup, PopoverPanel,
} from '@headlessui/react';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
import { ChevronDownIcon } from '@heroicons/react/20/solid';

import useNavigation from '../../hooks/useNavigation';
import {
    LOGO_ITEMS, MAIN_NAVIGATION_ITEMS, POPUP_NAVIGATION_ITEMS, POPUP_ACTION_ITEMS,
} from '../../constants/headerConstant';

import Button from '../common/Button';
import { api } from '../../api/api';

type Me = { id: number; email: string; is_active: boolean };

function Header() {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [user, setUser] = useState<Me | null>(null);
    const [authChecked, setAuthChecked] = useState(false);

    const {
        goToAdmin,
        goToMain,
        goToPreview,
        goToAbout,
        goToSurvey,
        goToPlans,
        goToGeneration,
        goToResult,
        goToGuide,
        goToLogin,
        goToSignUp,
    } = useNavigation();

    const navigationMap = {
        main: goToMain,
        survey: goToSurvey,
        preview: goToPreview,
        about: goToAbout,
        guide: goToGuide,
        admin: goToAdmin,
        generation: goToGeneration,
        result: goToResult,
        login: goToLogin, 
        'sign up': goToSignUp,
        plans: goToPlans,
    } as const;

    const AUTH_BTN = {
    primary: "w-full rounded-xl bg-[linear-gradient(90deg,#cfe89b_0%,#8fd77e_52%,#19c6d3_100%)] text-white font-semibold shadow-[0_10px_15px_rgba(0,0,0,0.1),_0_4px_6px_rgba(0,0,0,0.1)] focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-200",
    secondary: "w-full rounded-xl bg-white text-emerald-700 ring-1 ring-gray-200 hover:ring-emerald-200 shadow-sm",
    logout: "w-full rounded-xl bg-white text-emerald-700 ring-1 ring-gray-200 hover:ring-emerald-200 shadow-sm"
    } as const;


    const handleItemClick = (k: keyof typeof navigationMap, close?: () => void) => {
        navigationMap[k]?.();
        close?.();
    };

    // 토큰 있으면 me 조회
    useEffect(() => {
        const fetchMeIfNeeded = async () => {
            const t = localStorage.getItem('access_token');
            if (!t) { setUser(null); setAuthChecked(true); return; }
            try {
                const { data } = await api.get<Me>('/api/auth/me');
                setUser(data ?? null);
            } catch {
                localStorage.removeItem('access_token');
                setUser(null);
            } finally {
                setAuthChecked(true);
            }
        };
        void fetchMeIfNeeded();

        const onStorage = (e: StorageEvent) => {
            if (e.key === 'access_token') { setAuthChecked(false); void fetchMeIfNeeded(); }
        };
        window.addEventListener('storage', onStorage);
        return () => window.removeEventListener('storage', onStorage);
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('access_token');
        setUser(null);
        goToMain();
    };

    return (
        <div className="w-full h-19">
            <header className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200 shadow-sm">
                <nav aria-label="Global" className="mx-auto flex max-w-7xl items-center justify-between p-2 lg:px-8">
                    {/* Logo */}
                    <div className="flex lg:flex-1">
                        <div className="mx-1.5 px-1.5 cursor-pointer" onClick={() => handleItemClick('main')}>
                            <img src={LOGO_ITEMS.url} alt={LOGO_ITEMS.alt} className="h-15 w-auto" />
                        </div>
                    </div>

                    {/* Mobile trigger */}
                    <div className="flex lg:hidden">
                        <Button variant="custom" size="custom" onClick={() => setMobileMenuOpen(true)}
                            className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700">
                            <Bars3Icon aria-hidden="true" className="size-6" />
                        </Button>
                    </div>

                    {/* Desktop menu */}
                    <PopoverGroup className="hidden lg:flex lg:gap-x-12">
                        <Popover className="relative">
                            {({ close }) => (
                                <>
                                    <PopoverButton className="flex items-center gap-x-1 text-sm/6 font-semibold text-gray-900 cursor-pointer">
                                        {MAIN_NAVIGATION_ITEMS[0].name}
                                        <ChevronDownIcon aria-hidden="true" className="size-5 flex-none text-gray-400" />
                                    </PopoverButton>

                                    <PopoverPanel transition className="absolute left-1/2 z-10 mt-3 w-screen max-w-md -translate-x-1/2
                 overflow-hidden rounded-3xl bg-white shadow-lg outline-1 outline-gray-900/5
                 transition data-closed:translate-y-1 data-closed:opacity-0 data-enter:duration-200
                 data-enter:ease-out data-leave:duration-150 data-leave:ease-in">
                                        <div className="p-4">
                                            {POPUP_NAVIGATION_ITEMS.map((item) => (
                                                <div key={item.name} className="group relative flex items-center gap-x-6 rounded-lg p-4 text-sm/6 hover:bg-gray-50">
                                                    <div className="flex size-11 flex-none items-center justify-center rounded-lg bg-gray-50 group-hover:bg-white">
                                                        <item.icon aria-hidden="true" className="size-6 text-gray-600 group-hover:text-indigo-600" />
                                                    </div>
                                                    <div className="flex-auto">
                                                        <div onClick={() => handleItemClick(item.navigationText as keyof typeof navigationMap, close)}
                                                            className="block font-semibold text-gray-900 cursor-pointer">
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
                                                <div key={item.name}
                                                    onClick={() => handleItemClick(item.navigationText as keyof typeof navigationMap, close)}
                                                    className="flex items-center justify-center gap-x-2.5 p-3 text-sm/6 font-semibold text-gray-900 hover:bg-gray-100">
                                                    <item.icon aria-hidden="true" className="size-5 flex-none text-gray-400" />
                                                    {item.name}
                                                </div>
                                            ))}
                                        </div>
                                    </PopoverPanel>
                                </>
                            )}
                        </Popover>

                        <div onClick={() => handleItemClick(MAIN_NAVIGATION_ITEMS[1].navigationText as keyof typeof navigationMap, close)}
                            className="text-sm/6 font-semibold text-gray-900 cursor-pointer">
                            {MAIN_NAVIGATION_ITEMS[1].name}
                        </div>
                        <div onClick={() => handleItemClick(MAIN_NAVIGATION_ITEMS[2].navigationText as keyof typeof navigationMap, close)}
                            className="text-sm/6 font-semibold text-gray-900 cursor-pointer">
                            {MAIN_NAVIGATION_ITEMS[2].name}
                        </div>
                        <div onClick={() => handleItemClick(MAIN_NAVIGATION_ITEMS[3].navigationText as keyof typeof navigationMap, close)}
                            className="text-sm/6 font-semibold text-gray-900 cursor-pointer">
                            {MAIN_NAVIGATION_ITEMS[3].name}
                        </div>
                    </PopoverGroup>

                    {/* Right: Auth */}
                    <div className="hidden lg:flex lg:flex-1 lg:justify-end items-center gap-3">
                        {!authChecked ? null : user ? (
                            <div onClick={handleLogout}
                                className="text-md font-semibold text-black mr-2 hover:text-red-400 cursor-pointer transition-all duration-300 ease-in-out hover:drop-shadow-[0_0_8px_rgba(239,68,68,0.6)]">
                                Logout
                            </div>
                        ) : (
                            <>
                                <div onClick={() => handleItemClick(MAIN_NAVIGATION_ITEMS[4].navigationText as keyof typeof navigationMap, close)}
                                    className="text-md font-semibold text-black mr-2 hover:text-green-400 cursor-pointer transition-all duration-300 ease-in-out hover:drop-shadow-[0_0_8px_rgba(74,222,128,0.6)]">
                                    {MAIN_NAVIGATION_ITEMS[4].name /* Login */}
                                </div>
                                <div onClick={() => handleItemClick(MAIN_NAVIGATION_ITEMS[5].navigationText as keyof typeof navigationMap, close)}
                                    className="text-md font-semibold text-gray-500 hover:text-green-400 cursor-pointer transition-all duration-300 ease-in-out hover:drop-shadow-[0_0_8px_rgba(74,222,128,0.6)]">
                                    {MAIN_NAVIGATION_ITEMS[5].name /* Sign Up */}
                                </div>
                            </>
                        )}
                    </div>
                </nav>

                {/* Mobile Menu */}
                <Dialog open={mobileMenuOpen} onClose={setMobileMenuOpen} className="lg:hidden">
                    <div className="fixed inset-0 z-50" />
                    <DialogPanel className="fixed inset-y-0 right-0 z-50 w-full overflow-y-auto bg-white p-6 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10">
                        <div className="flex items-center justify-between">
                            <div className="m-1.5 p-1.5 cursor-pointer"
                                onClick={() => { handleItemClick('main'); setMobileMenuOpen(false); }}>
                                <img src={LOGO_ITEMS.url} alt={LOGO_ITEMS.alt} className="h-10 w-auto" />
                            </div>
                            <button type="button" onClick={() => setMobileMenuOpen(false)}
                                className="-m-2.5 rounded-md p-2.5 text-gray-700">
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
                                                <DisclosureButton key={item.name} as="a"
                                                    onClick={() => { handleItemClick(item.navigationText as keyof typeof navigationMap); setMobileMenuOpen(false); }}
                                                    className="block rounded-lg py-2 pr-3 pl-6 text-sm/7 font-semibold text-gray-900 hover:bg-gray-50">
                                                    {item.name}
                                                </DisclosureButton>
                                            ))}
                                        </DisclosurePanel>
                                    </Disclosure>

                                    <div onClick={() => { handleItemClick(MAIN_NAVIGATION_ITEMS[1].navigationText as keyof typeof navigationMap); setMobileMenuOpen(false); }}
                                        className="-mx-3 block rounded-lg px-3 py-2 text-base/7 font-semibold text-gray-900 hover:bg-gray-50 cursor-pointer">
                                        {MAIN_NAVIGATION_ITEMS[1].name}
                                    </div>
                                    <div onClick={() => { handleItemClick(MAIN_NAVIGATION_ITEMS[2].navigationText as keyof typeof navigationMap); setMobileMenuOpen(false); }}
                                        className="-mx-3 block rounded-lg px-3 py-2 text-base/7 font-semibold text-gray-900 hover:bg-gray-50 cursor-pointer">
                                        {MAIN_NAVIGATION_ITEMS[2].name}
                                    </div>
                                    <div onClick={() => { handleItemClick(MAIN_NAVIGATION_ITEMS[3].navigationText as keyof typeof navigationMap); setMobileMenuOpen(false); }}
                                        className="-mx-3 block rounded-lg px-3 py-2 text-base/7 font-semibold text-gray-900 hover:bg-gray-50 cursor-pointer">
                                        {MAIN_NAVIGATION_ITEMS[3].name}
                                    </div>

                                    {/* Mobile 하단 Auth */}
                                    {authChecked && (
                                    <div className="mt-4 -mx-3 px-3 flex flex-col gap-2">
                                        {user ? (
                                        <Button
                                            variant="custom"
                                            className={AUTH_BTN.logout}
                                            onClick={() => { handleLogout(); setMobileMenuOpen(false); }}
                                        >
                                            로그아웃
                                        </Button>
                                        ) : (
                                        <>
                                            <Button
                                            variant="custom"
                                            className={AUTH_BTN.primary}
                                            onClick={() => { handleItemClick('login'); setMobileMenuOpen(false); }}
                                            >
                                            Login
                                            </Button>

                                            <Button
                                            variant="custom"
                                            className={AUTH_BTN.secondary}
                                            onClick={() => { handleItemClick('sign up'); setMobileMenuOpen(false); }}
                                            >
                                            Sign Up
                                            </Button>
                                        </>
                                        )}
                                    </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </DialogPanel>
                </Dialog>
            </header>
        </div>
    );
}

export default Header;
