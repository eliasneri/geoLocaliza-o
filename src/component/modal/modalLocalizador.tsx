import { Modal, Button, Placeholder } from 'rsuite';
import { GoogleMap, Marker, Circle, useLoadScript } from '@react-google-maps/api';
import React, { useEffect, useState } from 'react';
import axios from 'axios';

interface ModalProps {
   show: boolean;
   coordenadas: Coordenadas | null;
   onClose: () => void;
}

interface Coordenadas {
   latitude: number | null;
   longitude: number | null;
}

interface Coorde {
   latitude: number;
   longitude: number;
}

const ModalLocalizador: React.FC<ModalProps> = ({ show, coordenadas, onClose }) => {
   const [open, setOpen] = useState(show);
   const [userLocation, setUserLocation] = useState<Coordenadas | null>(null);
   const [address, setAddress] = useState<string | null>(null);

   const { isLoaded } = useLoadScript({
      googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY || "",
   });

   useEffect(() => {
      setOpen(show);
   }, [show]);

   useEffect(() => {
      const fetchAddress = async () => {
         if (coordenadas?.latitude && coordenadas?.longitude) {
            try {
               const response = await axios.get(
                  `https://maps.googleapis.com/maps/api/geocode/json?latlng=${coordenadas.latitude},${coordenadas.longitude}&key=${process.env.REACT_APP_GOOGLE_MAPS_API_KEY}`
               );
               const addressResult = response.data.results[0]?.formatted_address;
               setAddress(addressResult || "Endereço não encontrado");
            } catch (error) {
               console.error("Erro ao buscar o endereço:", error);
               setAddress("Erro ao carregar o endereço");
            }
         }
      };

      fetchAddress();
   }, [coordenadas]);

   const handleClose = () => {
      setOpen(false);
      onClose();
   };

   let coorde: Coorde = {
      latitude: 0,
      longitude: 0,
   };
   if (coordenadas) {
      coorde.longitude = coordenadas.longitude || 0;
      coorde.latitude = coordenadas.latitude || 0;
   }

   const center = { lat: coorde.latitude, lng: coorde.longitude };
   const userLatLng = coorde ? { lat: coorde.latitude, lng: coorde.longitude } : null;

   return (
      <>
         <Modal size="md" open={show} backdrop="static">
            <Modal.Header>
               <Modal.Title>Localização</Modal.Title>
            </Modal.Header>
            <Modal.Body>
               {isLoaded ? (
                  <GoogleMap mapContainerStyle={{ height: '500px', width: '100%' }} center={center} zoom={16}>
                     <Marker position={center} label="Destino" />
                     {userLatLng && (
                        <>
                           <Marker
                              position={userLatLng}
                              label="Você"
                              icon={{
                                 url: "https://maps.google.com/mapfiles/ms/icons/blue-dot.png",
                              }}
                           />
                           <Circle
                              center={userLatLng}
                              radius={50} // Raio de 50 metros para indicar a área
                              options={{
                                 fillColor: "#4285F4",
                                 fillOpacity: 0.2,
                                 strokeColor: "#4285F4",
                                 strokeOpacity: 0.6,
                                 strokeWeight: 5,
                              }}
                           />
                        </>
                     )}
                  </GoogleMap>
               ) : (
                  <p>Carregando mapa...</p>
               )}
               {address && <p>Endereço: {address}</p>}
            </Modal.Body>
            <Modal.Footer>
               <Button onClick={handleClose} appearance="primary">
                  FECHAR
               </Button>
            </Modal.Footer>
         </Modal>
      </>
   );
};

export default ModalLocalizador;