import React, { useState, useCallback, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import MasonryGrid from './components/MasonryGrid/MasonryGrid';
import usePexels from './hooks/usePexels';

function PhotoDetail() {
    return (
        <div>
            <h1>Photo Detail</h1>
            <Link to="/">Back to Grid</Link>
        </div>
    );
}

function App() {
    const [query, setQuery] = useState('nature');
    const [page, setPage] = useState(1);
    const { images, isLoading, error, hasNextPage } = usePexels(query, page);
    const [allImages, setAllImages] = useState<any[]>([]);

    useEffect(() => {
        console.log(`App: hasNextPage=${hasNextPage}, images.length=${images.length}`);
    }, [hasNextPage, images]);

    useEffect(() => {
        if (images && images.length > 0) {
            setAllImages(prevImages => [...prevImages, ...images]);
        }
    }, [images]);

    const handleLoadMore = useCallback(() => {
        console.log("App: handleLoadMore called");
        setPage(prevPage => prevPage + 1); // Increment page unconditionally
    }, [setPage]);

    return (
        <BrowserRouter>
            <div className="App">
                <h1>Masonry Grid</h1>
                <Routes>
                    <Route path="/" element={
                        <>
                            {error && <p>Error: {error}</p>}
                            {isLoading && <p>Loading...</p>}
                            <MasonryGrid images={allImages} onLoadMore={handleLoadMore} hasNextPage={hasNextPage} />
                            {!hasNextPage && <p>No more images to load.</p>}
                        </>
                    } />
                    <Route path="/photo/:id" element={<PhotoDetail />} />
                </Routes>
            </div>
        </BrowserRouter>
    );
}

export default App;