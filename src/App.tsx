import React, { useEffect } from 'react';
import { AppRoutes } from './routes';
import { useSettingsStore } from './store/settings.store';
import { getTheme } from './constants/themes';
import './styles/global.scss';

function App() {
  const currentTheme = useSettingsStore((state) => state.theme.currentTheme);

  // Apply theme to document
  useEffect(() => {
    const theme = getTheme(currentTheme);
    document.documentElement.setAttribute('data-theme', theme.id);
  }, [currentTheme]);

  return <AppRoutes />;
}

export default App;
