import { MdSettings } from 'react-icons/md';
import { Menu } from './index';
import { ThemeButton, themeButtons } from './ThemeButton';

interface SettingsMenuCanvasProps {
    show?: boolean;
    onClick?: () => void;
    onExit?: () => void;
}

export const SettingsMenuCanvas: React.FC<SettingsMenuCanvasProps> = ({ ...props }) => (
    <Menu title="Settings" icon={<MdSettings size={25} />} {...props}>
        <div className="px-6 py-5">
            <div className="container grid items-center mb-4">
                <h3>Theme</h3>
                <ul>
                    {themeButtons.map((button) => (
                        <li key={button.themeName}>
                            <ThemeButton {...button} />
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    </Menu>
);
