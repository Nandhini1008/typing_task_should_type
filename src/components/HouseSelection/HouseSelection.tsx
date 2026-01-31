/**
 * House Selection Component
 * Interactive screen for kids to choose their Hogwarts House
 */
import React, { useState } from 'react';
import './HouseSelection.scss';

export type House = 'gryffindor' | 'slytherin' | 'ravenclaw' | 'hufflepuff';

interface HouseSelectionProps {
  onHouseSelected: (house: House) => void;
}

const houses = [
  {
    name: 'gryffindor',
    display: 'Gryffindor',
    colors: ['#740001', '#D3A625'],
    traits: '⚡ Brave & Bold',
    icon: '🦁',
    description: 'For the brave and courageous!'
  },
  {
    name: 'slytherin',
    display: 'Slytherin',
    colors: ['#1A472A', '#AAAAAA'],
    traits: '🐍 Clever & Cunning',
    icon: '🐍',
    description: 'For the ambitious and clever!'
  },
  {
    name: 'ravenclaw',
    display: 'Ravenclaw',
    colors: ['#0E1A40', '#946B2D'],
    traits: '🦅 Smart & Wise',
    icon: '🦅',
    description: 'For the wise and creative!'
  },
  {
    name: 'hufflepuff',
    display: 'Hufflepuff',
    colors: ['#FFD700', '#000000'],
    traits: '🦡 Kind & Loyal',
   icon: '🦡',
    description: 'For the loyal and hardworking!'
  }
];

export const HouseSelection: React.FC<HouseSelectionProps> = ({ onHouseSelected }) => {
  const [selectedHouse, setSelectedHouse] = useState<House | null>(null);
  const [showConfetti, setShowConfetti] = useState(false);

  const handleSelectHouse = (house: House) => {
    setSelectedHouse(house);
    setShowConfetti(true);
    
    // Confetti animation then callback
    setTimeout(() => {
      onHouseSelected(house);
    }, 2000);
  };

  return (
    <div className="house-selection">
      {showConfetti && (
        <div className="confetti">
          {[...Array(50)].map((_, i) => (
            <div
              key={i}
              className="confetti__piece"
              style={{
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 0.5}s`,
                backgroundColor: selectedHouse ? houses.find(h => h.name === selectedHouse)?.colors[0] : '#FFD700'
              }}
            />
          ))}
        </div>
      )}

     <div className="house-selection__content">
        <h1 className="house-selection__title">
          ✨ Choose Your Hogwarts House! ✨
        </h1>
        
        <p className="house-selection__subtitle">
          Which house will you join on your magical typing journey?
        </p>

        <div className="house-selection__houses">
          {houses.map((house) => (
            <button
              key={house.name}
              className={`house-card ${selectedHouse === house.name ? 'house-card--selected' : ''}`}
              onClick={() => handleSelectHouse(house.name as House)}
              style={{
                borderColor: house.colors[0],
                background: `linear-gradient(135deg, ${house.colors[0]}22 0%, ${house.colors[1]}22 100%)`
              }}
            >
              <div className="house-card__icon">{house.icon}</div>
              <h2 className="house-card__name" style={{ color: house.colors[0] }}>
                {house.display}
              </h2>
              <p className="house-card__traits">{house.traits}</p>
              <p className="house-card__description">{house.description}</p>
              
              <div className="house-card__stars">
                {[...Array(5)].map((_, i) => (
                  <span key={i} className="star">⭐</span>
                ))}
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
