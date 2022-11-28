import * as Yup from 'yup';

export const newProjectSchema = Yup.object({
    name: Yup.string().required('Required'),
    root: Yup.string().required('Required'),
    paths: Yup.object({
        instruments: Yup.string().required('Required'),
        bundles: Yup.string().required('Required'),
        html_ui: Yup.string().required('Required'),
    }),
});
