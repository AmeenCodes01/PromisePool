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
  onChangeMode: (md: "work" | "break", fn?: any) => void;
  secLeft: number;
  groupSesh: boolean;
  setSecLeft: (num: number) => void;
  setGroupSesh: (state: boolean) => void;
  decrement: () => void;
  goalOpen: boolean;
  setGoalOpen: (state: boolean) => void;
  goal: string;
  setGoal: (goal: string) => void;
  onReset: () => void;

  pause: boolean;
  setPause: (state: boolean) => void;
  seshCount: number;
  setSeshCount: (num: number) => void;
  incSeshCount: () => void;
  playTick: boolean;
  setPlayTick: (state: boolean) => void;
  showVid: boolean;
  setShowVid: (state: boolean) => void;

  // solo countdown

  intervalRef: NodeJS.Timeout | null;
  recoverInterval: () => void;
  lastBell: number;
  toggleTick: () => void;
  onPause: () => void;
  onPlay: () => void;
  onPlayGroup: () => void;
  endTime: number;
  setEndTime: (num: number) => void;

}

export const usePromiseStore = create<DialogProps>()(
  persist(
    (set, get) => ({
      intervalRef: null,
      lastBell: 0,
      endTime: Date.now(),
      setEndTime: (n) => set({ endTime: n }),
      toggleTick: () => set((s) => ({ playTick: !s.playTick })),


      onPlayGroup: () => {
        const { intervalRef } = get();

        set({ pause: false });
        if (intervalRef) clearInterval(intervalRef);

        const id = setInterval(() => {
          const { endTime,playTick,workMin,secLeft,lastBell } = get();

          const remainingTime = endTime - Date.now();
          const remainingSec = Math.max(0, Math.round(remainingTime / 1000));





          set({ secLeft: remainingSec });
const tick = new Audio("/Tick.mp3");
      playTick && tick.play()

      const elapsed = workMin*60 -  secLeft 
        if (elapsed - lastBell >= 15 * 60 && playTick) {
        set({lastBell:elapsed});
        const bell = new Audio("/15min.mp3");
        bell.play();
      }

          if (remainingSec <= 0) {
            clearInterval(id);
            set({ intervalRef: null, pause: true })
          }


        }, 1000)
        set({ intervalRef: id });
      },


      onPlay: () => {
        const { pause, secLeft, intervalRef, } = get();
        if (intervalRef) clearInterval(intervalRef);

        set({ pause: false });

        const id = setInterval(() => {
          const { secLeft, pause, playTick, lastBell, workMin, mode } = get();

          if (pause) {
            clearInterval(id);
            set({ intervalRef: null });
            return;
          }

          if (secLeft <= 1) {
            clearInterval(id);
            set({ secLeft: 0, pause: true, intervalRef: null });
            return;
          }

          // Tick sound
          if (playTick) {
            const tick = new Audio("/Tick.mp3");
            tick.play();
          }

          const elapsed = workMin * 60 - secLeft;

          // 15-min bell
          if (elapsed - lastBell >= 15 * 60 && playTick && mode == "work") {
            set({ lastBell: elapsed });
            const bell = new Audio("/15min.mp3");
            bell.play();
          }

          set({ secLeft: secLeft - 1 });
        }, 1000);

        set({ intervalRef: id });
      },


      onPause: () => {
        const { intervalRef } = get();
        if (intervalRef) clearInterval(intervalRef);
        set({ pause: true, intervalRef: null });
      },

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
      secLeft: 50 * 60,
      setSecLeft: (num) => set({
        secLeft: num
      }),

      decrement: () => set(state => ({ secLeft: state.secLeft - 1 })),
      groupSesh: false,
      setGroupSesh: (state) => set({ groupSesh: state }),
      onChangeMode: (md, fn) => {
        console.log("onchangefuckingmode");
        set((state) => ({ secLeft: md === "break" ? state.breakMin * 60 : state.workMin * 60, mode: md }));


        fn ? fn() : null;

      },
      goalOpen: false,
      setGoalOpen: (state) => set({ goalOpen: state }),
      goal: "",
      setGoal: (goal) => set({ goal: goal }),

      onReset: () => {
        const { workMin, mode, breakMin , intervalRef} = get();
        if(intervalRef)clearInterval(intervalRef);

        set({
          pause: true,
          secLeft: mode == "work" ? workMin * 60 : breakMin * 60,
          intervalRef:null
        });
      },
      seshCount: 0,
      setSeshCount: (num) => set({ seshCount: num }),
      incSeshCount: () =>
        set((state) => ({
          seshCount: state.seshCount + 1,
        })),
      playTick: false,
      setPlayTick: (state) => set({ playTick: state }),
      showVid: false,
      setShowVid: (state) => set({ showVid: state }),
      recoverInterval: () => {
        const { pause, secLeft, intervalRef } = get();

        if (!pause && secLeft > 0 && !intervalRef) {
          get().onPlay();
        }
      },
    }),

    {
      name: "promise-pool",
      skipHydration: true,
      partialize: (state) =>
        Object.fromEntries(
          Object.entries(state).filter(([key]) => !['intervalRef'].includes(key)),
        ),
    }
  )
);
