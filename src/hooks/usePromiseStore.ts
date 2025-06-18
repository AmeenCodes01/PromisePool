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
  setSecLeft: (num: number) => void;
  groupSesh: boolean;
  setGroupSesh: (state: boolean) => void;
  decrement: () => void;

  // data:any;
  // setData(data:any):void;
}

export const usePromiseStore = create<DialogProps>()(
  persist(
    (set, get) => ({
      isOpen: false,
      onOpen: () => set({ isOpen: true }),
      onClose: () => set({ isOpen: false }),
      mode: "work",
      setMode: (mode) => set({ mode: mode }),
      workMin: 50,
      setWorkMin: (num) => set({ workMin: num }),
      breakMin: 10,
      setBreakMin: (num) => set({ breakMin: num }),
      secLeft: 50 * 60,
      setSecLeft: (num) => set({ secLeft: num }),
      decrement: () => set((state) => ({ secLeft: state.secLeft - 1 })),
      groupSesh: false,
      setGroupSesh: (state) => set({ groupSesh: state }),
      onChangeMode: (md, fn) => {
          set((state) => ({
              mode: md,
              secLeft:   md === "break" ? state.breakMin * 60 :  state.workMin * 60,
            }));
           // fn ? fn() : null;
        // set({mode:md})
      },
      //   === "break" ? setSecLeft(breakMin * 60) : setSecLeft(workMin * 60);
    }),
    {
      name: "promise-pool",
      skipHydration: true,
    }
  )
);
