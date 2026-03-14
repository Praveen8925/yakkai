import { useState, useEffect } from 'react';

/**
 * useLightbox — manages lightbox open/close state with browser back-button support.
 *
 * When the lightbox opens, a fake history entry is pushed so that pressing the
 * browser back button (or trackpad swipe) closes the lightbox instead of
 * navigating away from the page.
 */
const useLightbox = () => {
    const [lightbox, setLightbox] = useState(null);

    const openLightbox = (item) => {
        setLightbox(item);
        document.body.style.overflow = 'hidden';
        // Push a fake history entry so browser back closes the lightbox, not the page
        window.history.pushState({ lightbox: true }, '');
    };

    const closeLightbox = () => {
        setLightbox(null);
        document.body.style.overflow = '';
    };

    useEffect(() => {
        const handlePopState = () => {
            // Browser back was pressed — close lightbox instead of navigating away
            setLightbox(null);
            document.body.style.overflow = '';
        };

        window.addEventListener('popstate', handlePopState);

        return () => {
            // Cleanup on unmount — restore scroll and remove listener
            document.body.style.overflow = '';
            window.removeEventListener('popstate', handlePopState);
        };
    }, []);

    return { lightbox, openLightbox, closeLightbox };
};

export default useLightbox;
