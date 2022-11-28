import React from 'react';
import ReactDOM from 'react-dom/client';
import { MemoryRouter, Route, Routes } from 'react-router';
import { Home } from './pages/Home';
import { Workspace } from './pages/Workspace';
import './index.css';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
    <React.StrictMode>
        <MemoryRouter initialEntries={['/']}>
            <Routes>
                <Route index element={<Home />} />
                <Route path="/project" element={<Workspace />} />
            </Routes>
        </MemoryRouter>
    </React.StrictMode>,
);
