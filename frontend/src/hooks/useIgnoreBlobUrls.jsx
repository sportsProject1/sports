import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

function useIgnoreBlobUrls() {
    const location = useLocation();

    useEffect(() => {
        if (location.pathname.startsWith('blob:')) {
            // Blob URL을 무시하도록 설정
            console.warn('Blob URL detected and ignored:', location.pathname);
        }
    }, [location]);
}

export default useIgnoreBlobUrls;
