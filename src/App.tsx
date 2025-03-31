import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import MasonryGrid from './components/MasonryGrid/MasonryGrid';
import usePexels from './hooks/usePexels';

// Placeholder for PhotoDetail component (you'll create this later)
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
  const { images, isLoading, error } = usePexels(query, page);

  return (
    <BrowserRouter>
      <div className="App">
        <h1>Masonry Grid</h1>
        <Routes>
          <Route path="/" element={
            <>
              {error && <p>Error: {error}</p>}
              {isLoading ? (
                <p>Loading...</p>
              ) : (
                <MasonryGrid images={images} />
              )}
            </>
          } />
          <Route path="/photo/:id" element={<PhotoDetail />} /> {/* Route for photo detail view */}
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;