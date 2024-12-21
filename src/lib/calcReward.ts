export const calcReward = (duration:number, rating:number)=>{
    const duration_in_hours = duration / 60
    const base_rate = 2
    let effective_hours
    if (duration_in_hours > 4){

        effective_hours = 4 + (duration_in_hours - 4) ** 0.5
    }
    else{

         effective_hours = duration_in_hours
    }
    
   const  coins = effective_hours * (rating / 10) * base_rate
    return Math.floor(coins)

}