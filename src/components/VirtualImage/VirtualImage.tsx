import React, { useState, useEffect, useRef } from 'react';

interface VirtualImageProps {
    src: string;
    alt: string;
}

const VirtualImage: React.FC<VirtualImageProps> = ({ src, alt }) => {
    const [isVisible, setIsVisible] = useState(false);
    const imageRef = useRef<HTMLImageElement>(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        setIsVisible(true);
                        observer.unobserve(entry.target); // Stop observing after it's visible
                    }
                });
            },
            {
                root: null, // Use the viewport as the root
                rootMargin: '200px', // Load images 200px before they're visible
                threshold: 0 // Trigger when 0% of the element is visible
            }
        );

        if (imageRef.current) {
            observer.observe(imageRef.current);
        }

        return () => {
            if (imageRef.current) {
                observer.unobserve(imageRef.current);
            }
        };
    }, []);

    return (
        <img
            ref={imageRef}
            src={isVisible ? src : ''} // Only load the image if it's visible
            alt={alt}
            style={{
                width: '100%',
                display: 'block',
                marginBottom: '10px',
                opacity: isVisible ? 1 : 0, // Fade in effect
                transition: 'opacity 0.5s'
            }}
        />
    );
};
