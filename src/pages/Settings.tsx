import { useNavigate } from 'react-router';
import { MdClose } from 'react-icons/md';
import { ThemeButton, themeButtons } from '../components/menu/ThemeButton';

export const SettingsMenu: React.FC = () => (
    <AppearanceSettings />
);

export const AppearanceSettings: React.FC = () => {
    const navigate = useNavigate();

    const returnToHome = () => {
        navigate('/');
    };

    return (
        <div className="container px-20 pt-16 h-screen w-screen">
            <span className="flex justify-between">
                <div className="flex">
                    <button className="hover:opacity-50 transition" onClick={returnToHome}>
                        <MdClose className="text-theme-text bg-theme-padding rounded-md text-3xl p-2" />
                    </button>
                    <h1 className="text-2xl text-theme-text ml-4">Appearance Settings</h1>
                </div>
            </span>
            <h2 className="text-2xl mt-12 font-bold">Themes</h2>
            <ul className="text-lg py-4 space-y-2">
                {themeButtons.map((button) => (
                    <li key={button.themeName}>
                        <ThemeButton {...button} />
                    </li>
                ))}
            </ul>
        </div>
    );
};
