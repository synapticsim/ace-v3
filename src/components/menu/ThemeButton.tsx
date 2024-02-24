import { useEffect, useState } from 'react';
import { MdCheckCircle } from 'react-icons/md';
import { useGlobalSelector, GlobalState, GlobalDispatch, useGlobalDispatch } from '../../redux/global';
import { themeConfigs, fallbackThemeConfig, themes } from '../../redux/global/ui/uitheme';
import { setTheme } from '../../redux/global/configSlice';
import { Button } from '../Button';

export interface ThemeButtonProps {
    themeName: string;
    title: string | undefined;
    className?: string;
}

export const ThemeButton: React.FC<ThemeButtonProps> = ({ themeName, title, className }: ThemeButtonProps) => {
    const globalDispatch = useGlobalDispatch<GlobalDispatch>();

    const { theme } = useGlobalSelector((state: GlobalState) => state.config);

    const themeConfig = theme !== undefined ? theme : fallbackThemeConfig;

    const { colors: { primary, accent, text, padding, workspacePadding, background } } = themeConfig;

    const [selected, setSelected] = useState(themeConfig.name === themeName);

    const changeTheme = (name: string) => {
        const newThemeConfig = themeConfigs.get(name);

        if (newThemeConfig === undefined) {
            console.error(`Theme ${name} not found.`);
            return;
        }

        globalDispatch(setTheme(newThemeConfig));
    };

    useEffect(() => {
        setSelected(themeConfig.name === themeName);
    }, [themeConfig, themeName]);

    useEffect(() => {
        document.documentElement.style.setProperty('--primary-color', primary);
        document.documentElement.style.setProperty('--accent-color', accent);
        document.documentElement.style.setProperty('--text-color', text);
        document.documentElement.style.setProperty('--padding-color', padding);
        document.documentElement.style.setProperty('--workspace-padding-color', workspacePadding);
        document.documentElement.style.setProperty('--background-color', background);
    }, [background, padding, primary, accent, workspacePadding, text]);

    return (
        <Button className={`flex w-64 ${className}`} onClick={() => changeTheme(themeName)}>
            <MdCheckCircle
                className={`mt-1 mx-4 transition-opacity duration-200 ease-in-out 
                ${selected ? 'opacity-100' : 'opacity-0'}`}
                size={20}
            />
            {title}
        </Button>
    );
};

export const themeButtons = themes.map((theme) => {

    return {
        themeName: theme.name,
        title: theme.title,
        className: 'font-mono hover:font-semibold',
    };
});
