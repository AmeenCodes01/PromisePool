export const calcReward = (duration:number, rating:number) => {
    const base_rate = 10; // Base rate multiplier
    const min_duration = 10; // Minimum duration required for coins
    const max_duration = 300; // Cap duration at 400 minutes
  
    if (duration < min_duration) {
      // No reward for durations less than 10 minutes
      return 0;
    }
  
    // Cap the duration at 400 minutes
    const effective_minutes = Math.min(duration, max_duration);
    const effective_hours = effective_minutes / 60;
  
    // Calculate coins based on duration, rating, and base rate
    const coins = effective_hours * (rating / 5) * base_rate;
  
    // Return whole number coins
    return Math.floor(coins);
  };