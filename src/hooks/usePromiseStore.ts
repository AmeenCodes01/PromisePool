import { create } from "zustand";
import { persist } from "zustand/middleware";

interface DialogProps {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
  mode: string;
  setMode: (mode: "work" | "break") => void;
  setWorkMin: (num: number) => void;
  setBreakMin: (num: number) => void;
  workMin: number;
  breakMin: number;
  onChangeMode: (md: "work" | "break", room:string,fn?: any) => void;
  timers: {
    [roomId: string]: {
      secLeft: number;
    };
  };
  groupSesh: boolean;
  setSecLeft: (room: string, num: number) => void;
  setGroupSesh: (state: boolean) => void;
  decrement: (room: string) => void;
  goalOpen: boolean;
  setGoalOpen: (state: boolean) => void;
  goal: string;
  setGoal: (goal: string) => void;
  onSoloReset: (goal: string) => void;
  getOrCreateTimer: (room:string) => {secLeft:number};  
  pause: boolean;
  setPause: (state:boolean)=>void;

  // data:any;
  // setData(data:any):void;
}

export const usePromiseStore = create<DialogProps>()(
  persist(
    (set, get) => ({
      isOpen: false,
      onOpen: () => set({ isOpen: true }),
      onClose: () => set({ isOpen: false }),
      pause: true,
    setPause: (state) => set({ pause: state }),
      mode: "work",
      setMode: (mode) => set({ mode: mode }),
      workMin: 50,
      setWorkMin: (num) => set({ workMin: num }),
      breakMin: 10,
      setBreakMin: (num) => set({ breakMin: num }),
timers:{

},
 getOrCreateTimer: (room:string) => {
        const state = get();
        if (!state.timers[room]) {
          set({
            timers: {
              ...state.timers,
              [room]: {
                secLeft:state.workMin * 60, // default value
              },
            },
          });
        }
        return get().timers[room];
      },

       setSecLeft: (room, num) => {
        const timer = get().getOrCreateTimer(room);
        set((state) => ({
          timers: {
            ...state.timers,
            [room]: {
              
              secLeft: num,
            },
          },
        }));
      },



      decrement: (room) => {
        const timer = get().getOrCreateTimer(room);
        set((state) => ({
          timers: {
            ...state.timers,
            [room]: {
              secLeft: timer.secLeft - 1,
            },
          },
        }));
      },
      groupSesh: false,
      setGroupSesh: (state) => set({ groupSesh: state }),
      onChangeMode: (md, room,fn) => {
        console.log("onchangefuckingmode", )
        set((state) => ({
          mode: md,
           timers: {
      ...state.timers,
      [room]: {
        secLeft: md === "break" ? state.breakMin * 60 : state.workMin * 60,
          },
    },
        }));
        fn ? fn() : null;
        // set({mode:md})
      },
      goalOpen: false,
      setGoalOpen: (state) => set({ goalOpen: state }),
      goal: "",
      setGoal: (goal) => set({ goal: goal }),
      
    
onSoloReset: (room) => {
  const { workMin } = get();
  set((state) => ({
    pause: true,
    timers: {
      ...state.timers,
      [room]: {
        secLeft: workMin * 60,
      },
    },
  }));
},
    
    }),
    {
      name: "promise-pool",
      skipHydration: true,
    }
  )
);
