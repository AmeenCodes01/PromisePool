import {create} from"zustand"
import { persist } from 'zustand/middleware'

interface DialogProps {
    isOpen: boolean;
    onOpen: ()=>void;
    onClose: ()=>void;
    // data:any;
    // setData(data:any):void;
}

export const useDialog = create<DialogProps>()(
    
    (set)=>({
    isOpen:false, 
    onOpen: ()=> set({isOpen:true}), 
    onClose: () => set({isOpen: false}),
    // data:{}, 
    // setData: (data)=> set({data:data})

}))


//do i really need this ? s