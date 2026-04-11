import { useEffect, useRef, useState } from "react";

export interface LatLng {
  lat: number;
  lng: number;
}

interface LocationViewerProps {
  locationStr: string;
}

function loadCSS(href: string) {
  if (document.querySelector(`link[href="${href}"]`)) return;
  const link = document.createElement("link");
  link.rel = "stylesheet";
  link.href = href;
  document.head.appendChild(link);
}

let leafletPromise: Promise<any> | null = null;
function loadLeaflet(): Promise<any> {
  if (leafletPromise) return leafletPromise;
  if (typeof window !== "undefined" && (window as any).L) return Promise.resolve((window as any).L);
  leafletPromise = new Promise((resolve, reject) => {
    loadCSS("https://unpkg.com/leaflet@1.9.4/dist/leaflet.css");
    const script = document.createElement("script");
    script.src = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js";
    script.onload = () => resolve((window as any).L);
    script.onerror = () => reject(new Error("Failed to load Leaflet"));
    document.head.appendChild(script);
  });
  return leafletPromise;
}

async function searchLocation(query: string): Promise<LatLng | null> {
  if (!query.trim()) return null;
  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json&limit=1`,
      { headers: { "Accept-Language": "en" } }
    );
    const data = await res.json();
    if (data && data.length > 0) {
        return { lat: parseFloat(data[0].lat), lng: parseFloat(data[0].lon) }
    }
    return null;
  } catch { return null; }
}

export default function LocationViewer({ locationStr }: LocationViewerProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<any>(null);
  const markerInstance = useRef<any>(null);

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    
    const initMap = async () => {
        try {
            setIsLoading(true);
            const L = await loadLeaflet();
            const coordinates = await searchLocation(locationStr);
            const center = coordinates || { lat: 23.8103, lng: 90.4125 }; // Default to Dhaka

            if (!isMounted || !mapRef.current) return;
            
            // Clean up existing map if it somehow exists
            if (mapInstance.current) {
                mapInstance.current.remove();
                mapInstance.current = null;
            }

            delete (L.Icon.Default.prototype as any)._getIconUrl;
            L.Icon.Default.mergeOptions({
                iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
                iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
                shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
            });

            const map = L.map(mapRef.current, {
                center: [center.lat, center.lng],
                zoom: 15,
                zoomControl: true,
            });

            L.tileLayer(
                "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png",
                {
                    attribution: '&copy; CARTO &copy; OSM',
                    subdomains: "abcd",
                    maxZoom: 20,
                }
            ).addTo(map);

            const pinHtml = `
                <div style="transform: translate(-50%, -100%); width: 40px; height: 40px; position: relative;">
                    <div style="position: absolute; width: 30px; height: 30px; background: #0d6efd; border-radius: 50%; top: 0; left: 5px; z-index: 2; border: 3px solid white; box-shadow: 0 4px 8px rgba(0,0,0,0.3); display: flex; align-items: center; justify-content: center;">
                        <div style="width: 10px; height: 10px; background: white; border-radius: 50%;"></div>
                    </div>
                    <div style="position: absolute; bottom: 0; left: 20px; width: 0; height: 0; border-left: 8px solid transparent; border-right: 8px solid transparent; border-top: 14px solid white; transform: translateX(-50%); z-index: 1;"></div>
                    <div style="position: absolute; bottom: 3px; left: 20px; width: 0; height: 0; border-left: 6px solid transparent; border-right: 6px solid transparent; border-top: 10px solid #0d6efd; transform: translateX(-50%); z-index: 3;"></div>
                </div>
            `;
            const customIcon = L.divIcon({
                className: "custom-map-pin",
                html: pinHtml,
                iconSize: [40, 40],
                iconAnchor: [20, 40],
            });

            const marker = L.marker([center.lat, center.lng], { icon: customIcon }).addTo(map);
            if (!coordinates) {
                marker.bindPopup("Exact location not found. Showing general area.").openPopup();
            } else {
                marker.bindPopup(locationStr).openPopup();
            }

            mapInstance.current = map;
            markerInstance.current = marker;
            setIsLoading(false);

            // In case modal animates, trigger resize
            setTimeout(() => { map.invalidateSize() }, 300);

        } catch (err) {
            setError("Failed to load map.");
            setIsLoading(false);
        }
    };

    initMap();

    return () => {
        isMounted = false;
        if (mapInstance.current) {
            mapInstance.current.remove();
            mapInstance.current = null;
        }
    };
  }, [locationStr]);

  return (
    <div style={{ position: "relative", width: "100%", height: "100%", minHeight: "350px", borderRadius: "10px", overflow: "hidden" }}>
        {isLoading && (
            <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", background: "#f8f9fa", zIndex: 10 }}>
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading map...</span>
                </div>
            </div>
        )}
        {error && (
            <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", background: "#f8f9fa", zIndex: 10, color: "red" }}>
                {error}
            </div>
        )}
        <div ref={mapRef} style={{ width: "100%", height: "100%", minHeight: "350px", zIndex: 1 }} />
    </div>
  );
}
