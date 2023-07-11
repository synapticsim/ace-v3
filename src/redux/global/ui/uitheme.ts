import colors, { ColorPalette } from './colors';

export interface ThemeConfig {
    name: string;
    title: string | undefined;
    colors: ColorPalette;
}

const themeTitles = new Map([
    ['amethyst-dark', 'Amethyst Dark'],
    ['flybywire-dark', 'FlyByWire Dark'],
    ['atom-one-dark', 'Atom One Dark'],
    ['monokai', 'Monokai'],
]);

// Then modify the theme creation code to include the title:
export const themes = Object.entries(colors).map(([name, color]) => ({
    name,
    title: themeTitles.get(name) ?? 'Title', // This will match the title based on the name
    colors: color,
}));

export const themeConfigs = new Map<String, ThemeConfig>();
themes.forEach((theme) => themeConfigs.set(theme.name, theme));

export const fallbackThemeConfig: ThemeConfig = {
    name: 'amthyst-dark',
    title: 'Amethyst Dark',
    colors: colors['amethyst-dark'],
};
