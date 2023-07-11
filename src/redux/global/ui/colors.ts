export interface ColorPalette {
    primary: string;
    secondary: string;
    text: string;
    padding: string;
    workspacePadding: string;
    background: string;
}

// using default export because tailwind.config.cjs doesn't support ESM modules.
// eslint-disable-next-line import/no-default-export
export default {
    'amethyst-dark': {
        primary: '#B47EFA',
        secondary: '#9F59F8',
        text: '#ffffff',
        padding: '#202028',
        workspacePadding: '#3B3B44',
        background: '#111217',
    },
    'flybywire-dark': {
        primary: '#00E0FE',
        secondary: '#00CCFF',
        text: '#FAFAFA',
        padding: '#171E2C',
        workspacePadding: '#1F2A3C',
        background: '#0E131B',
    },
    'atom-one-dark': {
        primary: '#E06C75',
        secondary: '#98C379',
        text: '#FAFAFA',
        padding: '#1D2025',
        workspacePadding: '#252931',
        background: '#282C34',
    },
    'monokai': {
        primary: '#A6E22E',
        secondary: '#60D8EF',
        text: '#F8F8F2',
        padding: '#1E1F1C',
        workspacePadding: '#323331',
        background: '#272822',
    },
};
