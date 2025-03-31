import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Photo } from '../types'; // Assuming you have a Photo type
import './MasonryGrid.css';

interface MasonryGridProps {
    images: Photo[];
}

const MasonryGrid: React.FC<MasonryGridProps> = ({ images }) => {
    const [columns, setColumns] = useState(3);
    const columnHeightsRef = useRef<number[]>([]); // Store column heights
    const [columnImages, setColumnImages] = useState<Photo[][]>([]);

    useEffect(() => {
        const handleResize = () => {
            // Adjust columns based on screen width
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

        handleResize(); // Initial calculation
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    useEffect(() => {
        // Initialize column heights and images when columns change
        columnHeightsRef.current = new Array(columns).fill(0);
        setColumnImages(new Array(columns).fill([]).map(() => []));
    }, [columns]);

    useEffect(() => {
        if (!images || images.length === 0) {
            return; // Don't try to layout if there are no images
        }

        // Distribute images to columns
        const newColumnImages: Photo[][] = new Array(columns).fill([]).map(() => []);
        const newColumnHeights: number[] = new Array(columns).fill(0);

        images.forEach((image) => {
            // Find the shortest column
            let shortestColumnIndex = 0;
            for (let i = 1; i < columns; i++) {
                if (newColumnHeights[i] < newColumnHeights[shortestColumnIndex]) {
                    shortestColumnIndex = i;
                }
            }

            newColumnImages[shortestColumnIndex] = [...newColumnImages[shortestColumnIndex], image];
            newColumnHeights[shortestColumnIndex] += image.height / image.width; // Approximation
        });

        columnHeightsRef.current = newColumnHeights;
        setColumnImages(newColumnImages);
    }, [images, columns]);

    return (
        <div className="masonry-grid">
            {columnImages.map((column, columnIndex) => (
                <div key={columnIndex} className="masonry-column">
                    {column.map((image) => (
                        <Link to={`/photo/${image.id}`} key={image.id}>
                            <img src={image.src.medium} alt={image.alt} style={{ width: '100%', marginBottom: '10px', display: 'block' }} />
                        </Link>
                    ))}
                </div>
            ))}
        </div>
    );
};

export default MasonryGrid;