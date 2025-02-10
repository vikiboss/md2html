export const config = {
  host: process.env.HOST || 'localhost',
  port: process.env.PORT || 3000,
  darkTheme: process.env.SHIKI_DARK_THEME || 'one-dark-pro',
  lightTheme: process.env.SHIKI_LIGHT_THEME || 'one-light',
  defaultColor: process.env.SHIKI_DEFAULT_COLOR || 'light',
}
