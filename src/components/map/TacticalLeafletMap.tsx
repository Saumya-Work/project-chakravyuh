"use client";

import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import {
  CctvCamera,
  VehicleRecord,
  DeviceRecord,
  TimelineEvent,
} from '@/types/sentinel';

interface TacticalMapProps {
  cameras: CctvCamera[];
  selectedCameraId: string;
  selectedCameraForBatch: string[];
  onSelectCamera: (id: string) => void;
  onToggleBatchCamera: (id: string) => void;
  vehicles: VehicleRecord[];
  devices: DeviceRecord[];
  timelineEvents: TimelineEvent[];
  searchRadiusMeters: number;
  showSearchBoundary: boolean;
  showCoverageCones: boolean;
  showVehiclesLayer: boolean;
  showCellSectorsLayer: boolean;
  activeTimelineMinute: number | null; // null = show all; number = filter up to that minute
}

const INCIDENT_CENTER: [number, number] = [12.9685, 77.6412];

// Compute directional wedge polygon coordinates for camera field-of-view cone
function computeCameraConePolygon(
  origin: [number, number],
  directionDeg: number,
  radiusMeters: number,
  fovDeg: number
): [number, number][] {
  const [lat, lng] = origin;
  const points: [number, number][] = [[lat, lng]];
  const startAngle = directionDeg - fovDeg / 2;
  const endAngle = directionDeg + fovDeg / 2;
  const steps = 10;

  for (let i = 0; i <= steps; i++) {
    const angleDeg = startAngle + ((endAngle - startAngle) * i) / steps;
    const angleRad = (angleDeg * Math.PI) / 180;
    // 1 deg lat ~ 111,320m; 1 deg lng at 13N ~ 108,400m
    const dLat = (radiusMeters * Math.cos(angleRad)) / 111320;
    const dLng = (radiusMeters * Math.sin(angleRad)) / 108400;
    points.push([lat + dLat, lng + dLng]);
  }
  points.push([lat, lng]);
  return points;
}

function getCameraStatusColor(status: CctvCamera['footageStatus']): string {
  switch (status) {
    case 'Footage received':
      return '#10B981'; // Emerald
    case 'Footage available':
      return '#0EA5E9'; // Sky
    case 'Request pending':
    case 'Awaiting response':
      return '#F59E0B'; // Amber
    case 'Footage unavailable':
    case 'Retention period expired':
      return '#EF4444'; // Red
    default:
      return '#94A3B8';
  }
}

