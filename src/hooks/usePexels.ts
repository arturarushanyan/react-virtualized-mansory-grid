import { useState, useEffect } from 'react';

interface UsePexelsResult {
    images: any[];
    isLoading: boolean;
    error: string | null;
    hasNextPage: boolean;
}

const usePexels = (query: string, page: number): UsePexelsResult => {
    const [images, setImages] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [hasNextPage, setHasNextPage] = useState(true);

    useEffect(() => {
        console.log(`usePexels: query=${query}, page=${page}`);
        const fetchImages = async () => {
            setIsLoading(true);
            setError(null);
            try {
                const apiKey = import.meta.env.VITE_PEXELS_API_KEY;
                const response = await fetch(`https://api.pexels.com/v1/search?query=${query}&per_page=10&page=${page}`, {
                    headers: {
                        Authorization: apiKey
                    }
                });

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                const data = await response.json();
                const newImages = data.photos;

                // Check if there are more pages based on the API response
                if (newImages.length === 0) {
                    console.log("usePexels: No more images, setting hasNextPage to false");
                    setHasNextPage(false);
                    setImages([]); // Clear images to prevent duplicates
                }
                 else {
                    console.log(`usePexels: Fetched ${newImages.length} images`);
                    setHasNextPage(true);
                    setImages(newImages);
                }
            } catch (e: any) {
                console.error("usePexels: Error fetching images:", e);
                setError(e.message);
                setHasNextPage(false);
            } finally {
                setIsLoading(false);
            }
        };

        fetchImages();
    }, [query, page]);

    return { images, isLoading, error, hasNextPage };
};

export default usePexels;