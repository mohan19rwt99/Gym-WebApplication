import React, { useState } from 'react'
import { MapContainer, TileLayer, useMapEvent, useMapEvents } from 'react-leaflet'
import axios from 'axios'
import toast from 'react-hot-toast'
import DraggableMarker from './DraggableMarker'
import MoveMap from './MoveMap'
import "leaflet/dist/leaflet.css";

const GymLocationMap = ({ position, setPosition, setFormData }) => {
    
    const [searchQuery, setSearchQuery] = useState("")
    const [street, setStreet] = useState("")


    const searchLocation = async () => {
        if (!searchQuery) return;
        try {
            const response = await axios.get(`https://nominatim.openstreetmap.org/search?format=json&q=${searchQuery}`)
            console.log("response from map", response.data)
            if (response.data.length > 0) {
                const { lat, lon } = response.data[0]
                setPosition({ lat: parseFloat(lat), lng: parseFloat(lon) })
                
                setFormData((prevState) => ({
                    ...prevState,
                    address: {
                        "location":response.data[0].name,
                        "street":street,
                        "place_id":response.data[0].place_id,
                    }
                  }));
                  console.log(("SetForm Data", setFormData))
            } else {
                toast.error("Location not found. Try a different search.");
            }
        } catch (error) {
            toast.error("Failed to search location.");
        }
    }


    const handleStreetChange=(e)=>{
            const newStreet = e.target.value;
            setStreet(newStreet)
            setFormData((prevState)=>({
                ...prevState,
                address:{
                    ...prevState.address,
                    street:newStreet,
                }
            }))
    }
   

    return (
        <>
            <div className='mb-4 flex'>
                <input 
                value={street}
                onChange={handleStreetChange}
                type="text" 
                className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-cyan-600 focus:border-cyan-600 block w-full p-2.5"
                placeholder="Enter street name"/>

               {/* {Search Map} */}
                <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                     className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-cyan-600 focus:border-cyan-600 block w-full p-2.5"
                     placeholder='Enter Your City Name'
                />
                <button
                    type='button'
                    onClick={() => searchLocation()}
                    className='ml-2 bg-cyan-600 text-white px-4 py-2 rounded-lg hover:bg-cyan-700 transition'
                >
                    Search
                </button>
            </div>
            <div className='h-80 w-full border rounded-lg overflow-hidden'>
                <MapContainer center={position} zoom={13} style={{ height: "100%", width: "100%" }}>

                    <TileLayer url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png' />
                    <MoveMap position={position} />
                    <DraggableMarker position={position} setPosition={setPosition}/>
                </MapContainer>

                <p className="text-gray-600 text-sm mt-2">Search for a location or drag the marker to adjust.</p>
            </div>
        </>
    )
}

export default GymLocationMap
