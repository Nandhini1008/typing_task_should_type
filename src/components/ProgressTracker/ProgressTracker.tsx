/**
 * Progress Tracker - Hogwarts Years & House Points
 * Kid-friendly display of progress and achievements
 */
import React, { useState } from 'react';
import { useGamificationStore } from '@/store/gamification.store';
import { Modal } from '@/components/Common/Modal';
import { Button } from '@/components/Common/Button';
import './ProgressTracker.scss';

export const ProgressTracker: React.FC = () => {
  const {
    selectedHouse,
    housePoints,
    currentYear,
    currentLevel,
    experiencePoints,
    achievements,
    spellsCast,
    reset,
    setHouse,
  } = useGamificationStore();

  const [showChangeHouseModal, setShowChangeHouseModal] = useState(false);

  const XP_PER_LEVEL = 500;
  const xpProgress = (experiencePoints / XP_PER_LEVEL) * 100;
  const unlockedAchievements = achievements.filter((a) => a.unlockedAt);

  const handleChangeHouse = (
    newHouse: 'gryffindor' | 'slytherin' | 'ravenclaw' | 'hufflepuff'
  ) => {
    reset(); // Reset all progress
    setHouse(newHouse); // Set new house
    setShowChangeHouseModal(false);
    // Reload the page to reset everything
    window.location.reload();
  };

  return (
    <>
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

          <button
            className="change-house-btn"
            onClick={() => setShowChangeHouseModal(true)}
            title="Change House"
          >
            🏰 Change House
          </button>
        </div>

        {/* Hogwarts Year Progress */}
        <div className="progress-tracker__year">
          <div className="year-display">
            <span className="year-display__label">
              Year {currentYear} - Level {currentLevel}
            </span>
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
                {experiencePoints} / {XP_PER_LEVEL} XP to next level
              </div>
            </div>
          )}

          {currentYear === 7 && (
            <div className="year-complete">🎓 Seventh Year Master!</div>
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
              {unlockedAchievements
                .slice(-3)
                .reverse()
                .map((achievement) => (
                  <div key={achievement.id} className="achievement-badge">
                    <span className="achievement-badge__icon">
                      {achievement.icon}
                    </span>
                    <span className="achievement-badge__name">
                      {achievement.name}
                    </span>
                  </div>
                ))}
            </div>
          </div>
        )}
      </div>

      {/* Change House Modal */}
      <Modal
        isOpen={showChangeHouseModal}
        onClose={() => setShowChangeHouseModal(false)}
        size="large"
      >
        <div className="change-house-modal">
          <h2 className="change-house-modal__title">⚠️ Change Your House?</h2>
          <p className="change-house-modal__warning">
            Changing your house will <strong>reset ALL your progress</strong>:
          </p>
          <ul className="change-house-modal__list">
            <li>❌ All house points will be lost</li>
            <li>❌ You'll return to Year 1</li>
            <li>❌ All achievements will be locked again</li>
            <li>❌ All stats will be reset</li>
          </ul>
          <p className="change-house-modal__confirm">
            Are you sure you want to start fresh with a new house?
          </p>

          <div className="house-selection-grid">
            <button
              className="house-card house-card--gryffindor"
              onClick={() => handleChangeHouse('gryffindor')}
            >
              <div className="house-card__icon">🦁</div>
              <div className="house-card__name">Gryffindor</div>
              <div className="house-card__trait">Brave & Daring</div>
            </button>

            <button
              className="house-card house-card--slytherin"
              onClick={() => handleChangeHouse('slytherin')}
            >
              <div className="house-card__icon">🐍</div>
              <div className="house-card__name">Slytherin</div>
              <div className="house-card__trait">Cunning & Ambitious</div>
            </button>

            <button
              className="house-card house-card--ravenclaw"
              onClick={() => handleChangeHouse('ravenclaw')}
            >
              <div className="house-card__icon">🦅</div>
              <div className="house-card__name">Ravenclaw</div>
              <div className="house-card__trait">Wise & Witty</div>
            </button>

            <button
              className="house-card house-card--hufflepuff"
              onClick={() => handleChangeHouse('hufflepuff')}
            >
              <div className="house-card__icon">🦡</div>
              <div className="house-card__name">Hufflepuff</div>
              <div className="house-card__trait">Loyal & Kind</div>
            </button>
          </div>

          <Button
            variant="ghost"
            onClick={() => setShowChangeHouseModal(false)}
            className="change-house-modal__cancel"
          >
            Cancel
          </Button>
        </div>
      </Modal>
    </>
  );
};
