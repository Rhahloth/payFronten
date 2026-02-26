import { useState, useEffect, useCallback, useRef } from 'react';

const MainContent = ({ children }) => {
    const [sidebarState, setSidebarState] = useState({
        isOpen: true,
        isMobile: false,
    });

    const observerRef = useRef(null);
    const rafRef = useRef(null);

    const getMarginLeft = useCallback(() => {
        const { isOpen, isMobile } = sidebarState;
        if (isMobile) return isOpen ? 'ml-64' : 'ml-0';
        return isOpen ? 'ml-64' : 'ml-20';
    }, [sidebarState]);

    const handleResize = useCallback(() => {
        if (rafRef.current) cancelAnimationFrame(rafRef.current);
        rafRef.current = requestAnimationFrame(() => {
            const isMobile = window.innerWidth < 768;
            setSidebarState(prev => ({
                ...prev,
                isMobile,
                isOpen: isMobile ? false : prev.isOpen,
            }));
        });
    }, []);

    const handleSidebarChange = useCallback(() => {
        const sidebar = document.querySelector('[data-sidebar="true"]');
        if (sidebar) {
            const isOpen = sidebar.classList.contains('w-64');
            setSidebarState(prev => ({ ...prev, isOpen }));
        }
    }, []);

    useEffect(() => {
        handleSidebarChange();
        handleResize();

        window.addEventListener('resize', handleResize, { passive: true });

        const sidebar = document.querySelector('[data-sidebar="true"]');
        if (sidebar) {
            observerRef.current = new MutationObserver((mutations) => {
                mutations.forEach((mutation) => {
                    if (mutation.attributeName === 'class') handleSidebarChange();
                });
            });
            observerRef.current.observe(sidebar, {
                attributes: true,
                attributeFilter: ['class'],
            });
        }

        return () => {
            window.removeEventListener('resize', handleResize);
            if (observerRef.current) observerRef.current.disconnect();
            if (rafRef.current) cancelAnimationFrame(rafRef.current);
        };
    }, [handleSidebarChange, handleResize]);

    return (
        <main
            className={`
                min-h-screen
                transition-all
                duration-300
                ease-in-out
                overflow-x-hidden
                w-auto
                ${getMarginLeft()}
            `}
            role="main"
            aria-label="Main content"
        >
            <div className="relative min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 w-full">
                {/* Subtle background pattern */}
                <div
                    className="absolute inset-0 opacity-[0.02] pointer-events-none"
                    style={{
                        backgroundImage: `radial-gradient(circle at 1px 1px, #4b5563 1px, transparent 0)`,
                        backgroundSize: '40px 40px',
                    }}
                    aria-hidden="true"
                />

                {/* Content — fills all available width after margin */}
                <div className="relative z-10 w-full">
                    {children}
                </div>
            </div>
        </main>
    );
};

export default MainContent;