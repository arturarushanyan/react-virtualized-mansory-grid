import React, { useState, useCallback, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import MasonryGrid from './components/MasonryGrid/MasonryGrid';
import usePexels from './hooks/usePexels';

function App() {
  const [query] = useState('nature');
  const [page, setPage] = useState(1);
  const { images, isLoading, error, hasNextPage } = usePexels(query, page);
  const [allImages, setAllImages] = useState<any[]>([]);

  const handleLoadMore = useCallback(() => {
    setPage(prevPage => prevPage + 1);
}, [setPage]);

  useEffect(() => {
      if (images && images.length > 0) {
          setAllImages(prevImages => [...prevImages, ...images]);
      }
  }, [images]);

  return (
    <BrowserRouter>
        <div className="App">
            <h1>Masonry Grid</h1>
            <Routes>
                <Route path="/" element={
                    <>
                      {error && <p>Error: {error}</p>}
                      <MasonryGrid images={allImages} onLoadMore={handleLoadMore} hasNextPage={hasNextPage} />
                      {isLoading && <p>Loading...</p>}
                    </>
                } />
            </Routes>
        </div>
    </BrowserRouter>
  );
}

export default App;