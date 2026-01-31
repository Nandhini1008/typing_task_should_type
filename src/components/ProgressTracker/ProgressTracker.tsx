/**
 * Progress Tracker - Hogwarts Years & House Points
 * Kid-friendly display of progress and achievements
 */
import React from 'react';
import { useGamificationStore } from '@/store/gamification.store';
import './ProgressTracker.scss';

export const ProgressTracker: React.FC = () => {
  const {
    selectedHouse,
    housePoints,
    currentYear,
    experiencePoints,
    achievements,
    spellsCast
  } = useGamificationStore();

  const xpNeededForNextYear = currentYear < 7 ? currentYear * 500 : 0;
  const xpProgress = currentYear < 7 ? (experiencePoints / xpNeededForNextYear) * 100 : 100;
  const unlockedAchievements = achievements.filter(a => a.unlockedAt);

  return (
    <div className="progress-tracker">
      {/* House Badge & Points */}
      <div className="progress-tracker__house">
        <div className="house-badge" data-house={selectedHouse}>
          <div className="house-badge__icon">
            {selectedHouse === 'gryffindor' && '🦁'}
            {selectedHouse === 'slytherin' && '🐍'}
            {selectedHouse === 'ravenclaw' && '🦅'}
            {selectedHouse === 'hufflepuff' && '🦡'}
          </div>
          <div className="house-badge__name">
            {selectedHouse?.toUpperCase()}
          </div>
        </div>
        
        <div className="house-points">
          <div className="house-points__value">{housePoints}</div>
          <div className="house-points__label">House Points</div>
        </div>
      </div>

      {/* Hogwarts Year Progress */}
      <div className="progress-tracker__year">
        <div className="year-display">
          <span className="year-display__label">Hogwarts Year</span>
          <span className="year-display__value">{currentYear}</span>
        </div>
        
        {currentYear < 7 && (
          <div className="year-progress">
            <div className="year-progress__bar">
              <div
                className="year-progress__fill"
                style={{ width: `${xpProgress}%` }}
              />
            </div>
            <div className="year-progress__text">
              {experiencePoints} / {xpNeededForNextYear} XP
            </div>
          </div>
        )}
        
        {currentYear === 7 && (
          <div className="year-complete">
            🎓 Seventh Year Master!
          </div>
        )}
      </div>

      {/* Stats */}
      <div className="progress-tracker__stats">
        <div className="stat">
          <div className="stat__icon">✨</div>
          <div className="stat__value">{spellsCast}</div>
          <div className="stat__label">Spells Cast</div>
        </div>
        
        <div className="stat">
          <div className="stat__icon">🏆</div>
          <div className="stat__value">{unlockedAchievements.length}</div>
          <div className="stat__label">Achievements</div>
        </div>
      </div>

      {/* Recent Achievements */}
      {unlockedAchievements.length > 0 && (
        <div className="progress-tracker__achievements">
          <div className="achievements-title">🌟 Recent Achievements</div>
          <div className="achievements-list">
            {unlockedAchievements.slice(-3).reverse().map((achievement) => (
              <div key={achievement.id} className="achievement-badge">
                <span className="achievement-badge__icon">{achievement.icon}</span>
                <span className="achievement-badge__name">{achievement.name}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
