"use client";
import React, { Fragment } from "react";
import Promise from "./components/Promise";
import { api } from "../../../convex/_generated/api";
import { Coins, Plus } from "lucide-react";
import { useMutation, useQuery } from "convex/react";
import PromiseDialog from "./components/PromiseDialog";

function page() {
  const user = useQuery(api.users.current);
  const promises = useQuery(api.promises.get);
  const create = useMutation(api.promises.create);
  const createPromise = async (title: string, coins: number) => {
    console.log(title, coins);
    await create({ title, coins });
  };

  return (
    <div className="w-full h-full">
      <div className="w-full flex flex-row p-2 justify-between   ">
        <div className="self-center my-auto">
          <PromiseDialog
            maxCoins={user?.pCoins as number}
            icon={<Plus />}
            header={"Create new promise"}
            btnTitle="Create"
            onClick={createPromise}
          >
            <PromiseDialog.NameInput />
            <PromiseDialog.CoinsInput />
            <PromiseDialog.Btn/>
          </PromiseDialog>
        </div>
        <div>
          <span className="text-center my-auto text-xs mr-2">promise</span>
          <div className="border-2 rounded-md t justify-center p-2 w-fit h-fit flex flex-row gap-2 ">
            <div>
              <Coins />

              <span>{user?.pCoins}</span>
            </div>
          </div>
        </div>
        {/* <span>watch coins</span>
            <div className='border-2 p-2 w-fit h-fit'>{user?.wCoins}</div> */}
      </div>
      {/* Promises */}
      <div className="  grid grid-cols-4 gap-4 ">
        {promises ? (
          promises.map((p) => (
            <Fragment key={p._id}>
              <Promise promise={p} />

              {/* <Promise promise={p.title} coins={p.coins ?? 0} key={p._id}/> */}
            </Fragment>
          ))
        ) : (
          <span>No promises</span>
        )}
      </div>

      {/*Watch coins*/}
    </div>
  );
}

export default page;
