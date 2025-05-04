export default function calcRewards(durationMinutes: number, rating: number, isManual = false): number {
  rating = Math.max(1, Math.min(rating, 10));

  const baseRatePerMinute = 0.2;
  const ratingMultiplier = 0.8 + (rating / 20);
     let coins;
if(rating>4){
   coins = durationMinutes * baseRatePerMinute* ratingMultiplier;
   
}else{
     coins = durationMinutes * 0.05 * ratingMultiplier;
}
 
  // Bonus for long timer sessions only
  if (!isManual && durationMinutes >= 90) {
    coins += 10;
  }

  // Soften reward after 120 min for timer sessions
  if (!isManual && durationMinutes > 120) {
    const excessMinutes = durationMinutes - 120;
    coins += excessMinutes * 0.15 * ratingMultiplier;
  }

  // Manual logs get full rewards, no cap, no diminish
  return Math.floor(coins);
}
