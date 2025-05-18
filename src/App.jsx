import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './Home';
import BigBoard from './BigBoard';
import MockDraft from './MockDraft';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/big-board" element={<BigBoard />} />
        <Route path="/mock-draft" element={<MockDraft />} />
      </Routes>
    </Router>
  );
}

export default App;
