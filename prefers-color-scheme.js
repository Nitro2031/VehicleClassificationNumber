const { useTheme } = Vuetify

/**
 * ユーザーのカラースキームの好みに応じてテーマを設定
 */
function prefersColorScheme() {
    const theme = useTheme();
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');
    theme.global.name.value = prefersDark.matches ? 'dark' : 'light';

    prefersDark.addEventListener('change', (e) => {
        theme.global.name.value = e.matches ? 'dark' : 'light';
    });
}