export const TacticalLeafletMap: React.FC<TacticalMapProps> = ({
  cameras,
  selectedCameraId,
  selectedCameraForBatch,
  onSelectCamera,
  onToggleBatchCamera,
  vehicles,
  devices,
  searchRadiusMeters,
  showSearchBoundary,
  showCoverageCones,
  showVehiclesLayer,
  showCellSectorsLayer,
  activeTimelineMinute,
}) => {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const layerGroupRef = useRef<L.LayerGroup | null>(null);

  // Initialize Leaflet Map
  useEffect(() => {
    if (!mapContainerRef.current || mapInstanceRef.current) return;

    const map = L.map(mapContainerRef.current, {
      center: [12.9705, 77.6495],
      zoom: 15,
      zoomControl: true,
      attributionControl: false,
    });

    // Dark CartoDB Tactical Basemap Tiles (with dark fallback background)
    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
      maxZoom: 19,
      subdomains: 'abcd',
    }).addTo(map);

    const layerGroup = L.layerGroup().addTo(map);
    mapInstanceRef.current = map;
    layerGroupRef.current = layerGroup;

    return () => {
      map.remove();
      mapInstanceRef.current = null;
      layerGroupRef.current = null;
    };
  }, []);

  // Re-render tactical overlays whenever props update
  useEffect(() => {
    const map = mapInstanceRef.current;
    const group = layerGroupRef.current;
    if (!map || !group) return;

    group.clearLayers();

    // 1. Search Area Boundary Circle
    if (showSearchBoundary) {
      L.circle(INCIDENT_CENTER, {
        radius: searchRadiusMeters,
        color: '#0EA5E9',
        weight: 2,
        dashArray: '6, 6',
        fillColor: '#0EA5E9',
        fillOpacity: 0.05,
      })
        .bindTooltip(
          `<div style="font-family:monospace;font-size:11px;color:#0EA5E9;"><b>CCTV Discovery Search Boundary</b><br/>Radius: ${searchRadiusMeters}m from Incident Anchor</div>`,
          { sticky: true }
        )
        .addTo(group);
    }

    // 2. Approximate Cell-Sector Footprints (Never exact GPS!)
    if (showCellSectorsLayer) {
      const sectors = [
        {
          id: 'BLR-KVR-04A',
          name: 'Micro-Sector 04A (Approximate 450m Footprint)',
          coords: [12.9682, 77.6405] as [number, number],
          radius: 450,
          color: '#14B8A6',
          minMinute: 1090,
        },
        {
          id: 'BLR-KVR-04B',
          name: 'Macro-Sector 04B (Approximate 650m Footprint)',
          coords: [12.9695, 77.6460] as [number, number],
          radius: 650,
          color: '#F59E0B',
          minMinute: 1122,
        },
        {
          id: 'BLR-27M-02A',
          name: 'Sony World Signal (Indiranagar–Koramangala) Sector 02A (Approximate 700m Footprint)',
          coords: [12.9718, 77.6535] as [number, number],
          radius: 700,
          color: '#3B82F6',
          minMinute: 1142,
        },
        {
          id: 'BLR-IND-09C',
          name: 'Flyover Sector 09C (Approximate 800m Footprint)',
          coords: [12.9752, 77.6618] as [number, number],
          radius: 800,
          color: '#8B5CF6',
          minMinute: 1158,
        },
      ];

      sectors.forEach((sec) => {
        if (activeTimelineMinute !== null && activeTimelineMinute < sec.minMinute) return;
        L.circle(sec.coords, {
          radius: sec.radius,
          color: sec.color,
          weight: 1.5,
          dashArray: '4, 8',
          fillColor: sec.color,
          fillOpacity: 0.07,
        })
          .bindTooltip(
            `<div style="font-family:monospace;font-size:11px;"><b>${sec.id}</b>: ${sec.name}<br/><i>Note: Approximate Cell-Sector Coverage (Not Exact GPS)</i></div>`
          )
          .addTo(group);
      });
    }

    // 3. Primary Incident Marker (Indiranagar 100 Feet Road (HAL 2nd Stage))
    const incidentHtml = `
      <div style="position:relative;display:flex;align-items:center;justify-content:center;width:30px;height:30px;">
        <div style="position:absolute;width:30px;height:30px;border-radius:9999px;background:rgba(239,68,68,0.35);border:2px solid #EF4444;"></div>
        <div style="width:12px;height:12px;border-radius:9999px;background:#EF4444;border:2px solid #FFFFFF;"></div>
      </div>
    `;
    const incidentIcon = L.divIcon({
      html: incidentHtml,
      className: 'sentinel-incident-marker',
      iconSize: [30, 30],
      iconAnchor: [15, 15],
    });

    L.marker(INCIDENT_CENTER, { icon: incidentIcon, zIndexOffset: 1000 })
      .bindPopup(
        `<div style="font-family:sans-serif;font-size:12px;color:#0F172A;min-width:210px;">
          <b style="color:#DC2626;">INCIDENT & LAST SIGHTING ANCHOR</b><br/>
          <b>Case:</b> CASE-SNT-2026-0042<br/>
          <b>Location:</b> Indiranagar 100 Feet Road (HAL 2nd Stage) Library Walkway (Fictional)<br/>
          <b>Last Sighting:</b> 18:30 IST (CAM-001 Verified)<br/>
          <b>Complaint:</b> 21:15 IST
        </div>`
      )
      .addTo(group);

    // 4. Camera Markers & Directional Coverage Cones
    cameras.forEach((cam) => {
      const color = getCameraStatusColor(cam.footageStatus);
      const isSelected = cam.id === selectedCameraId;
      const isInBatch = selectedCameraForBatch.includes(cam.id);

      // If timeline playback is active, highlight cameras whose observations have occurred
      const camObsMin =
        cam.id === 'CAM-001'
          ? 1110
          : cam.id === 'CAM-003'
          ? 1116
          : cam.id === 'CAM-008'
          ? 1125
          : cam.id === 'CAM-014'
          ? 1142
          : cam.id === 'CAM-015'
          ? 1148
          : cam.id === 'CAM-019'
          ? 1158
          : cam.id === 'CAM-006'
          ? 1165
          : 1090;

      if (activeTimelineMinute !== null && activeTimelineMinute < camObsMin) {
        return;
      }

      // Directional Coverage Cone
      if (showCoverageCones) {
        const conePoints = computeCameraConePolygon(
          cam.coordinates,
          cam.directionDeg,
          cam.coverageRadiusMeters * 2.2, // scaled for clear visual visibility on zoom 15
          cam.fovDeg
        );
        L.polygon(conePoints, {
          color,
          weight: isSelected ? 2 : 1,
          fillColor: color,
          fillOpacity: isSelected ? 0.32 : 0.16,
        }).addTo(group);
      }

      const camHtml = `
        <div style="
          display:flex;
          align-items:center;
          justify-content:center;
          padding:2px 5px;
          border-radius:6px;
          font-family:monospace;
          font-size:10px;
          font-weight:700;
          color:#FFFFFF;
          background:${isSelected ? '#0284C7' : '#0F172A'};
          border:2px solid ${isSelected ? '#FFFFFF' : isInBatch ? '#38BDF8' : color};
          box-shadow:0 2px 6px rgba(0,0,0,0.6);
          white-space:nowrap;
        ">
          <span style="width:7px;height:7px;border-radius:9999px;background:${color};margin-right:4px;display:inline-block;"></span>
          ${cam.id}
        </div>
      `;

      const camIcon = L.divIcon({
        html: camHtml,
        className: 'sentinel-cam-marker',
        iconSize: [64, 24],
        iconAnchor: [32, 12],
      });

      const marker = L.marker(cam.coordinates, {
        icon: camIcon,
        zIndexOffset: isSelected ? 900 : 400,
      });

      marker.on('click', () => {
        onSelectCamera(cam.id);
      });

      marker.bindTooltip(
        `<div style="font-family:sans-serif;font-size:11px;">
          <b>${cam.id} — ${cam.name}</b><br/>
          Status: <b>${cam.footageStatus}</b><br/>
          Direction: ${cam.directionLabel} (${cam.coverageRadiusMeters}m)<br/>
          <i>Click to inspect & request footage</i>
        </div>`
      );

      marker.addTo(group);
    });

    // 5. Documented Vehicle Sighting Markers (No invented interpolation between sightings!)
    if (showVehiclesLayer) {
      vehicles.forEach((veh) => {
        veh.sightings.forEach((sgt) => {
          if (activeTimelineMinute !== null && activeTimelineMinute < sgt.timeMinutes) return;

          // Slightly offset from camera pin so both are clickable
          const offsetCoords: [number, number] = [
            sgt.coordinates[0] - 0.0007,
            sgt.coordinates[1] + 0.0007,
          ];

          const isPrioritySuv = veh.id === 'VEH-001' || veh.id === 'VEH-002';
          const badgeColor = isPrioritySuv ? '#F59E0B' : '#64748B';

          const vehHtml = `
            <div style="
              padding:2px 6px;
              border-radius:4px;
              background:#1E293B;
              border:1.5px solid ${badgeColor};
              color:${isPrioritySuv ? '#FDE68A' : '#E2E8F0'};
              font-family:monospace;
              font-size:9px;
              font-weight:700;
              box-shadow:0 2px 4px rgba(0,0,0,0.5);
              white-space:nowrap;
            ">
              🚗 ${veh.id} (${sgt.timestamp})
            </div>
          `;

          const vehIcon = L.divIcon({
            html: vehHtml,
            className: 'sentinel-veh-marker',
            iconSize: [96, 20],
            iconAnchor: [48, 10],
          });

          L.marker(offsetCoords, { icon: vehIcon, zIndexOffset: 650 })
            .bindTooltip(
              `<div style="font-family:sans-serif;font-size:11px;">
                <b>${veh.label}</b><br/>
                Time: <b>${sgt.timestamp} IST</b> at ${sgt.cameraId}<br/>
                Direction: ${sgt.direction}<br/>
                Reg Observation: ${veh.syntheticRegObservation}<br/>
                Status: <b>${veh.verificationStatus}</b>
              </div>`
            )
            .addTo(group);
        });
      });
    }
  }, [
    cameras,
    selectedCameraId,
    selectedCameraForBatch,
    onSelectCamera,
    onToggleBatchCamera,
    vehicles,
    devices,
    searchRadiusMeters,
    showSearchBoundary,
    showCoverageCones,
    showVehiclesLayer,
    showCellSectorsLayer,
    activeTimelineMinute,
  ]);

  return (
    <div className="relative w-full h-[540px] rounded-xl overflow-hidden border border-[#22314E] bg-[#090D16]">
      <div ref={mapContainerRef} className="w-full h-full z-10" />
    </div>
  );
};

