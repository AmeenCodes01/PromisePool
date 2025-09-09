"use client"

export function notifyUser(title: string, body: string) {
  if (!("Notification" in window)){
return;
    
  } 
console.log("running")
  if (Notification.permission === "granted") {
    new Notification(title, { body });
  } else if (Notification.permission !== "denied") {
    Notification.requestPermission().then((permission) => {
      if (permission === "granted") {
        new Notification(title, { body });
      }
    });
  }
}
