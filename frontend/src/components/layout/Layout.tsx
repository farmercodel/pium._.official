import React from 'react'
import { useLocation } from 'react-router-dom'
import Header from './Header.tsx'
import Footer from './Footer.tsx'

interface LayoutProps {
    children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
    const location = useLocation()
    const isAuthPage = location.pathname.includes('/login') || location.pathname.includes('/signup')

    return (
        <div className="min-h-screen flex flex-col">
            {/* Header */}
            {!isAuthPage && <Header />}

            {/* Main */}
            <main className="flex-1">
                {children}
            </main>

            {/* Footer */}
            {!isAuthPage && <Footer />}
        </div>
    )
}

export default Layout