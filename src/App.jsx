import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './Home';
import BigBoard from './BigBoard';
import MockDraft from './MockDraft';
import Rosters from './Rosters';
import TeamRoster from './TeamRoster';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/big-board" element={<BigBoard />} />
        <Route path="/mock-draft" element={<MockDraft />} />
        <Route path="/rosters" element={<Rosters />} />
        <Route path="/rosters/:team" element={<TeamRoster />} />
      </Routes>
    </Router>
  );
}

export default App;
