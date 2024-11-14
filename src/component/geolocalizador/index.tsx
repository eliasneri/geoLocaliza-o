import React, { useState, useEffect } from 'react';
import ModalLocalizador from "../modal/modalLocalizador";
import { Button } from 'rsuite';
import axios from 'axios';

interface Coordenadas {
   latitude: number | null;
   longitude: number | null;
}

interface AddressDetails {
   formatted_address: string;
   neighborhood: string;
   city: string;
   state: string;
   country: string;
}

const Geolocalizacao: React.FC = () => {
   const [showModal, setShowModal] = useState<boolean>(false);
   const [coordenadas, setCoordenadas] = useState<Coordenadas | null>(null);
   const [erro, setErro] = useState<string | null>(null);

   useEffect(() => {
      const obterGeolocalizacao = () => {
         if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
               (position) => {
                  setCoordenadas({
                     latitude: position.coords.latitude,
                     longitude: position.coords.longitude,
                  });
               },
               (err) => {
                  setErro(`Erro ao obter localização: ${err.message}`);
               }
            );
         } else {
            setErro('Geolocalização não é suportada neste navegador.');
         }
      };

      obterGeolocalizacao();
   }, []);

   useEffect(() => {
      if (showModal) {
         console.log('Modal está agora visível.');
      }
   }, [showModal]);

   const enviarGeolocalizacao = async () => {
      if (coordenadas) {
         try {
            const resposta = await fetch('/api/salvar-geolocalizacao', {
               method: 'POST',
               headers: {
                  'Content-Type': 'application/json',
               },
               body: JSON.stringify(coordenadas),
            });

            if (resposta.ok) {
               alert('Geolocalização salva com sucesso!');
            } else {
               alert('Erro ao salvar geolocalização.');
            }
         } catch (error) {
            alert('Erro de rede: ' + error);
         }
      }
   };

   const mostrarGeolocalizacao = async () => {
      if (coordenadas) {
         console.log("Coordenadas: ", coordenadas)
         setShowModal(true);
      }
   };

   const onCloseModal = () => {
      setShowModal(false);
   }

   return (
      <div>
         <h1>Geolocalização</h1>
         {erro && <p>{erro}</p>}
         {coordenadas ? (
            <div>
               <p>Latitude: {coordenadas.latitude}</p>
               <p>Longitude: {coordenadas.longitude}</p>
               <Button onClick={mostrarGeolocalizacao} appearance="primary">Salvar Geolocalização</Button>
            </div>
         ) : (
            <p>Obtendo localização...</p>
         )}
         {coordenadas && (
            <ModalLocalizador
               show={showModal}
               coordenadas={coordenadas}
               onClose={onCloseModal}
            />
         )}
      </div>
   );
};

export default Geolocalizacao;