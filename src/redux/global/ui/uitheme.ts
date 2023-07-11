import colors, { ColorPalette } from './colors';

export interface ThemeConfig {
    name: string;
    colors: ColorPalette;
}

// using a map since it's more clear to read fetched items than an array
// The name member makes debugging easier
export const themes = Object.entries(colors).map(([name, color]) => ({
    name,
    colors: color,
}));

export const themeConfigs = new Map<String, ThemeConfig>();
themes.forEach((theme) => themeConfigs.set(theme.name, theme));

export const fallbackThemeConfig: ThemeConfig = {
    name: 'default-dark',
    colors: colors['default-dark'],
};
