import React, { useCallback, useState } from 'react';
import { useNavigate } from 'react-router';
import { open } from '@tauri-apps/api/dialog';
import { invoke } from '@tauri-apps/api/tauri';
import { FiFolder, FiFolderPlus } from 'react-icons/fi';
import { NewProjectModal } from '../components/modal/NewProjectModal';
import { Button } from '../components/Button';
import { useGlobalDispatch } from '../redux/global';
import { ProjectConfig } from '../types';
import { setActive } from '../redux/global/projectSlice'

export const Home: React.FC = () => {
    const navigate = useNavigate();

    const [showNewProjectModal, setShowNewProjectModal] = useState<boolean>(false);

    const dispatch = useGlobalDispatch();

    const loadProject = useCallback(async () => {
        const path = await open({
            title: 'Select Project Folder',
            directory: true,
        });
        invoke<ProjectConfig>('load_project', { path })
            .then((project) => {
                dispatch(setActive({ project }));
                navigate('/workspace');
            })
            .catch((error) => console.error(error));
    }, [navigate]);

    return (
        <>
            <div className="container max-w-2xl h-screen flex items-center">
                <div className="grid grid-cols-2">
                    <div className="border-r-2 border-slate-700 pr-8">
                        <h1 className="font-bold mb-4">Welcome.</h1>
                        <h4 className="mb-4">Where do you want to start today?</h4>

                        <div className="flex flex-col gap-3">
                            <Button
                                className="bg-slate-700 ring-slate-700 text-xl font-medium flex items-center"
                                onClick={() => setShowNewProjectModal(true)}
                            >
                                New Project
                                <FiFolderPlus size={20} className="ml-auto" />
                            </Button>
                            <Button
                                className="bg-teal-medium ring-teal-medium text-xl font-medium flex items-center"
                                onClick={loadProject}
                            >
                                Open Project
                                <FiFolder size={20} className="ml-auto" />
                            </Button>
                        </div>
                    </div>
                    <div className="pl-8">
                        <h3>Recent Projects</h3>
                    </div>
                </div>
            </div>
            <NewProjectModal
                show={showNewProjectModal}
                onExit={() => setShowNewProjectModal(false)}
            />
        </>
    );
};
