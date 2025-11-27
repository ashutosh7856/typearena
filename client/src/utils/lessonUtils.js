// Lesson utilities for points calculation and retry logic

// Difficulty multipliers for points calculation
export const DIFFICULTY_MULTIPLIERS = {
  beginner: 1.0,
  easy: 1.5,
  medium: 2.0,
  hard: 3.0
};

/**
 * Calculate points earned for a lesson
 * Formula: WPM × (Accuracy/100) × Duration(minutes) × Difficulty Multiplier
 * 
 * @param {number} wpm - Words per minute
 * @param {number} accuracy - Accuracy percentage (0-100)
 * @param {number} duration - Duration in seconds
 * @param {string} difficulty - Difficulty level (beginner, easy, medium, hard)
 * @returns {number} Points earned (rounded)
 */
export const calculatePoints = (wpm, accuracy, duration, difficulty) => {
  const multiplier = DIFFICULTY_MULTIPLIERS[difficulty] || 1.0;
  const timeInMinutes = duration / 60;
  const points = wpm * (accuracy / 100) * timeInMinutes * multiplier;
  return Math.round(points);
};

/**
 * Check if a lesson can be retried
 * Rules:
 * - Can retry if never completed before
 * - Can retry if previous WPM < 35
 * - Can retry if 24 hours have passed since last attempt
 * 
 * @param {Object} completion - Last completion record (or null if never completed)
 * @param {number} completion.wpm -Last WPM achieved
 * @param {number} completion.timestamp - Last completion timestamp (ms)
 * @returns {Object} { canRetry: boolean, reason: string }
 */
export const canRetryLesson = (completion) => {
  if (!completion) {
    return { canRetry: true, reason: 'not_completed' };
  }
  
  // Allow retry if WPM was low
  if (completion.wpm < 35) {
    return { canRetry: true, reason: 'low_wpm' };
  }
  
  // Check 24-hour cooldown
  const hoursSinceLastAttempt = (Date.now() - completion.timestamp) / (1000 * 60 * 60);
  if (hoursSinceLastAttempt >= 24) {
    return { canRetry: true, reason: 'cooldown_expired' };
  }
  
  // Calculate hours remaining
  const hoursRemaining = Math.ceil(24 - hoursSinceLastAttempt);
  return { 
    canRetry: false, 
    reason: 'cooldown_active',
    hoursRemaining 
  };
};

/**
 * Get a composite lesson ID from category and difficulty
 * @param {string} category - Lesson category
 * @param {string} difficulty - Difficulty level
 * @returns {string} Composite lesson ID
 */
export const getLessonId = (category, difficulty) => {
  return `${category}-${difficulty}`;
};

/**
 * Format time remaining for cooldown display
 * @param {number} hours - Hours remaining
 * @returns {string} Formatted string (e.g., "5 hours" or "23 minutes")
 */
export const formatCooldownTime = (hours) => {
  if (hours >= 1) {
    return `${Math.floor(hours)} hour${Math.floor(hours) > 1 ? 's' : ''}`;
  }
  const minutes = Math.round(hours * 60);
  return `${minutes} minute${minutes > 1 ? 's' : ''}`;
};
