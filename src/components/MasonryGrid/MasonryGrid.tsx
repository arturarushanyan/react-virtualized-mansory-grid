import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { Photo } from '../types'; // Assuming you have a Photo type
import VirtualImage from '../VirtualImage/VirtualImage';
import './MasonryGrid.css';

interface MasonryGridProps {
    images: Photo[];
    onLoadMore: () => void;
    hasNextPage: boolean;
}

const MasonryGrid: React.FC<MasonryGridProps> = ({ images, onLoadMore, hasNextPage }) => {
    const [columns, setColumns] = useState(3);
    const columnHeightsRef = useRef<number[]>([]);
    const [columnImages, setColumnImages] = useState<Photo[][]>([]);
    const sentinelRef = useRef<HTMLDivElement>(null);
    const observerRef = useRef<IntersectionObserver | null>(null);

    const handleScroll = useCallback(() => {
        const scrollPosition = window.scrollY + window.innerHeight;
        const bodyHeight = document.body.scrollHeight;

        if (scrollPosition >= bodyHeight - 100) {
            onLoadMore();
        }
    }, []);
    useEffect(() => {
        const handleResize = () => {
            let newColumns = 3;
            if (window.innerWidth < 768) {
                newColumns = 2;
            } else if (window.innerWidth < 1200) {
                newColumns = 3;
            } else {
                newColumns = 4;
            }

            setColumns(newColumns);
        };

        handleResize();
        window.addEventListener('resize', handleResize);
        window.addEventListener('scroll', handleScroll);
        return () => {
            window.removeEventListener('resize', handleResize);
            window.removeEventListener('scroll', handleScroll)
        };
    }, []);

    useEffect(() => {
        columnHeightsRef.current = new Array(columns).fill(0);
        setColumnImages(new Array(columns).fill([]).map(() => []));
    }, [columns]);

    useEffect(() => {
        if (!images || images.length === 0) {
            setColumnImages([]);
            return;
        }

        const newColumnImages: Photo[][] = new Array(columns).fill([]).map(() => []);
        const newColumnHeights: number[] = new Array(columns).fill(0);

        images.forEach((image) => {
            let shortestColumnIndex = 0;
            for (let i = 1; i < columns; i++) {
                if (newColumnHeights[i] < newColumnHeights[shortestColumnIndex]) {
                    shortestColumnIndex = i;
                }
            }

            newColumnImages[shortestColumnIndex] = [...newColumnImages[shortestColumnIndex], image];
            newColumnHeights[shortestColumnIndex] += image.height / image.width;
        });

        columnHeightsRef.current = newColumnHeights;
        setColumnImages(newColumnImages);
    }, [images, columns]);

    const observerCallback = useCallback((entries: IntersectionObserverEntry[]) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && hasNextPage) { // Check hasNextPage here!
                console.log("MasonryGrid: Sentinel is intersecting AND hasNextPage is true, calling onLoadMore");
                onLoadMore();
            } else {
                console.log("MasonryGrid: Sentinel is intersecting, but hasNextPage is false");
            }
        });
    }, [onLoadMore, hasNextPage]);

    useEffect(() => {
        const observerOptions = {
            root: null,
            rootMargin: '200px',
            threshold: 0,
        };

        if (!observerRef.current) {
            observerRef.current = new IntersectionObserver(observerCallback, observerOptions);
            console.log("MasonryGrid: Created new IntersectionObserver");
        }

        const currentObserver = observerRef.current;

        if (sentinelRef.current && hasNextPage) {
            console.log("MasonryGrid: Observing sentinel");
            currentObserver.observe(sentinelRef.current);
        } else {
            console.log("MasonryGrid: Not observing sentinel (hasNextPage is false or sentinel is null)");
            currentObserver.disconnect();
        }

        return () => {
            console.log("MasonryGrid: Disconnecting observer on unmount");
            currentObserver.disconnect();
        };
    }, [sentinelRef, hasNextPage, onLoadMore, observerCallback]);

    return (
        <div className="masonry-grid">
            {columnImages.map((column, columnIndex) => (
                <div key={columnIndex} className="masonry-column">
                    {column.map((image) => (
                        <Link to={`/photo/${image.id}`} key={image.id}>
                            <VirtualImage src={image.src.medium} alt={image.alt} />
                        </Link>
                    ))}
                </div>
            ))}
            <div ref={sentinelRef} style={{ height: '50px', clear: 'both' }}></div>
        </div>
    );
};

export default MasonryGrid;