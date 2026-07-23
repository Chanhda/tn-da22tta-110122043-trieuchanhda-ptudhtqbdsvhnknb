import React from 'react';
import { StyleSheet, View } from 'react-native';
import { WebView } from 'react-native-webview';

import { Colors } from '@/constants/theme';
import { type HeritageDocument } from '@/lib/heritage-repository';

import { getHeritageCoordinates } from './coordinates';

interface MapComponentProps {
  heritages: HeritageDocument[];
  onPressHeritage: (id: string) => void;
  colorScheme: 'light' | 'dark';
}

export default function MapComponent({ heritages, onPressHeritage, colorScheme }: MapComponentProps) {
  const C = Colors[colorScheme];

  // Convert heritage list to coordinate markers
  const markers = heritages.map((heritage, index) => {
    const coords = getHeritageCoordinates(heritage, index);
    return {
      id: heritage.id,
      title: heritage.title,
      province: heritage.province,
      category: heritage.category,
      lat: coords.latitude,
      lng: coords.longitude,
    };
  });

  const tileUrl = colorScheme === 'dark'
    ? 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png'
    : 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png';

  const mapBg = colorScheme === 'dark' ? '#131313' : '#F9F6F0';
  const textCol = colorScheme === 'dark' ? '#F9F6F0' : '#1C1A17';
  const popupBg = colorScheme === 'dark' ? '#1E1E1E' : '#F3EDE2';
  const popupBorder = C.primary; // Gold highlight

  // Create Leaflet HTML source
  const srcDoc = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
      <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
      <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
      <style>
        body, html, #map { margin: 0; padding: 0; width: 100%; height: 100%; background: ${mapBg}; }
        .leaflet-container { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; }
        
        /* Premium custom tooltip styling */
        .leaflet-popup-content-wrapper {
          background: ${popupBg};
          color: ${textCol};
          border: 1px solid ${popupBorder};
          border-radius: 12px;
          box-shadow: 0 4px 16px rgba(0,0,0,0.3);
          padding: 4px;
        }
        .leaflet-popup-tip {
          background: ${popupBg};
          border-left: 1px solid ${popupBorder};
          border-bottom: 1px solid ${popupBorder};
        }
        .popup-content {
          padding: 6px;
          min-width: 140px;
        }
        .popup-title {
          font-weight: 700;
          font-size: 14px;
          color: ${C.primary};
          margin-bottom: 4px;
          line-height: 1.3;
        }
        .popup-meta {
          font-size: 11px;
          color: ${colorScheme === 'dark' ? '#A39E93' : '#706B5E'};
          margin-bottom: 8px;
        }
        .popup-btn {
          display: block;
          padding: 6px 12px;
          background: ${C.primary};
          color: #131313;
          text-decoration: none;
          font-size: 11px;
          font-weight: 700;
          border-radius: 6px;
          border: none;
          cursor: pointer;
          transition: background 0.2s;
          text-align: center;
          width: 100%;
          box-sizing: border-box;
        }
        .popup-btn:hover {
          background: ${C.primary}dd;
        }
      </style>
    </head>
    <body>
      <div id="map"></div>
      <script>
        const markersData = ${JSON.stringify(markers)};
        
        // Initial centroid of markers or center of Southern Vietnam
        let center = [9.8, 106.1];
        let zoom = 8;
        
        if (markersData.length > 0) {
          const lats = markersData.map(m => m.lat);
          const lngs = markersData.map(m => m.lng);
          const minLat = Math.min(...lats);
          const maxLat = Math.max(...lats);
          const minLng = Math.min(...lngs);
          const maxLng = Math.max(...lngs);
          center = [(minLat + maxLat) / 2, (minLng + maxLng) / 2];
        }

        const map = L.map('map', {
          zoomControl: false
        }).setView(center, zoom);

        L.control.zoom({
          position: 'topright'
        }).addTo(map);

        L.tileLayer('${tileUrl}', {
          attribution: '&copy; CartoDB'
        }).addTo(map);

        // Premium gold dot marker icon
        const goldIcon = L.divIcon({
          html: '<div style="background-color: ${C.primary}; width: 12px; height: 12px; border-radius: 50%; border: 2.5px solid #ffffff; box-shadow: 0 0 10px ${C.primary};"></div>',
          className: 'custom-pin',
          iconSize: [16, 16],
          iconAnchor: [8, 8],
          popupAnchor: [0, -8]
        });

        markersData.forEach(marker => {
          const popupHtml = \`
            <div class="popup-content">
              <div class="popup-title">\${marker.title}</div>
              <div class="popup-meta">\${marker.province} &bull; \${marker.category}</div>
              <button class="popup-btn" onclick="
                const payload = {type: 'SELECT_HERITAGE', id: '\${marker.id}'};
                if (window.ReactNativeWebView) {
                  window.ReactNativeWebView.postMessage(JSON.stringify(payload));
                } else {
                  window.parent.postMessage(payload, '*');
                }
              ">
                Xem chi tiết
              </button>
            </div>
          \`;

          L.marker([marker.lat, marker.lng], { icon: goldIcon })
            .addTo(map)
            .bindPopup(popupHtml);
        });
      </script>
    </body>
    </html>
  `;

  const handleMessage = (event: any) => {
    try {
      const data = JSON.parse(event.nativeEvent.data);
      if (data && data.type === 'SELECT_HERITAGE') {
        onPressHeritage(data.id);
      }
    } catch (e) {
      console.warn('Error parsing message from webview:', e);
    }
  };

  return (
    <View style={[styles.container, { borderColor: `${C.primary}30` }]}>
      <WebView
        originWhitelist={['*']}
        source={{ html: srcDoc }}
        style={styles.map}
        onMessage={handleMessage}
        scrollEnabled={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: 350,
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 0.5,
  },
  map: {
    flex: 1,
    backgroundColor: 'transparent',
  },
});
