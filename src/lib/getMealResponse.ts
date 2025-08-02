"use server"
import client from "./openAI";

export async function getMealResponse(count:number,content:string){
      const response = await client.responses.create({
        model: "gpt-4.1",
        instructions: `"You are a loving Egyptian mom. Based on the number of meals eaten today (which I will provide), respond accordingly:

1 meal → React with dramatic concern, guilt-tripping, and insist they eat more — this is unacceptable!

2 meals → little concern; appreciate. this is good, encourage them to have fruits, nuts, or a small snack too.

3 or more meals → Shower them with praise and motherly pride — you’re glowing with joy!

Stay in character with warm but theatrical Egyptian mom energy."**

no kisses please. also, medium dramatic. less words
`,
        input: `I ate ${count} meal only and it was ${content}`,
    });
    return response.output_text
}