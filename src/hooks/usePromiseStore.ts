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
  onChangeMode: (md: "work" | "break",  fn?: any) => void;
 secLeft:number;
  groupSesh: boolean;
  setSecLeft: ( num: number) => void;
  setGroupSesh: (state: boolean) => void;
  decrement: () => void;
  goalOpen: boolean;
  setGoalOpen: (state: boolean) => void;
  goal: string;
  setGoal: (goal: string) => void;
  onSoloReset: (goal: string) => void;
  
  pause: boolean;
  setPause: (state: boolean) => void;
  seshCount: number;
  setSeshCount: (num: number) => void;
  incSeshCount: () => void;
  playTick: boolean;
  setPlayTick: (state: boolean) => void;
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
      secLeft:50*60,
      setSecLeft: (num) => set({
      secLeft: num
      }),

      decrement: ()=>set(state=> ({secLeft:state.secLeft-1})),
      groupSesh: false,
      setGroupSesh: (state) => set({ groupSesh: state }),
      onChangeMode: (md, fn) => {
        console.log("onchangefuckingmode");
        set((state) => ({secLeft: md === "break" ? state.breakMin * 60 : state.workMin * 60, mode: md}));
                

        fn ? fn() : null;
       
      },
      goalOpen: false,
      setGoalOpen: (state) => set({ goalOpen: state }),
      goal: "",
      setGoal: (goal) => set({ goal: goal }),

      onSoloReset: (room) => {
        const { workMin, mode, breakMin } = get();
        set((state) => ({
          pause: true,
           secLeft: mode == "work" ? workMin * 60 : breakMin * 60,
        }));
      },
      seshCount: 0,
      setSeshCount: (num) => set({ seshCount: num }),
      incSeshCount: () =>
        set((state) => ({
          seshCount: state.seshCount + 1,
        })),
      playTick: false,
      setPlayTick: (state) => set({ playTick: state }),
    }),
    {
      name: "promise-pool",
      skipHydration: true,
    }
  )
);
