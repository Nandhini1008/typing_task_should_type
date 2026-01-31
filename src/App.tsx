import { useEffect, useState } from 'react';
import { AppRoutes } from './routes';
import { useSettingsStore } from './store/settings.store';
import { useGamificationStore, type House } from './store/gamification.store';
import { getTheme } from './constants/themes';
import { HouseSelection } from './components/HouseSelection/HouseSelection';
import { MagicalBackground } from './components/MagicalBackground/MagicalBackground';
import './styles/themes/harry-potter.css';
import './styles/global.scss';

function App() {
  const currentTheme = useSettingsStore((state) => state.theme.currentTheme);
  const { selectedHouse, setHouse } = useGamificationStore();
  const [showHouseSelection, setShowHouseSelection] = useState(false);

  // Apply theme to document
  useEffect(() => {
    const theme = getTheme(currentTheme);
    document.documentElement.setAttribute('data-theme', theme.id);

    // Check if house has been selected
    if (!selectedHouse) {
      setShowHouseSelection(true);
    }
  }, [currentTheme, selectedHouse]);

  // Apply house theme to body
  useEffect(() => {
    if (selectedHouse) {
      document.body.setAttribute('data-house', selectedHouse);
    }
  }, [selectedHouse]);

  const handleHouseSelected = (house: House) => {
    setHouse(house);
    setShowHouseSelection(false);
  };

  return (
    <>
      <MagicalBackground />
      
      {showHouseSelection && (
        <HouseSelection onHouseSelected={handleHouseSelected} />
      )}
      
      {!showHouseSelection && <AppRoutes />}
    </>
  );
}

export default App;
