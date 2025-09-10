"use client";
import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";

import { useQuery } from "convex/react";
import { api } from "../../../../../convex/_generated/api";
import { Button } from "@/components/ui/button";
import CountryDropDown from "./CountryDropDown";
function MapComp() {
  const [show, setShow] = useState(true);
  const Map = dynamic(() => import("../Map"), { ssr: false });
  const users = useQuery(api.users.getForMap);
  const user = useQuery(api.users.current);

  const included = users?.filter((u) => u._id == user?._id);

  useEffect(() => {
    setShow(user?.country ? false : true);
  }, [user]);

  console.log(show)
  return (
    <div className="w-full h-full">
      <Map
        users={users}
        center={included && user?.countryprops?.coords ? user?.countryprops?.coords : [30.3753, 69.3451]}
      />

      <div>
        {show ? (
            <CountryDropDown users={users} />
        ) : (
          <Button className="m-4" onClick={() => setShow(true)}>
            Change country
          </Button>
        )}
      </div>
    </div>
  );
}

export default MapComp;
