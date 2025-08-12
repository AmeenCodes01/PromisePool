"use client"

import React, {useState} from "react";
import {MapContainer, GeoJSON, Pane, useMap} from "react-leaflet";
import mapData from "../../../data/countries.json";
import "leaflet/dist/leaflet.css";
import { Doc } from "../../../../convex/_generated/dataModel";

function SetViewOnClick({coords, zoomed}) {
  const map = useMap();
  map.setView(coords, zoomed ? 3 : map.getZoom());
  // setZoom(false);

  return null;
}

function Map({users, center}:{users:Doc<"users">[]|undefined; center:  number[]|undefined}) {
  
  const [key, setKey] = useState(1);
  // saves country, color + offset+*
  // selectedMap saves geoJSON of selected country.
  const [zoomed, setZoom] = useState(false);

  const countryStyle = {
    color: "black",
    weight: 1,
    fillOpacity: 0.75,
    opacity: 10,
  };



  const onEachCountry = (country, layer) => {
    let countryName = country.properties.ADMIN;
    let color = "#e6dfdf";
    
    users?.map(u =>{
      if(

        u.country === countryName && u.countryprops?.color &&u.countryprops?.color   !==""
      ){
        color = u.countryprops?.color
      }
    })

    layer.setStyle({
      fillColor: color,
    });
    layer.bindPopup(countryName);
  };

  //   for (let i = 0; i < users.length; i++) {
  //     console.log(countryName, users[i].color , "colorU")
  //     if (countryName === users[i]) {
  //       color = users[i].color;
  //     }
  //   }
  //   layer.setStyle({
  //     fillColor: color,
  //   });
  //   layer.bindPopup(countryName);
  // };
  console.log(center,zoomed, " ccoomzd")
  return (
    <MapContainer
      style={{
        width: "100%",
        // backgroundImage: `linear-gradient(to bottom, #CAF0F8, rgb(116, 192, 219))`,
        zIndex: 0,
      }}
      className="min-h-[75vh] leaflet-container  "
      zoom={3}
      center={center}
    >
      <Pane name="custom-pane" style={{zIndex: 0}}>
        <GeoJSON
          key={key}
          style={countryStyle}
          data={mapData.features}
          onEachFeature={onEachCountry}
        />

        {/* <SetViewOnClick coords={center} zoomed={zoomed} /> */}
      </Pane>
    </MapContainer>
  );
}

export default Map;