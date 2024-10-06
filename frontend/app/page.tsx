"use client";
import { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import "leaflet-toolbar";
import "leaflet-toolbar/dist/leaflet.toolbar.css";

// Extend the L object to include Toolbar2
declare module "leaflet" {
  namespace Toolbar2 {
    class Control extends L.Control {
      constructor(options?: any);
    }
    class Action extends L.Handler {
      constructor(options?: any);
    }
  }
}
import "leaflet-toolbar/dist/leaflet.toolbar.css";
import Image from "next/image";

// Create a custom red dot icon using inline SVG
const redDotIcon = new L.Icon({
  iconUrl:
    "data:image/svg+xml;base64," +
    btoa(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 12 12" width="12" height="12">
      <circle cx="6" cy="6" r="6" fill="red" />
    </svg>
  `),
  iconSize: [10, 10], // Adjust the size as needed
  iconAnchor: [6, 6], // Adjust the anchor point as needed
});

const ToolbarControl = ({
  shiftDateRange,
}: {
  shiftDateRange: (days: number) => void;
}) => {
  const map = useMap();
  useEffect(() => {
    const toolbar = new L.Toolbar2.Control({
      position: "topright",
      actions: [
        L.Toolbar2.Action.extend({
          options: {
            toolbarIcon: {
              html: '<img src="/calendar-icon.svg" alt="Calendar" width="24" height="24"/>',
              tooltip: "Open calendar modal",
            },
          },
          addHooks: function () {
            // Open calendar modal
          },
        }),
        L.Toolbar2.Action.extend({
          options: {
            toolbarIcon: {
              html: '<img src="/minus-icon.svg" alt="Minus" width="24" height="24"/>',
              tooltip: "Shift date range back",
            },
          },
          addHooks: function () {
            shiftDateRange(-1);
          },
        }),
        L.Toolbar2.Action.extend({
          options: {
            toolbarIcon: {
              html: '<img src="/plus-icon.svg" alt="Plus" width="24" height="24"/>',
              tooltip: "Shift date range forward",
            },
          },
          addHooks: function () {
            shiftDateRange(1);
          },
        }),
      ],
    });

    map.addControl(toolbar);

    return () => {
      map.removeControl(toolbar);
    };
  }, [map, shiftDateRange]);

  return null;
};

export default function Home() {
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [mushroomData, setMushroomData] = useState<
    {
      distance: String;
      date: String;
      species: string;
      lat: number;
      lng: number;
    }[]
  >([
    {
      distance: "5km",
      date: "2023-10-01",
      species: "Amanita muscaria",
      lat: 51.505,
      lng: -0.09,
    },
    {
      distance: "10km",
      date: "2023-10-02",
      species: "Boletus edulis",
      lat: 51.515,
      lng: -0.1,
    },
  ]);
  const [requests, setRequests] = useState<
    { date: String; species: string; lat: number; lng: number }[]
  >([
    {
      date: "2023-10-03",
      species: "Cantharellus cibarius",
      lat: 51.525,
      lng: -0.11,
    },
    {
      date: "2023-10-04",
      species: "Agaricus bisporus",
      lat: 51.535,
      lng: -0.12,
    },
  ]);

  useEffect(() => {
    // Fetch mushroom data based on date range
    // setMushroomData(fetchedData);
    // setRequests(fetchedRequests);
  }, [startDate, endDate]);

  const shiftDateRange = (days: number) => {
    setStartDate(
      (prevDate) => new Date(prevDate.setDate(prevDate.getDate() + days))
    );
    setEndDate(
      (prevDate) => new Date(prevDate.setDate(prevDate.getDate() + days))
    );
  };

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
        <MapContainer
          center={[51.505, -0.09] as [number, number]}
          zoom={13}
          style={{ height: "200px", width: "100%" }}
        >
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          {mushroomData.map((mushroom, index) => (
            <Marker
              key={index}
              position={[mushroom.lat, mushroom.lng]}
              icon={redDotIcon}
            >
              <Popup>
                {mushroom.species} <br /> {mushroom.date}
              </Popup>
            </Marker>
          ))}
          <ToolbarControl shiftDateRange={shiftDateRange} />
        </MapContainer>
        <div style={{ background: "white" }}>
          <Image
            src="/calendar-icon.svg"
            alt="Calendar"
            width={24}
            height={24}
          />
          <Image src="/plus-icon.svg" alt="Calendar" width={24} height={24} />
          <Image src="/minus-icon.svg" alt="Calendar" width={24} height={24} />
        </div>
        <div className="flex flex-col gap-4">
          <h2>Recent Mushroom Registrations</h2>
          <ul>
            {mushroomData.map((mushroom, index) => (
              <li key={index}>
                {mushroom.date} - {mushroom.species} - {mushroom.distance} km
                away
              </li>
            ))}
          </ul>
          <h2>Active Mushroom Requests</h2>
          <ul>
            {requests.map((request, index) => (
              <li key={index}>
                {request.date} - {request.species}
              </li>
            ))}
          </ul>
        </div>
      </main>
      <footer className="row-start-3 flex gap-6 flex-wrap items-center justify-center">
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://nextjs.org/learn?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="https://nextjs.org/icons/file.svg"
            alt="File icon"
            width={16}
            height={16}
          />
          Learn
        </a>
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://vercel.com/templates?framework=next.js&utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="https://nextjs.org/icons/window.svg"
            alt="Window icon"
            width={16}
            height={16}
          />
          Examples
        </a>
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://nextjs.org?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="https://nextjs.org/icons/globe.svg"
            alt="Globe icon"
            width={16}
            height={16}
          />
          Go to nextjs.org →
        </a>
      </footer>
    </div>
  );
}
