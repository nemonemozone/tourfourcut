import React from "react"
import { theme } from "../PhotoStudio";

interface themePaletteProps {
    selectedTheme: theme;
    changeSelectedTheme: (newTheme: theme) => void;
}

export default function ThemePalette(props: themePaletteProps): React.ReactElement {
    const themes: [theme, theme, theme, theme] = ["blue", "pink", "yellow", "white"];
    const { selectedTheme, changeSelectedTheme } = props;
    return (<div className="comp_theme_palette">
        {themes.map((theme) =>
            <div className={`theme_selection ${theme} ${theme == selectedTheme && "selected"}`} onClick={() => { changeSelectedTheme(theme) }}></div>
        )}
    </div>);
}