"use client";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  createContext,
  Dispatch,
  PropsWithChildren,
  SetStateAction,
  useContext,
  useEffect,
  useState,
} from "react";
import { Button } from "@/components/ui/button";
import { Id } from "../../../../../convex/_generated/dataModel";



type CommonProps = {
  pId?: Id<"promises">;
  btnTitle: string;
  onClick: 
   |((title: string, coins: number) => void) // Requires both
  | ((title: string) => void) // Requires only title
  | ((coins: number) => void) // Requires only coins
  | (()=>void);
  maxCoins?: number;
  
};
type PDialogProps = PropsWithChildren &
  CommonProps & { icon?: React.ReactElement; header: string; editTitle?:string; editCoins?:number; };
type PDialogCtxProps = Pick<
  CommonProps,
  "pId" | "btnTitle" | "onClick"  | "maxCoins"
> & {
  title: string;
  coins: number;
  setTitle: Dispatch<SetStateAction<string>>;
  setCoins: Dispatch<SetStateAction<number>>;
};

const PDialogContext = createContext<PDialogCtxProps | undefined>(undefined);

const usePDialogContext = () => {
  const context = useContext(PDialogContext);
  if (!context) {
    throw new Error("usePDialogCtx must be used within Promise Dialog");
  }
  return context;
};

function PromiseDialog({
  maxCoins,
  header,
  icon,
  editTitle,
  pId,
  btnTitle,
  onClick,
  children,
  editCoins
}: PDialogProps) {
  const [title, setTitle] = useState( editTitle ??"");
  const [coins, setCoins] = useState(editCoins ??0);

  return (
    <PDialogContext.Provider
      value={{
        maxCoins,
        title,
        setTitle,
        coins,
        setCoins,
        onClick,
        btnTitle,
        pId,
      }}
    >
      <Dialog>
        <DialogTrigger asChild>{icon}</DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{header}</DialogTitle>
          </DialogHeader>
          <DialogDescription></DialogDescription>
          {children}
        </DialogContent>
      </Dialog>
    </PDialogContext.Provider>
  );
}

PromiseDialog.NameInput = function DialogInput() {
  const { title, setTitle } = usePDialogContext();
  return (
    <>
      <Label>title</Label>
      <Input value={title} onChange={(e) => setTitle(e.target.value)} />
    </>
  );
};


PromiseDialog.CoinsInput = function DialogInput({title,presetCoins}:{title?:string; presetCoins?:number}) {
  const { maxCoins, coins, setCoins } = usePDialogContext();
    // useEffect(()=>{
    //   presetCoins? setCoins(presetCoins):null;
    // },[])
    
  return (
    <>
      <Label>{title ??"coins"}</Label>

      <Input
        type="number"
        min={0}
        disabled={presetCoins ? true:false}
        max={maxCoins}
        value={ presetCoins ?? coins}
        onChange={(e) => setCoins(e.target.value ? parseInt(e.target.value):0)}
      />
    </>
  );
};
function isTitleAndCoinsFunc(
  func: any
): func is (title: string, coins: number) => void {
  return func.length === 2;
}


function isTitleFunc(func: any): func is (title: string) => void {
  return func.length === 1 && typeof func === 'function';
}

function isCoinsFunc(func: any): func is (coins: number) => void {
  return func.length === 1 && typeof func === 'function';
}

function isVoidFunc(func: any): func is () => void {
  return func.length === 0 && typeof func === 'function';
}

PromiseDialog.Btn = function DialogBtn({
  customBtnTitle,
  customOnClick,
  wCoins
}: {
  customBtnTitle?: string;
  customOnClick?: () => void;
  wCoins?: number
}) {
  const { onClick, title, coins, btnTitle } = usePDialogContext();

  return (
    <DialogClose asChild>
      <Button
        variant={customBtnTitle ? "destructive" : "default"}
        onClick={() => {
          if (customBtnTitle) {
            customOnClick?.(); // Call customOnClick if it's defined
          } else {
            if (isTitleAndCoinsFunc(onClick)) {
              console.log("wef ",wCoins)
              onClick(title, wCoins as number);
            } else if (isTitleFunc(onClick)) {
              onClick(title);
            } else if (isCoinsFunc(onClick)) {
              onClick(coins);
            } else if (isVoidFunc(onClick)) {
              const voidClick = onClick as ()=>void
              voidClick() 
            }
          }
        }}  
      >
        <span>{customBtnTitle || btnTitle}</span>
      </Button>
    </DialogClose>
  );
};

export default PromiseDialog;
