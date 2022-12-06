import React from 'react';
import { useNavigate } from 'react-router';
import { Field, Form, Formik } from 'formik';
import { invoke } from '@tauri-apps/api/tauri';
import { Modal, ModalProps } from './index';
import { FileInput, Input } from '../Input';
import { Button } from '../Button';
import { setActive } from '../../redux/global/projectSlice';
import { useGlobalDispatch } from '../../redux/global';
import { newProjectSchema } from '../../utils/schema';
import { ProjectConfig } from '../../types';

type NewProjectModalProps = Omit<ModalProps, 'title'>;

export const NewProjectModal: React.FC<NewProjectModalProps> = ({ show, onExit }) => {
    const navigate = useNavigate();

    const dispatch = useGlobalDispatch();

    return (
        <Modal title="New Project" show={show} onExit={onExit}>
            <Formik
                initialValues={{
                    name: undefined,
                    root: undefined,
                    paths: {
                        instruments: undefined,
                        bundles: undefined,
                        html_ui: undefined,
                    },
                }}
                validationSchema={newProjectSchema}
                onSubmit={(values) => {
                    const { root: path, ...project } = values;
                    invoke<ProjectConfig>('create_project', { path, project })
                        .then((project) => {
                            dispatch(setActive({ project }));
                            navigate('/workspace');
                        });
                }}
            >
                {({ values, errors, setFieldValue, submitCount }) => (
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
                        <Button className="bg-slate-700 ring-slate-700" type="submit">Submit</Button>
                    </Form>
                )}
            </Formik>
        </Modal>
    );
};
