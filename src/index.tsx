import { appWindow } from '@tauri-apps/api/window';
import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { MemoryRouter, Route, Routes } from 'react-router';
import { globalStore, GlobalStoreContext } from './redux/global';
import { workspaceStore, WorkspaceStoreContext } from './redux/workspace';
import { Home } from './pages/Home';
import { Workspace } from './pages/Workspace';
import { installShims } from './shims';
import '@fontsource-variable/jetbrains-mono';
import '@fontsource-variable/space-grotesk';
import 'tippy.js/dist/tippy.css';
import './index.css';

document
    .getElementById('titlebar-minimize')!
    .addEventListener('click', () => appWindow.minimize());
document
    .getElementById('titlebar-maximize')!
    .addEventListener('click', () => appWindow.toggleMaximize());
document
    .getElementById('titlebar-close')!
    .addEventListener('click', () => appWindow.close());

installShims();

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
    <React.StrictMode>
        <Provider store={globalStore} context={GlobalStoreContext}>
            <Provider store={workspaceStore} context={WorkspaceStoreContext}>
                <MemoryRouter>
                    <Routes>
                        <Route index element={<Home />} />
                        <Route path="/workspace" element={<Workspace />} />
                    </Routes>
                </MemoryRouter>
            </Provider>
        </Provider>
    </React.StrictMode>,
);
