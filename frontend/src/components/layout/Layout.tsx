import React from 'react'
import Header from './Header.tsx'
import Footer from './Footer.tsx'

interface LayoutProps {
    children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
    
    return (
        <div className="min-h-screen flex flex-col">
            {/* Header */}
            <Header />

            {/* Main */}
            <main className="flex-1">
                {children}
            </main>

            {/* Footer */}
            <Footer />
        </div>
    )
}

export default Layout