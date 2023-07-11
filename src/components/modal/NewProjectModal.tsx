import React from 'react';
import { useNavigate } from 'react-router';
import { Field, Form, Formik } from 'formik';
import { invoke } from '@tauri-apps/api/tauri';
import { Modal, ModalProps } from './index';
import { FileInput, Input } from '../Input';
import { Button } from '../Button';
import { useWorkspaceDispatch } from '../../redux/workspace';
import { setActive } from '../../redux/workspace/projectSlice';
import { newProjectSchema } from '../../utils/schema';
import { AceProject } from '../../types';

type NewProjectModalProps = Omit<ModalProps, 'title'>;

export const NewProjectModal: React.FC<NewProjectModalProps> = ({ show, onExit }) => {
    const navigate = useNavigate();

    const workspaceDispatch = useWorkspaceDispatch();

    return (
        <Modal title="New Project" show={show} onExit={onExit}>
            <Formik
                initialValues={{
                    name: '',
                    root: '',
                    paths: {
                        instruments: '',
                        bundles: '',
                        html_ui: '',
                    },
                }}
                validationSchema={newProjectSchema}
                onSubmit={(values, { setStatus }) => {
                    const { root: path, ...config } = values;
                    invoke<AceProject>('create_project', { project: { path, config } })
                        .then((project) => {
                            setStatus('');
                            workspaceDispatch(setActive({ project }));
                            navigate('/workspace');
                        }).catch((err) => {
                            setStatus(err);
                        });
                }}
            >
                {({ values, errors, setFieldValue, submitCount, status }) => (
                    <Form className="flex flex-col gap-4 w-96">
                        <Field
                            as={Input}
                            name="name"
                            label="Project Name"
                            error={submitCount > 0 && errors.name}
                        />
                        <Field
                            as={FileInput}
                            name="root"
                            label="Project Root"
                            placeholder="Select Directory"
                            error={submitCount > 0 && errors.root}
                            onFileSelect={(path: string) => setFieldValue('root', path)}
                            options={{
                                title: 'Select Project Root',
                                directory: true,
                            }}
                        />
                        <Field
                            as={FileInput}
                            name="paths.instruments"
                            label="Instruments"
                            placeholder="Select Directory"
                            error={submitCount > 0 && errors.paths?.instruments}
                            onFileSelect={(path: string) => setFieldValue('paths.instruments', path)}
                            options={{
                                title: 'Select Instruments Directory',
                                directory: true,
                                defaultPath: values.root,
                            }}
                        />
                        <Field
                            as={FileInput}
                            name="paths.bundles"
                            label="Bundles"
                            placeholder="Select Directory"
                            error={submitCount > 0 && errors.paths?.bundles}
                            onFileSelect={(path: string) => setFieldValue('paths.bundles', path)}
                            options={{
                                title: 'Select Bundles Directory',
                                directory: true,
                                defaultPath: values.root,
                            }}
                        />
                        <Field
                            as={FileInput}
                            name="paths.html_ui"
                            label="HTML UI"
                            placeholder="Select Directory"
                            error={submitCount > 0 && errors.paths?.html_ui}
                            onFileSelect={(path: string) => setFieldValue('paths.html_ui', path)}
                            options={{
                                title: 'Select HTML UI Directory',
                                directory: true,
                                defaultPath: values.root,
                            }}
                        />
                        {status && <p className="text-red-500">{status}</p>}
                        <Button className="bg-theme-background hover:bg-theme-padding ring-theme-primary text-theme-text font-bold" type="submit">Submit</Button>
                    </Form>
                )}
            </Formik>
        </Modal>
    );
};
