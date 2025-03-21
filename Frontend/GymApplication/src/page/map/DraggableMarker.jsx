import React from 'react'
import {Marker, Popup, useMapEvents} from "react-leaflet";

function DraggableMarker({position, setPosition}) {

  useMapEvents({
      click(e){
        setPosition({lat: e.latlng.lat, lng: e.latlng.lng})
      }
  })
  return (
    <div>
        <Marker
        position={position}
        draggable={true}
        eventHandlers={{
          dragend:(e)=>{
            setPosition({ 
              lat: e.target.getLatLng().lat, 
              lng: e.target.getLatLng().lng});
          }
        }}
        >
          <Popup>Drag to adjust gym location</Popup>   
        </Marker>
    </div>
  )
}

export default DraggableMarker
