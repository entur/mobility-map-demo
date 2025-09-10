import { useEffect, useRef, useCallback, useState } from 'react'
import { Box } from '@mui/material'
import maplibregl from 'maplibre-gl'
import Supercluster from 'supercluster'
import 'maplibre-gl/dist/maplibre-gl.css'
import { Vehicle, Station, MapMode, GeofencingZones, GeofencingZoneFeature, GeofencingZoneRule } from '../types'
import polyline from '@mapbox/polyline'

const popupStyle = `
  .maplibregl-popup-content {
    padding: 15px;
    border-radius: 8px;
    max-width: 300px;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
  }
  .popup-header {
    font-size: 16px;
    font-weight: 600;
    margin-bottom: 8px;
    color: #333;
  }
  .popup-body {
    font-size: 14px;
    color: #666;
    margin-bottom: 8px;
  }
  .popup-status {
    display: inline-block;
    padding: 4px 8px;
    border-radius: 4px;
    font-size: 12px;
    font-weight: 500;
    margin-top: 4px;
  }
  .status-available {
    background-color: #e6f4ea;
    color: #1e7e34;
  }
  .status-reserved {
    background-color: #fff3e0;
    color: #f57c00;
  }
  .status-disabled {
    background-color: #feeef0;
    color: #d32f2f;
  }
  .popup-stat {
    display: flex;
    justify-content: space-between;
    margin-bottom: 4px;
  }
  .popup-stat-label {
    color: #666;
  }
  .popup-stat-value {
    font-weight: 500;
    color: #333;
  }
`

interface MapContainerProps {
  vehicles: Vehicle[]
  stations: Station[]
  mode: MapMode
  onViewportChange: (bounds: {
    minimumLatitude: number
    maximumLatitude: number
    minimumLongitude: number
    maximumLongitude: number
  }) => void
  geofencingZones?: GeofencingZones[]
}

interface ClusterProperties {
  count: number
  type: 'vehicle' | 'station'
}

interface GeoPoint {
  id: string
  lat: number
  lon: number
  type: 'vehicle' | 'station'
  data: Vehicle | Station
}

