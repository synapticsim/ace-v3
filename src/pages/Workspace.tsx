import React, { useEffect, useRef, useState } from 'react';
import { Provider } from 'react-redux';
import { TransformComponent, TransformWrapper } from '@pronestor/react-zoom-pan-pinch';
import { invoke } from '@tauri-apps/api/tauri';
import { globalStore } from '../redux/global';
import { setInstruments } from '../redux/global/projectSlice';
import { useWorkspaceDispatch, useWorkspaceSelector, WorkspaceState, workspaceStore, WorkspaceStoreContext } from '../redux/workspace';
import { initializeSimVars } from '../redux/workspace/simVarSlice';
import { Instrument } from '../components/Instrument';
import { SimVarsMenu } from '../components/menu/SimVarsMenu';
import { SimVarMap } from '../types';
import { clearMenu, setMenu } from '../redux/workspace/contextMenuSlice'
import { ContextMenu } from '../components/contextmenu'

enum MenuTabs {
    SimVars,
}

export const Workspace: React.FC = () => {
    const [currentMenuTab, setMenuTab] = useState<MenuTabs | undefined>(undefined);

    useEffect(() => {
        invoke<SimVarMap>('load_simvars')
            .then((simVars) => {
                workspaceStore.dispatch(initializeSimVars({ simVars }));
                console.log('[ACE] Loaded SimVars from project configuration');
            });
        invoke<string[]>('load_instruments')
            .then((instruments) => {
                globalStore.dispatch(setInstruments({ instruments }));
                console.log('[ACE] Loaded available instruments');
            });
    }, []);

    return (
        <Provider store={workspaceStore} context={WorkspaceStoreContext}>
            <TransformWrapper
                centerOnInit
                minScale={0.25}
                initialScale={0.25}
                wheel={{ step: 0.15 }}
                velocityAnimation={{ equalToMove: false }}
            >
                <TransformComponent wrapperClass="w-screen h-screen overflow-hidden">
                    <Canvas />
                </TransformComponent>
            </TransformWrapper>

            <ContextMenuLayer />

            <div className="absolute left-0 top-0 h-screen bg-midnight-800 shadow-2xl p-4 flex flex-col gap-4 z-20">
                <SimVarsMenu
                    show={currentMenuTab === MenuTabs.SimVars}
                    onClick={() => setMenuTab(MenuTabs.SimVars)}
                    onExit={() => setMenuTab(undefined)}
                />
            </div>
        </Provider>
    );
};

const Canvas: React.FC = () => {
    const containerRef = useRef<HTMLDivElement>(null);

    const dispatch = useWorkspaceDispatch();

    return (
        <div
            ref={containerRef}
            className="w-[15000px] h-[5000px] bg-grid"
            onContextMenu={(e) => {
                e.preventDefault();

                if (e.target === containerRef.current) {
                    dispatch(setMenu(<ContextMenu x={e.clientX} y={e.clientY} />));
                }
            }}
        >
            <Instrument name="CTP" x={5000 - 200} y={2500 - 100} width={260} height={260} />
            <Instrument name="PFD" x={5000 + 100} y={2500 - 100} width={1480} height={1110} />
            <Instrument name="DisplayUnits" x={5000 + 1600} y={2500 - 100} width={5920} height={2220} />
        </div>
    );
};

const ContextMenuLayer: React.FC = () => {
    const activeMenu = useWorkspaceSelector((state: WorkspaceState) => state.contextMenu.active);
    const dispatch = useWorkspaceDispatch();

    return (
        <div
            className="absolute top-0 left-0 w-screen h-screen"
            onClick={() => dispatch(clearMenu())}
        >
            {activeMenu}
        </div>
    )
};
