const getTheme = () => {
    const theme = window.matchMedia('(prefers-color-scheme: dark)')
    
    if (theme.matches) {
        return "dark";
    } else {
        return "light";
    }
};

export default getTheme;