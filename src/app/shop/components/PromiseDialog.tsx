"use client";
import { LucideProps, Plus } from "lucide-react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
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
  useState,
} from "react";
import { Button } from "@/components/ui/button";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { Id } from "../../../../convex/_generated/dataModel";
import { edit } from "../../../../convex/promises";
type CommonProps = {
  pId?: Id<"promises">;
  btnTitle: string;
  onClick: 
   |((title: string, coins: number) => void) // Requires both
  | ((title: string) => void) // Requires only title
  | ((coins: number) => void); // Requires only coins
  maxCoins?: number;
  
};
type PDialogProps = PropsWithChildren &
  CommonProps & { icon?: React.ReactElement; header: string; editTitle?:string; };
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
}: PDialogProps) {
  console.log(editTitle)
  const [title, setTitle] = useState( editTitle ??"");
  const [coins, setCoins] = useState(0);

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
            <DialogTitle>Create New Promise</DialogTitle>
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

PromiseDialog.CoinsInput = function DialogInput() {
  const { maxCoins, coins, setCoins } = usePDialogContext();

  return (
    <>
      <Label>coins</Label>

      <Input
        type="number"
        min={0}
        max={maxCoins}
        value={coins}
        onChange={(e) => setCoins(parseInt(e.target.value))}
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

PromiseDialog.Btn = function DialogBtn({
  customBtnTitle,
  customOnClick,
}: {
  customBtnTitle?: string;
  customOnClick?: () => void;
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
              onClick(title, coins);
            } else if (isTitleFunc(onClick)) {
              onClick(title);
            } else if (isCoinsFunc(onClick)) {
              onClick(coins);
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
