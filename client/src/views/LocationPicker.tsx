"use client";
import { useState, useEffect, useRef, useCallback } from "react";


export interface LatLng {
  lat: number;
  lng: number;
}

export interface LocationResult {
  latLng: LatLng;
  address: string;
  placeName: string;
}

interface LocationPickerProps {
  onLocationSelect?: (loc: LocationResult) => void;
  defaultCenter?: LatLng;
  placeholder?: string;
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


async function reverseGeocode(lat: number, lng: number) {
  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json&addressdetails=1`,
      { headers: { "Accept-Language": "en" } }
    );
    const data = await res.json();
    const a = data.address || {};
    const placeName =
      a.amenity || a.shop || a.building || a.road ||
      a.neighbourhood || a.suburb || a.village || a.town || a.city ||
      "Selected Location";
    return { address: data.display_name || "Unknown address", placeName };
  } catch {
    return { address: "Unknown address", placeName: "Selected Location" };
  }
}

interface NominatimResult { lat: string; lon: string; display_name: string; }

async function searchPlaces(query: string): Promise<NominatimResult[]> {
  if (!query.trim()) return [];
  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json&limit=5`,
      { headers: { "Accept-Language": "en" } }
    );
    return await res.json();
  } catch { return []; }
}


export default function LocationPicker({
  onLocationSelect,
  defaultCenter = { lat: 23.8103, lng: 90.4125 },
  placeholder = "Search for a place…",
}: LocationPickerProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<any>(null);
  const markerInstance = useRef<any>(null);

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selected, setSelected] = useState<LocationResult | null>(null);
  const [isGeocoding, setIsGeocoding] = useState(false);

  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState<NominatimResult[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);
  const searchTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const placeMarker = useCallback(async (lat: number, lng: number) => {
    if (!mapInstance.current || !markerInstance.current) return;
    setIsGeocoding(true);
    markerInstance.current.setLatLng([lat, lng]);
    markerInstance.current.setOpacity(1);
    mapInstance.current.panTo([lat, lng]);
    const { address, placeName } = await reverseGeocode(lat, lng);
    const result: LocationResult = { latLng: { lat, lng }, address, placeName };
    setSelected(result);
    setIsGeocoding(false);
  }, []);

  useEffect(() => {
    let isMounted = true;
    loadLeaflet()
      .then((L) => {
        if (!isMounted || !mapRef.current || mapInstance.current) return;

        delete (L.Icon.Default.prototype as any)._getIconUrl;
        L.Icon.Default.mergeOptions({
          iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
          iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
          shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
        });

        const map = L.map(mapRef.current, {
          center: [defaultCenter.lat, defaultCenter.lng],
          zoom: 14,
          zoomControl: false,
        });

        L.tileLayer(
          "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png",
          {
            attribution: '&copy; <a href="https://carto.com/">CARTO</a> &copy; <a href="https://openstreetmap.org/copyright">OSM</a>',
            subdomains: "abcd",
            maxZoom: 20,
          }
        ).addTo(map);

        const pinIcon = L.divIcon({
          className: "",
          iconSize: [30, 42],
          iconAnchor: [15, 42],
          html: `<div style="filter:drop-shadow(0 4px 10px rgba(249,115,22,0.6))">
            <svg viewBox="0 0 30 42" width="30" height="42" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M15 0C6.72 0 0 6.72 0 15c0 10.5 15 27 15 27S30 25.5 30 15C30 6.72 23.28 0 15 0z" fill="#f97316"/>
              <circle cx="15" cy="15" r="6.5" fill="white"/>
              <circle cx="15" cy="15" r="3.5" fill="#f97316"/>
            </svg>
          </div>`,
        });

        const marker = L.marker([defaultCenter.lat, defaultCenter.lng], {
          icon: pinIcon,
          draggable: true,
          opacity: 0,
        }).addTo(map);

        map.on("click", (e: any) => placeMarker(e.latlng.lat, e.latlng.lng));
        marker.on("dragend", () => {
          const p = marker.getLatLng();
          placeMarker(p.lat, p.lng);
        });

        mapInstance.current = map;
        markerInstance.current = marker;
        setIsLoading(false);
        
        // Invalidate map size after a short delay to handle modal opening
        setTimeout(() => {
          map.invalidateSize();
        }, 100);
      })
      .catch(() => {
        if (isMounted) setError("Could not load the map. Check your internet connection.");
        setIsLoading(false);
      });
    return () => { isMounted = false; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setQuery(val);
    setSuggestions([]);
    if (searchTimer.current) clearTimeout(searchTimer.current);
    if (!val.trim()) { setShowSuggestions(false); return; }
    setSearchLoading(true);
    searchTimer.current = setTimeout(async () => {
      const results = await searchPlaces(val);
      setSuggestions(results);
      setShowSuggestions(true);
      setSearchLoading(false);
    }, 420);
  };

  const handleSuggestionClick = (r: NominatimResult) => {
    const lat = parseFloat(r.lat), lng = parseFloat(r.lon);
    const parts = r.display_name.split(",");
    setQuery(parts.slice(0, 2).join(", "));
    setShowSuggestions(false);
    setSuggestions([]);
    mapInstance.current?.setView([lat, lng], 17);
    placeMarker(lat, lng);
  };

  const locateMe = () => {
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        mapInstance.current?.setView([coords.latitude, coords.longitude], 17);
        placeMarker(coords.latitude, coords.longitude);
      },
      () => alert("Location access denied.")
    );
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@500;700;800&family=Mulish:wght@400;500;600&display=swap');

        .lp-root {
          position: relative; width: 100%; border-radius: 20px; overflow: hidden;
          background: #0c0e14; border: 1px solid rgba(255,255,255,0.07);
          box-shadow: 0 12px 48px rgba(0,0,0,0.4);
          font-family: 'Mulish', sans-serif;
        }
        .lp-map { width:100%; height:420px; z-index:1; cursor: crosshair; }
        .leaflet-container { background:#0c0e14 !important; cursor: crosshair; }
        .leaflet-control-attribution {
          background:rgba(12,14,20,0.7)!important; color:rgba(255,255,255,0.22)!important;
          font-size:9px!important; border-radius:6px 0 0 0!important;
        }
        .leaflet-control-attribution a { color:rgba(255,255,255,0.32)!important; }

        /* Search */
        .lp-search-wrap {
          position:absolute; top:14px; left:50%; transform:translateX(-50%);
          z-index:999; width:calc(100% - 28px); max-width:440px;
        }
        .lp-search-bar {
          display:flex; align-items:center; gap:9px;
          background:rgba(12,14,20,0.94); backdrop-filter:blur(16px);
          border:1px solid rgba(255,255,255,0.1); border-radius:14px;
          padding:11px 14px; transition:border-color .2s;
        }
        .lp-search-bar:focus-within { border-color:#f97316; }
        .lp-search-bar input {
          flex:1; background:none; border:none; outline:none;
          color:#f0f0f0; font-family:'Mulish',sans-serif; font-size:13.5px; font-weight:500;
        }
        .lp-search-bar input::placeholder { color:rgba(255,255,255,0.3); }

        /* Suggestions */
        .lp-suggestions {
          margin-top:6px; background:rgba(16,18,28,0.97); backdrop-filter:blur(16px);
          border:1px solid rgba(255,255,255,0.08); border-radius:13px; overflow:hidden;
        }
        .lp-sug-item {
          padding:10px 14px; cursor:pointer;
          border-bottom:1px solid rgba(255,255,255,0.05); transition:background .15s;
        }
        .lp-sug-item:last-child { border-bottom:none; }
        .lp-sug-item:hover { background:rgba(249,115,22,0.1); }
        .lp-sug-name { font-size:13px; font-weight:600; color:#f0f0f0; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
        .lp-sug-addr { font-size:11px; color:rgba(255,255,255,0.35); white-space:nowrap; overflow:hidden; text-overflow:ellipsis; margin-top:1px; }
        .lp-no-results { padding:14px; text-align:center; font-size:13px; color:rgba(255,255,255,0.28); font-style:italic; }

        /* Geocoding pill */
        .lp-pill {
          position:absolute; top:68px; left:50%; transform:translateX(-50%); z-index:998;
          background:rgba(249,115,22,0.13); border:1px solid rgba(249,115,22,0.28);
          color:#f97316; font-size:11.5px; font-weight:700; letter-spacing:.04em;
          padding:5px 14px; border-radius:999px; backdrop-filter:blur(8px);
          animation:lp-pulse 1.1s ease-in-out infinite; white-space:nowrap;
        }
        @keyframes lp-pulse { 0%,100%{opacity:1}50%{opacity:.4} }

        /* Controls */
        .lp-controls {
          position:absolute; right:14px; bottom:148px; z-index:999;
          display:flex; flex-direction:column; gap:8px;
        }
        .lp-ctrl {
          width:38px; height:38px; border-radius:11px;
          background:rgba(12,14,20,0.92); backdrop-filter:blur(12px);
          border:1px solid rgba(255,255,255,0.09); color:#ccc;
          display:flex; align-items:center; justify-content:center;
          cursor:pointer; transition:background .18s, border-color .18s, color .18s;
        }
        .lp-ctrl:hover { background:#f97316; border-color:#f97316; color:#fff; }

        /* Free badge */
        .lp-badge {
          position:absolute; top:14px; right:14px; z-index:999;
          background:rgba(34,197,94,0.1); border:1px solid rgba(34,197,94,0.22);
          color:#4ade80; font-size:10px; font-weight:700; letter-spacing:.08em;
          text-transform:uppercase; padding:4px 10px; border-radius:999px;
        }

        /* Bottom panel */
        .lp-panel {
          position:absolute; bottom:0; left:0; right:0; z-index:999;
          background:rgba(12,14,20,0.97); backdrop-filter:blur(20px);
          border-top:1px solid rgba(255,255,255,0.07);
          padding:15px 18px 18px; display:flex; align-items:center; gap:14px;
        }
        .lp-panel-icon {
          flex-shrink:0; width:38px; height:38px; border-radius:10px;
          background:rgba(249,115,22,0.1); border:1px solid rgba(249,115,22,0.2);
          display:flex; align-items:center; justify-content:center;
        }
        .lp-panel-info { flex:1; min-width:0; }
        .lp-panel-label { font-size:10px; font-weight:700; letter-spacing:.1em; text-transform:uppercase; color:#f97316; margin-bottom:3px; }
        .lp-panel-name {
          font-family:'Syne',sans-serif; font-size:14px; font-weight:700; color:#f0f0f0;
          white-space:nowrap; overflow:hidden; text-overflow:ellipsis;
        }
        .lp-panel-addr { font-size:11.5px; color:rgba(255,255,255,0.35); white-space:nowrap; overflow:hidden; text-overflow:ellipsis; margin-top:1px; }
        .lp-panel-hint { font-size:12.5px; color:rgba(255,255,255,0.28); font-style:italic; }
        .lp-confirm {
          flex-shrink:0; padding:10px 20px; border-radius:12px;
          background:#f97316; border:none; color:#fff;
          font-family:'Syne',sans-serif; font-size:13px; font-weight:700;
          cursor:pointer; transition:background .18s, transform .1s, opacity .18s; white-space:nowrap;
        }
        .lp-confirm:hover { background:#ea6c0e; }
        .lp-confirm:active { transform:scale(.96); }
        .lp-confirm:disabled { opacity:.32; cursor:not-allowed; }

        /* Overlay */
        .lp-overlay {
          position:absolute; inset:0; z-index:1000; background:rgba(12,14,20,0.95); backdrop-filter:blur(2px);
          display:flex; flex-direction:column; align-items:center; justify-content:center; gap:16px;
          border-radius: 20px;
        }
        .lp-spinner {
          width:48px; height:48px; border:4px solid rgba(249,115,22,.15);
          border-top-color:#f97316; border-right-color:#f97316; border-radius:50%;
          animation:lp-spin .7s linear infinite;
        }
        @keyframes lp-spin { to { transform:rotate(360deg); } }
        .lp-loading-txt { color:rgba(255,255,255,0.65); font-size:14px; font-weight:500; letter-spacing:0.3px; }
        .lp-error-txt { color:#f87171; font-size:13px; text-align:center; padding:0 24px; }
      `}</style>

      <div className="lp-root">

        {/* Overlay */}
        {(isLoading || error) && (
          <div className="lp-overlay">
            {isLoading && <><div className="lp-spinner" /><span className="lp-loading-txt">Loading map…</span></>}
            {error && <span className="lp-error-txt">{error}</span>}
          </div>
        )}

        {/* Free badge */}
        <div className="lp-badge">100% Free</div>

        {/* Search */}
        <div className="lp-search-wrap">
          <div className="lp-search-bar">
            <svg width="15" height="15" fill="none" stroke="#f97316" strokeWidth={2.2} viewBox="0 0 24 24">
              <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
            </svg>
            <input
              type="text"
              placeholder={placeholder}
              value={query}
              onChange={handleSearchChange}
              onFocus={() => suggestions.length > 0 && setShowSuggestions(true)}
              onBlur={() => setTimeout(() => setShowSuggestions(false), 180)}
            />
            {searchLoading && (
              <svg width="14" height="14" viewBox="0 0 24 24" style={{ animation: "lp-spin .7s linear infinite", flexShrink: 0 }}
                fill="none" stroke="#f97316" strokeWidth={2.5}>
                <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4" />
              </svg>
            )}
          </div>

          {showSuggestions && (
            <div className="lp-suggestions">
              {suggestions.length === 0
                ? <div className="lp-no-results">No results found</div>
                : suggestions.map((s, i) => {
                    const parts = s.display_name.split(",");
                    return (
                      <div key={i} className="lp-sug-item" onMouseDown={() => handleSuggestionClick(s)}>
                        <div className="lp-sug-name">{parts[0]}</div>
                        <div className="lp-sug-addr">{parts.slice(1, 4).join(", ")}</div>
                      </div>
                    );
                  })}
            </div>
          )}
        </div>

        {/* Geocoding pill */}
        {isGeocoding && <div className="lp-pill">Fetching address…</div>}

        {/* Map */}
        <div ref={mapRef} className="lp-map" />

        {/* Controls */}
        <div className="lp-controls">
          <button className="lp-ctrl" title="Zoom in" onClick={() => mapInstance.current?.zoomIn()}>
            <svg width="15" height="15" stroke="currentColor" strokeWidth={2.5} fill="none" viewBox="0 0 24 24"><path d="M12 5v14M5 12h14" /></svg>
          </button>
          <button className="lp-ctrl" title="Zoom out" onClick={() => mapInstance.current?.zoomOut()}>
            <svg width="15" height="15" stroke="currentColor" strokeWidth={2.5} fill="none" viewBox="0 0 24 24"><path d="M5 12h14" /></svg>
          </button>
          <button className="lp-ctrl" title="My location" onClick={locateMe}>
            <svg width="15" height="15" stroke="currentColor" strokeWidth={2} fill="none" viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="3" /><path d="M12 2v3M12 19v3M2 12h3M19 12h3" />
            </svg>
          </button>
        </div>

        {/* Bottom panel */}
        <div className="lp-panel">
          <div className="lp-panel-icon">
            <svg width="18" height="18" fill="#f97316" viewBox="0 0 24 24">
              <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5S10.62 6.5 12 6.5s2.5 1.12 2.5 2.5S13.38 11.5 12 11.5z" />
            </svg>
          </div>
          <div className="lp-panel-info">
            {selected ? (
              <>
                <div className="lp-panel-label">Selected Location</div>
                <div className="lp-panel-name">{selected.placeName}</div>
                <div className="lp-panel-addr">{selected.address}</div>
              </>
            ) : (
              <div className="lp-panel-hint">Tap the map or search to pin a location</div>
            )}
          </div>
          <button 
            type="button"
            className="lp-confirm" 
            disabled={!selected || isGeocoding} 
            onClick={(e) => {
              e.preventDefault();
              if (selected && !isGeocoding) {
                onLocationSelect?.(selected);
              }
            }}
          >
            Confirm
          </button>
        </div>
      </div>
    </>
  );
}
