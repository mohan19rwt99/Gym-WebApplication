import React,{useEffect} from 'react'
import { useMap } from "react-leaflet";

function MoveMap({position}) {

    const map = useMap();

    useEffect(()=>{
        if(position){
            map.setView(position, 13)
        }
    }, [position, map])
  return null;
}

export default MoveMap
