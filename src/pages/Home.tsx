import React, { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { open } from '@tauri-apps/api/dialog';
import { invoke } from '@tauri-apps/api/tauri';
import { LuFolderOpen, LuPlus } from 'react-icons/lu';
import { appWindow } from '@tauri-apps/api/window';
import { MdSettings } from 'react-icons/md';
import { useWorkspaceDispatch } from '../redux/workspace';
import { setActive } from '../redux/workspace/projectSlice';
import { initConfig, pushRecentProject } from '../redux/global/configSlice';
import { GlobalDispatch, GlobalState, useGlobalDispatch, useGlobalSelector } from '../redux/global';
import { AceProject } from '../types';
import { Card } from '../components/Card';
import { NewProjectModal } from '../components/modal/NewProjectModal';
import { timeFromTimestamp } from '../utils/date';
import { fallbackThemeConfig } from '../redux/global/ui/uitheme';

export const Home: React.FC = () => {
    const navigate = useNavigate();
    const workspaceDispatch = useWorkspaceDispatch();
    const globalDispatch = useGlobalDispatch<GlobalDispatch>();

    const { version, recentProjects, theme } = useGlobalSelector((state: GlobalState) => ({
        version: state.config.version,
        recentProjects: state.config.recentProjects,
        theme: state.config.theme,
    }));

    const themeConfig = theme !== undefined ? theme : fallbackThemeConfig;

    const { colors: { primary, secondary, text, padding, workspacePadding, background } } = themeConfig;

    useEffect(() => {
        document.documentElement.style.setProperty('--primary-color', primary);
        document.documentElement.style.setProperty('--secondary-color', secondary);
        document.documentElement.style.setProperty('--text-color', text);
        document.documentElement.style.setProperty('--padding-color', padding);
        document.documentElement.style.setProperty('--workspace-padding-color', workspacePadding);
        document.documentElement.style.setProperty('--background-color', background);
    }, [background, padding, primary, secondary, workspacePadding, text]);

    console.log(padding);

    const [showNewProjectModal, setShowNewProjectModal] = useState<boolean>(false);

    const openProject = useCallback(() => {
        open({
            title: 'Select Project Folder',
            directory: true,
        })
            .then(async (path) => {
                await loadProject(path as string);
            });
    }, []);

    const loadProject = useCallback((path: string) => {
        invoke<AceProject>('load_project', { path })
            .then((project) => {
                workspaceDispatch(setActive({ project }));
                globalDispatch(pushRecentProject(project));
                navigate('/workspace');
            })
            .catch((error) => console.error(error));
    }, [workspaceDispatch, globalDispatch, navigate]);

    const navigateToSettings = () => {
        navigate('/settings');
    };

    useEffect(() => {
        appWindow.setResizable(false);
        appWindow.unmaximize();

        globalDispatch(initConfig())
            .then(() => console.log('Initialized global state.'))
            .catch((error) => console.error(error));
    }, [globalDispatch]);

    if (version === undefined || recentProjects === undefined) {
        return <h1>Loading...</h1>;
    }

    return (
        <>
            <div className="container px-20 pt-16 h-screen overflow-clip">
                <div className="flex gap-4 items-center text-4xl text-theme-text mb-8">
                    <span>Welcome to <span className="text-theme-primary font-medium">ACE</span></span>
                    <span
                        className="rounded-xl px-3 py-1 font-medium text-sm bg-theme-padding bg-opacity"
                    >v{version}
                    </span>
                    {/* eslint-disable-next-line jsx-a11y/control-has-associated-label */}
                    <button onClick={navigateToSettings} className="ml-auto rounded-md p-1 hover:bg-theme-padding transition">
                        <MdSettings size={25} />
                    </button>
                </div>
                <div className="grid grid-cols-2 gap-6 mb-16">
                    <Card
                        className="flex gap-4 items-center"
                        onClick={() => setShowNewProjectModal(true)}
                    >
                        <LuPlus size={20} />
                        Create New Project
                    </Card>
                    <Card
                        className="flex gap-4 items-center"
                        onClick={openProject}
                    >
                        <LuFolderOpen size={20} />
                        Open Existing Project
                    </Card>
                </div>

                <h2 className="flex gap-4 items-center text-2xl text-theme-text mb-8">
                    Recent Projects
                </h2>
                {recentProjects.length === 0 && (
                    <p>Looks like you haven't opened any projects yet!</p>
                )}
                <div className="flex flex-col gap-5">
                    {[...recentProjects]
                        .sort((a, b) => (a.timestamp > b.timestamp ? -1 : 1))
                        .map(({ name, path, timestamp }) => (
                            <Card onClick={() => loadProject(path)} key={path}>
                                <span className="flex gap-3 items-center">
                                    <h3 className="font-medium text-2xl text-theme-secondary">{name}</h3>
                                    <span className="font-xs">Last opened {timeFromTimestamp(timestamp)}</span>
                                </span>
                                <span className="font-mono text-sm text-theme-workspce-padding">{path}</span>
                            </Card>
                        ))}
                </div>
            </div>
            <NewProjectModal
                show={showNewProjectModal}
                onExit={() => setShowNewProjectModal(false)}
            />
        </>
    );
};
