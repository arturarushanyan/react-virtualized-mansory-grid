import { useState, useEffect } from 'react';

const apiKey = import.meta.env.VITE_PEXELS_API_KEY;

const usePexels = (query: string, page: number) => {
    const [images, setImages] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchImages = async () => {
            setIsLoading(true);
            setError(null);
            try {
                const response = await fetch(`https://api.pexels.com/v1/search?query=${query}&per_page=30&page=${page}`, {
                    headers: {
                        Authorization: apiKey,
                    }
                });
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data = await response.json();
                setImages(prevImages => [...prevImages, ...data.photos]);
            } catch (e: any) {
                setError(e.message);
            } finally {
                setIsLoading(false);
            }
        };

        fetchImages();
    }, [query, page]);

    return { images, isLoading, error };
};

export default usePexels;