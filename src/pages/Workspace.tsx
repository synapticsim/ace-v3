import React, { useState } from 'react';
import { Provider } from 'react-redux';
import { TransformComponent, TransformWrapper } from '@pronestor/react-zoom-pan-pinch';
import { projectStore, ProjectStoreContext } from '../redux';
import { Instrument } from '../components/Instrument';
import { SimVarsMenu } from '../components/menu/SimVarsMenu';

enum MenuTabs {
    SimVars,
}

export const Workspace: React.FC = () => {
    const [currentMenuTab, setMenuTab] = useState<MenuTabs | undefined>(undefined);

    return (
        <Provider store={projectStore} context={ProjectStoreContext}>
            <TransformWrapper
                centerOnInit
                minScale={0.25}
                initialScale={0.25}
                wheel={{ step: 0.15 }}
                velocityAnimation={{ equalToMove: false }}
            >
                <TransformComponent wrapperClass="w-screen h-screen overflow-hidden">
                    <div className="w-[15000px] h-[5000px] bg-grid">
                        <Instrument name="CTP" x={5000 - 200} y={2500 - 100} width={260} height={260} />
                        <Instrument name="PFD" x={5000 + 100} y={2500 - 100} width={1480} height={1110} />
                        <Instrument name="DisplayUnits" x={5000 + 1600} y={2500 - 100} width={5920} height={2220} />
                    </div>
                </TransformComponent>
            </TransformWrapper>
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