export const MapContainer = ({ vehicles, stations, mode, onViewportChange, geofencingZones = [] }: MapContainerProps) => {
  const mapContainer = useRef<HTMLDivElement>(null)
  const map = useRef<maplibregl.Map | null>(null)
  const markersRef = useRef<{ [key: string]: maplibregl.Marker & { isCluster?: boolean, clusterId?: number } }>({})
  const clusterRef = useRef<Supercluster<GeoJSON.Feature<GeoJSON.Point, ClusterProperties>, ClusterProperties>>()
  const geofencingLayersRef = useRef<string[]>([])
  const [hoveredZones, setHoveredZones] = useState<GeofencingZoneFeature[]>([])
  const [mousePosition, setMousePosition] = useState<{ x: number; y: number } | null>(null)

  useEffect(() => {
    const style = document.createElement('style')
    style.textContent = popupStyle
    document.head.appendChild(style)
    return () => {
      document.head.removeChild(style)
    }
  }, [])

  const createVehiclePopupContent = (vehicle: Vehicle) => {
    const status = vehicle.isDisabled ? 'disabled' :
                  vehicle.isReserved ? 'reserved' :
                  'available'
    
    const statusText = vehicle.isDisabled ? 'Disabled' :
                      vehicle.isReserved ? 'Reserved' :
                      'Available'

    const operatorName = vehicle.system.operator
      ? getTranslatedName(vehicle.system.operator.name)
      : 'Unknown Operator'

    return `
      <div class="popup-header">
        ${operatorName}
      </div>
      <div class="popup-body">
        <div class="popup-stat">
          <span class="popup-stat-label">Form Factor:</span>
          <span class="popup-stat-value">${vehicle.vehicleType.formFactor.toLowerCase()}</span>
        </div>
        <div class="popup-stat">
          <span class="popup-stat-label">Propulsion:</span>
          <span class="popup-stat-value">${vehicle.vehicleType.propulsionType.toLowerCase()}</span>
        </div>
        <div class="popup-status status-${status}">
          ${statusText}
        </div>
      </div>
    `
  }

  const createStationPopupContent = (station: Station) => {
    const status = !station.isInstalled || !station.isRenting ? 'disabled' :
                  station.numBikesAvailable === 0 ? 'reserved' :
                  'available'
    
    const statusText = !station.isInstalled ? 'Not Installed' :
                      !station.isRenting ? 'Not Renting' :
                      station.numBikesAvailable === 0 ? 'No Bikes Available' :
                      'Available'

    const operatorName = station.system.operator 
      ? getTranslatedName(station.system.operator.name)
      : 'Unknown Operator'

    return `
      <div class="popup-header">
        ${getTranslatedName(station.name)}
      </div>
      <div class="popup-body">
        <div class="popup-stat">
          <span class="popup-stat-label">Operator:</span>
          <span class="popup-stat-value">${operatorName}</span>
        </div>
        <div class="popup-stat">
          <span class="popup-stat-label">Available Bikes:</span>
          <span class="popup-stat-value">${station.numBikesAvailable}</span>
        </div>
        <div class="popup-stat">
          <span class="popup-stat-label">Available Docks:</span>
          <span class="popup-stat-value">${station.numDocksAvailable}</span>
        </div>
        <div class="popup-stat">
          <span class="popup-stat-label">Total Capacity:</span>
          <span class="popup-stat-value">${station.capacity}</span>
        </div>
        <div class="popup-status status-${status}">
          ${statusText}
        </div>
      </div>
    `
  }

  const createGeoJSONFeatures = useCallback((points: GeoPoint[]) => {
    return points.map(point => ({
      type: 'Feature' as const,
      properties: {
        id: point.id,
        count: 1,
        type: point.type,
        data: point.data
      },
      geometry: {
        type: 'Point' as const,
        coordinates: [point.lon, point.lat]
      }
    }))
  }, [])

  const handleClusterClick = useCallback((clusterId: number, longitude: number, latitude: number) => {
    if (!map.current || !clusterRef.current) return

    const expansionZoom = Math.min(
      (clusterRef.current.getClusterExpansionZoom(clusterId)),
      16
    )

    map.current.easeTo({
      center: [longitude, latitude],
      zoom: expansionZoom,
      duration: 500
    })
  }, [])

  const updateClusters = useCallback(() => {
    if (!map.current) return

    // Clear existing markers
    Object.values(markersRef.current).forEach(marker => marker.remove())
    markersRef.current = {}

    // Prepare points based on current mode
    const points: GeoPoint[] = mode === 'vehicles' 
      ? vehicles.map(v => ({ id: v.id, lat: v.lat, lon: v.lon, type: 'vehicle' as const, data: v }))
      : stations.map(s => ({ id: s.id, lat: s.lat, lon: s.lon, type: 'station' as const, data: s }))

    if (points.length === 0) return

    // Initialize Supercluster
    clusterRef.current = new Supercluster({
      radius: 40,
      maxZoom: 16,
      map: (props) => ({
        count: props.count,
        type: props.type
      })
    })

    // Load features
    const features = createGeoJSONFeatures(points)
    clusterRef.current.load(features)

    // Get map bounds
    const bounds = map.current.getBounds()
    const zoom = Math.floor(map.current.getZoom())

    // Get clusters
    const clusters = clusterRef.current.getClusters(
      [bounds.getWest(), bounds.getSouth(), bounds.getEast(), bounds.getNorth()],
      zoom
    )

    // Create markers for clusters and points
    clusters.forEach(cluster => {
      if (!map.current) return

      const [longitude, latitude] = cluster.geometry.coordinates
      const properties = cluster.properties

      if (properties.cluster) {
        const element = createClusterMarkerElement(properties.point_count, mode)
        
        element.addEventListener('click', () => {
          handleClusterClick(properties.cluster_id, longitude, latitude)
        })
        element.style.cursor = 'pointer'

        const marker = new maplibregl.Marker({
          element
        })
          .setLngLat([longitude, latitude])
          .addTo(map.current)

        const clusterMarker = marker as maplibregl.Marker & { isCluster: boolean; clusterId: number }
        clusterMarker.isCluster = true
        clusterMarker.clusterId = properties.cluster_id
        markersRef.current[cluster.id!] = clusterMarker
      } else {
        const point = properties.data as Vehicle | Station
        const isStation = 'numBikesAvailable' in point

        const markerColor = isStation
          ? (!point.isInstalled || !point.isRenting) ? '#ff0000'
            : point.numBikesAvailable === 0 ? '#ffa500'
            : '#4CAF50'
          : (point as Vehicle).isDisabled ? '#ff0000'
            : (point as Vehicle).isReserved ? '#ffa500'
            : '#4CAF50'

        const popup = new maplibregl.Popup({
          offset: 25,
          closeButton: false,
          closeOnClick: true,
          maxWidth: '300px'
        }).setHTML(
          isStation
            ? createStationPopupContent(point as Station)
            : createVehiclePopupContent(point as Vehicle)
        )

        const marker = new maplibregl.Marker({
          color: markerColor,
          scale: 0.8
        })
          .setLngLat([longitude, latitude])
          .setPopup(popup)
          .addTo(map.current)

        markersRef.current[properties.id] = marker as any
      }
    })
  }, [mode, vehicles, stations, createGeoJSONFeatures, handleClusterClick])

  const createClusterMarkerElement = (count: number, mode: MapMode) => {
    const element = document.createElement('div')
    element.className = 'cluster-marker'
    element.style.width = '30px'
    element.style.height = '30px'
    element.style.borderRadius = '50%'
    element.style.backgroundColor = mode === 'vehicles' ? '#FF5959' : '#4A90E2'
    element.style.color = 'white'
    element.style.display = 'flex'
    element.style.alignItems = 'center'
    element.style.justifyContent = 'center'
    element.style.fontSize = '14px'
    element.style.fontWeight = 'bold'
    element.innerText = count.toString()
    return element
  }

  const decodePolylineToMultiPolygon = (polylineEncodedMultiPolygon: string[][]): number[][][][] => {
    return polylineEncodedMultiPolygon.map(polygon => 
      polygon.map(ring => {
        const decoded = polyline.decode(ring, 6)
        return decoded.map(([lat, lon]) => [lon, lat])
      })
    )
  }

  const processGeofencingFeature = (feature: GeofencingZoneFeature): GeofencingZoneFeature => {
    if (feature.properties.polylineEncodedMultiPolygon && !feature.geometry) {
      const coordinates = decodePolylineToMultiPolygon(feature.properties.polylineEncodedMultiPolygon)
      return {
        ...feature,
        geometry: {
          type: 'MultiPolygon',
          coordinates
        }
      }
    }
    return feature
  }

  const geofencingFeaturesRef = useRef<Map<string, GeofencingZoneFeature[]>>(new Map())

  const updateGeofencingZones = useCallback(() => {
    if (!map.current) return

    // Remove existing geofencing layers
    geofencingLayersRef.current.forEach(layerId => {
      if (map.current?.getLayer(layerId)) {
        map.current.removeLayer(layerId)
      }
      if (map.current?.getLayer(`${layerId}-outline`)) {
        map.current.removeLayer(`${layerId}-outline`)
      }
      if (map.current?.getLayer(`${layerId}-hover`)) {
        map.current.removeLayer(`${layerId}-hover`)
      }
      if (map.current?.getSource(layerId)) {
        map.current.removeSource(layerId)
      }
    })
    geofencingLayersRef.current = []
    geofencingFeaturesRef.current.clear()

    // Add new geofencing zones
    geofencingZones.forEach((zone, zoneIndex) => {
      if (!zone.geojson?.features) return

      const processedFeatures = zone.geojson.features.map(processGeofencingFeature)
      
      const sourceId = `geofencing-${zone.systemId}-${zoneIndex}`
      
      // Store features for hover detection
      geofencingFeaturesRef.current.set(sourceId, processedFeatures)
      
      map.current?.addSource(sourceId, {
        type: 'geojson',
        data: {
          type: 'FeatureCollection',
          features: processedFeatures
        }
      })

      // Determine zone color based on rules
      let fillColor = '#0088ff' // Default blue
      let lineColor = '#0066cc' // Default darker blue
      
      // Check first rule if it exists
      if (processedFeatures.length > 0 && processedFeatures[0].properties.rules && processedFeatures[0].properties.rules.length > 0) {
        const firstRule = processedFeatures[0].properties.rules[0]
        if (!firstRule.rideStartAllowed && !firstRule.rideEndAllowed) {
          fillColor = '#ff0000' // Red for no-go zones
          lineColor = '#cc0000'
        } else if (!firstRule.rideEndAllowed) {
          fillColor = '#ffa500' // Orange for no-parking zones
          lineColor = '#ff8800'
        } else if (firstRule.stationParking) {
          fillColor = '#4CAF50' // Green for station parking zones
          lineColor = '#388E3C'
        }
      }

      // Add fill layer
      map.current?.addLayer({
        id: sourceId,
        type: 'fill',
        source: sourceId,
        paint: {
          'fill-color': fillColor,
          'fill-opacity': 0.3
        }
      })

      // Add hover highlight layer
      map.current?.addLayer({
        id: `${sourceId}-hover`,
        type: 'fill',
        source: sourceId,
        paint: {
          'fill-color': fillColor,
          'fill-opacity': ['case', ['boolean', ['feature-state', 'hover'], false], 0.6, 0]
        }
      })

      // Add outline layer
      map.current?.addLayer({
        id: `${sourceId}-outline`,
        type: 'line',
        source: sourceId,
        paint: {
          'line-color': lineColor,
          'line-width': 2
        }
      })

      geofencingLayersRef.current.push(sourceId)
    })
  }, [geofencingZones])

  useEffect(() => {
    if (!mapContainer.current || map.current) return

    map.current = new maplibregl.Map({
      container: mapContainer.current,
      style: {
        version: 8,
        sources: {
          osm: {
            type: 'raster',
            tiles: ['https://tile.openstreetmap.org/{z}/{x}/{y}.png'],
            tileSize: 256,
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          }
        },
        layers: [
          {
            id: 'osm',
            type: 'raster',
            source: 'osm',
            minzoom: 0,
            maxzoom: 19
          }
        ]
      },
      center: [10.7522, 59.9139],
      zoom: 13
    })

    map.current.addControl(new maplibregl.NavigationControl())

    const bounds = map.current.getBounds()
    onViewportChange({
      minimumLatitude: bounds.getSouth(),
      maximumLatitude: bounds.getNorth(),
      minimumLongitude: bounds.getWest(),
      maximumLongitude: bounds.getEast()
    })

    return () => {
      if (map.current) {
        map.current.remove()
        map.current = null
      }
    }
  }, [])

  useEffect(() => {
    if (!map.current) return

    const handleMapMove = () => {
      if (!map.current) return
      
      requestAnimationFrame(() => {
        updateClusters()
        const bounds = map.current?.getBounds()
        if (bounds) {
          onViewportChange({
            minimumLatitude: bounds.getSouth(),
            maximumLatitude: bounds.getNorth(),
            minimumLongitude: bounds.getWest(),
            maximumLongitude: bounds.getEast()
          })
        }
      })
    }

    map.current.on('moveend', handleMapMove)
    map.current.on('zoomend', handleMapMove)

    return () => {
      if (map.current) {
        map.current.off('moveend', handleMapMove)
        map.current.off('zoomend', handleMapMove)
      }
    }
  }, [onViewportChange, updateClusters])

  useEffect(() => {
    if (!map.current) return

    const rafId = requestAnimationFrame(() => {
      updateClusters()
    })

    return () => {
      cancelAnimationFrame(rafId)
    }
  }, [vehicles, stations, mode, updateClusters])

  useEffect(() => {
    if (!map.current) return
    
    // Only update if we have zones or if zones were cleared
    if (geofencingZones.length > 0 || geofencingLayersRef.current.length > 0) {
      updateGeofencingZones()
    }
  }, [geofencingZones, updateGeofencingZones])

  // Handle mouse move for geofencing zones
  useEffect(() => {
    if (!map.current || geofencingLayersRef.current.length === 0) return

    const handleMouseMove = (e: maplibregl.MapMouseEvent) => {
      const features = map.current?.queryRenderedFeatures(e.point, {
        layers: geofencingLayersRef.current
      })

      if (features && features.length > 0) {
        // Get unique zones (remove duplicates)
        const uniqueZones = new Map<string, GeofencingZoneFeature>()
        features.forEach(f => {
          const name = f.properties?.name || 'Unnamed zone'
          if (!uniqueZones.has(name)) {
            uniqueZones.set(name, f as unknown as GeofencingZoneFeature)
          }
        })
        
        setHoveredZones(Array.from(uniqueZones.values()))
        setMousePosition({ x: e.point.x, y: e.point.y })
        map.current!.getCanvas().style.cursor = 'pointer'
      } else {
        setHoveredZones([])
        setMousePosition(null)
        map.current!.getCanvas().style.cursor = ''
      }
    }

    const handleMouseLeave = () => {
      setHoveredZones([])
      setMousePosition(null)
      map.current!.getCanvas().style.cursor = ''
    }

    map.current.on('mousemove', handleMouseMove)
    map.current.on('mouseleave', handleMouseLeave)

    return () => {
      if (map.current) {
        map.current.off('mousemove', handleMouseMove)
        map.current.off('mouseleave', handleMouseLeave)
      }
    }
  }, [geofencingZones])

  const getRuleDescription = (rule: GeofencingZoneRule) => {
    const parts = []
    if (!rule.rideStartAllowed && !rule.rideEndAllowed) {
      parts.push('🚫 No-go zone')
    } else {
      if (!rule.rideStartAllowed) parts.push('❌ No ride start')
      if (!rule.rideEndAllowed) parts.push('🅿️ No parking')
      if (!rule.rideThroughAllowed) parts.push('🚷 No ride through')
    }
    if (rule.stationParking) parts.push('✅ Station parking')
    if (rule.maximumSpeedKph) parts.push(`⚡ Max ${rule.maximumSpeedKph} km/h`)
    return parts.length > 0 ? parts.join(' • ') : '✅ Allowed'
  }

  return (
    <>
      <Box
        ref={mapContainer}
        sx={{
          flex: 1,
          height: '100vh',
          position: 'relative',
          '& .maplibregl-canvas-container': {
            height: '100%'
          }
        }}
      />
      {hoveredZones.length > 0 && mousePosition && (
        <Box
          sx={{
            position: 'absolute',
            left: mousePosition.x + 10,
            top: mousePosition.y - 10,
            backgroundColor: 'rgba(255, 255, 255, 0.95)',
            border: '1px solid #ccc',
            borderRadius: 1,
            padding: 1,
            pointerEvents: 'none',
            zIndex: 1000,
            maxWidth: 300,
            boxShadow: 2
          }}
        >
          {hoveredZones.map((zone, idx) => {
            const formatTime = (timestamp?: number) => {
              if (!timestamp) return null
              const date = new Date(timestamp * 1000)
              return date.toLocaleString()
            }
            
            const start = formatTime(zone.properties?.start)
            const end = formatTime(zone.properties?.end)
            
            return (
              <Box key={idx} sx={{ mb: idx < hoveredZones.length - 1 ? 1 : 0 }}>
                <Box sx={{ fontWeight: 'bold', fontSize: '14px', mb: 0.5 }}>
                  {zone.properties?.name || 'Unnamed zone'}
                </Box>
                {(start || end) && (
                  <Box sx={{ fontSize: '11px', color: '#888', mb: 0.5, fontStyle: 'italic' }}>
                    {start && end && `⏰ ${start} - ${end}`}
                    {start && !end && `⏰ From ${start}`}
                    {!start && end && `⏰ Until ${end}`}
                  </Box>
                )}
                {Array.isArray(zone.properties?.rules) && zone.properties.rules.map((rule, ruleIdx) => (
                  <Box key={ruleIdx} sx={{ fontSize: '12px', color: '#666' }}>
                    {getRuleDescription(rule)}
                  </Box>
                ))}
                {!Array.isArray(zone.properties?.rules) && (
                  <Box sx={{ fontSize: '12px', color: '#666' }}>
                    No specific rules defined
                  </Box>
                )}
              </Box>
            )
          })}
        </Box>
      )}
    </>
  )
}

const getTranslatedName = (translatedString: { translation: { value: string, language: string }[] }): string => {
  const norwegianTranslation = translatedString.translation.find(t => t.language === 'nor')
  const englishTranslation = translatedString.translation.find(t => t.language === 'eng')
  const firstTranslation = translatedString.translation[0]
  
  return (norwegianTranslation || englishTranslation || firstTranslation)?.value || 'Unknown'
}
