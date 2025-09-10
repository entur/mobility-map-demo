import React, { useState, useEffect } from 'react'
import { Box, CssBaseline, ThemeProvider, createTheme, ToggleButton, ToggleButtonGroup, FormControl, InputLabel, Select, OutlinedInput, MenuItem, Checkbox, ListItemText, Tooltip } from '@mui/material'
import { ApolloClient, ApolloProvider, InMemoryCache, createHttpLink, useQuery, gql } from '@apollo/client'
import { MapContainer } from './components/MapContainer'
import { Header } from './components/Header'
import { Vehicle, Station, MapMode, Operator, GeofencingZones } from './types'
import debounce from 'lodash/debounce'
import DirectionsBikeIcon from '@mui/icons-material/DirectionsBike'
import LocalParkingIcon from '@mui/icons-material/LocalParking'
import MapIcon from '@mui/icons-material/Map'

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#FF5959'
    }
  }
})

const OPERATORS_QUERY = gql`
  query Operators {
    operators {
      id
      name {
        translation {
          value
          language
        }
      }
    }
  }
`

const VEHICLES_QUERY = gql`
  query Vehicles(
    $minimumLatitude: Float!
    $maximumLatitude: Float!
    $minimumLongitude: Float!
    $maximumLongitude: Float!
    $operators: [String]
  ) {
    vehicles(
      minimumLatitude: $minimumLatitude
      maximumLatitude: $maximumLatitude
      minimumLongitude: $minimumLongitude
      maximumLongitude: $maximumLongitude
      operators: $operators
    ) {
      id
      lat
      lon
      system {
        id
        operator {
          id
          name {
            translation {
              value
              language
            }
          }
        }
      }
      isReserved
      isDisabled
      vehicleType {
        formFactor
        propulsionType
      }
    }
  }
`

const STATIONS_QUERY = gql`
  query Stations(
    $minimumLatitude: Float!
    $maximumLatitude: Float!
    $minimumLongitude: Float!
    $maximumLongitude: Float!
    $operators: [String]
  ) {
    stations(
      minimumLatitude: $minimumLatitude
      maximumLatitude: $maximumLatitude
      minimumLongitude: $minimumLongitude
      maximumLongitude: $maximumLongitude
      operators: $operators
    ) {
      id
      name {
        translation {
          value
          language
        }
      }
      lat
      lon
      system {
        id
        name {
          translation {
            value
            language
          }
        }
        operator {
          id
          name {
            translation {
              value
              language
            }
          }
        }
      }
      numBikesAvailable
      numDocksAvailable
      capacity
      isInstalled
      isRenting
      isReturning
      isVirtualStation
    }
  }
`

const GEOFENCING_ZONES_QUERY = gql`
  query GeofencingZones($systemIds: [ID]) {
    geofencingZones(systemIds: $systemIds) {
      systemId
      geojson {
        type
        features {
          type
          properties {
            name
            start
            end
            rules {
              vehicleTypeIds
              rideStartAllowed
              rideEndAllowed
              rideThroughAllowed
              maximumSpeedKph
              stationParking
            }
            polylineEncodedMultiPolygon
          }
          geometry {
            type
            coordinates
          }
        }
      }
    }
  }
`

interface Viewport {
  minimumLatitude: number
  maximumLatitude: number
  minimumLongitude: number
  maximumLongitude: number
}

function MapView() {
  const [mode, setMode] = useState<MapMode>('vehicles')
  const [selectedOperators, setSelectedOperators] = useState<string[]>([])
  const [showGeofencingZones, setShowGeofencingZones] = useState(false)
  const [bounds, setBounds] = useState<Viewport>({
    minimumLatitude: 59.9,
    maximumLatitude: 60.0,
    minimumLongitude: 10.7,
    maximumLongitude: 10.8,
  })

  const { data: operatorsData } = useQuery<{ operators: Operator[] }>(
    OPERATORS_QUERY
  )

  const { data: vehiclesData } = useQuery<{ vehicles: Vehicle[] }>(
    VEHICLES_QUERY,
    {
      variables: { 
        ...bounds, 
        operators: selectedOperators.length > 0 ? selectedOperators : null 
      },
      pollInterval: 10000,
      skip: mode !== 'vehicles'
    }
  )

  const { data: stationsData } = useQuery<{ stations: Station[] }>(
    STATIONS_QUERY,
    {
      variables: { 
        ...bounds, 
        operators: selectedOperators.length > 0 ? selectedOperators : null 
      },
      pollInterval: 30000,
      skip: mode !== 'stations'
    }
  )

  // Track unique system IDs in state to avoid unnecessary refetches
  const [systemIdsForZones, setSystemIdsForZones] = useState<string[] | null>(null)
  
  // Update system IDs only when the actual set changes
  useEffect(() => {
    if (selectedOperators.length === 0) {
      setSystemIdsForZones(null)
      return
    }
    
    const ids = new Set<string>()
    
    // Check vehicles
    vehiclesData?.vehicles?.forEach(v => {
      if (v.system?.id && v.system?.operator?.id && selectedOperators.includes(v.system.operator.id)) {
        ids.add(v.system.id)
      }
    })
    
    // Check stations
    stationsData?.stations?.forEach(s => {
      if (s.system?.id && s.system?.operator?.id && selectedOperators.includes(s.system.operator.id)) {
        ids.add(s.system.id)
      }
    })
    
    const newSystemIds = ids.size > 0 ? Array.from(ids).sort() : null
    
    // Only update if the system IDs have actually changed
    setSystemIdsForZones(current => {
      const currentStr = current ? current.sort().join(',') : ''
      const newStr = newSystemIds ? newSystemIds.join(',') : ''
      return currentStr !== newStr ? newSystemIds : current
    })
  }, [selectedOperators, vehiclesData, stationsData])

  // Get geofencing zones for systems
  const { data: geofencingData } = useQuery<{ geofencingZones: GeofencingZones[] }>(
    GEOFENCING_ZONES_QUERY,
    {
      variables: {
        systemIds: systemIdsForZones
      },
      skip: !showGeofencingZones,
      // No polling needed - geofencing zones rarely change
      pollInterval: 0
    }
  )

  // Filter out virtual stations
  const nonVirtualStations = stationsData?.stations.filter(station => !station.isVirtualStation) || []

  const debouncedSetBounds = debounce((newBounds: typeof bounds) => {
    setBounds(newBounds)
  }, 500)

  const handleViewportChange = (newBounds: typeof bounds) => {
    debouncedSetBounds(newBounds)
  }

  const handleModeChange = (_event: React.MouseEvent<HTMLElement>, newMode: MapMode) => {
    if (newMode !== null) {
      setMode(newMode)
    }
  }

  const handleOperatorChange = (event: any) => {
    const newOperators = event.target.value as string[]
    setSelectedOperators(newOperators)
    
    // Auto-disable geofencing zones if more than one operator is selected
    if (newOperators.length !== 1) {
      setShowGeofencingZones(false)
    }
  }

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        height: '100vh',
        width: '100vw',
      }}
    >
      <Box
        sx={{
          position: 'absolute',
          top: 10,
          left: 10,
          zIndex: 1000,
          backgroundColor: 'white',
          borderRadius: 1,
          boxShadow: 2,
          p: 0.5,
          display: 'flex',
          flexDirection: 'column',
          gap: 1,
          minWidth: 200
        }}
      >
        <ToggleButtonGroup
          value={mode}
          exclusive
          onChange={handleModeChange}
          aria-label="map mode"
          size="small"
        >
          <ToggleButton value="vehicles" aria-label="vehicles">
            <DirectionsBikeIcon sx={{ mr: 1 }} />
            Vehicles
          </ToggleButton>
          <ToggleButton value="stations" aria-label="stations">
            <LocalParkingIcon sx={{ mr: 1 }} />
            Stations
          </ToggleButton>
        </ToggleButtonGroup>
        <FormControl sx={{ minWidth: 200 }}>
          <InputLabel id="operator-select-label" sx={{ lineHeight: '1em' }}>Operators</InputLabel>
          <Select
            labelId="operator-select-label"
            id="operator-select"
            multiple
            value={selectedOperators}
            onChange={handleOperatorChange}
            input={<OutlinedInput sx={{ '.MuiSelect-select': { display: 'flex', alignItems: 'center' } }} label="Operators" />}
            renderValue={(selected) => {
              const selectedNames = selected.map(id => 
                operatorsData?.operators.find(op => op.id === id)?.name.translation[0].value || id
              )
              return selectedNames.join(', ')
            }}
            size="small"
          >
            {operatorsData?.operators.map((operator) => (
              <MenuItem key={operator.id} value={operator.id}>
                <Checkbox checked={selectedOperators.includes(operator.id)} />
                <ListItemText primary={operator.name.translation[0].value} />
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <Tooltip 
          title={selectedOperators.length !== 1 ? "Select exactly one operator to view geofencing zones" : ""}
          placement="right"
        >
          <span>
            <ToggleButton
              value="geofencing"
              selected={showGeofencingZones}
              onChange={() => setShowGeofencingZones(!showGeofencingZones)}
              size="small"
              sx={{ mt: 1 }}
              disabled={selectedOperators.length !== 1}
            >
              <MapIcon sx={{ mr: 1 }} />
              Geofencing Zones
            </ToggleButton>
          </span>
        </Tooltip>
      </Box>
      <Header />
      <MapContainer
        vehicles={mode === 'vehicles' ? vehiclesData?.vehicles || [] : []}
        stations={mode === 'stations' ? nonVirtualStations : []}
        mode={mode}
        onViewportChange={handleViewportChange}
        geofencingZones={showGeofencingZones ? geofencingData?.geofencingZones || [] : []}
      />
    </Box>
  )
}

function App() {
  const [config, setConfig] = useState<{ apiUrl: string } | null>(null)

  useEffect(() => {
    fetch('/bootstrap.json')
      .then(response => response.json())
      .then(config => setConfig(config))
      .catch(error => console.error('Error loading configuration:', error))
  }, [])

  if (!config) {
    return null // or a loading spinner
  }

  const httpLink = createHttpLink({
    uri: config.apiUrl,
    headers: {
      'ET-Client-Name': 'entur-mobility-demo'
    }
  })

  const client = new ApolloClient({
    link: httpLink,
    cache: new InMemoryCache()
  })

  return (
    <ApolloProvider client={client}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Box sx={{ height: '100vh', width: '100vw' }}>
          <MapView />
        </Box>
      </ThemeProvider>
    </ApolloProvider>
  )
}

export default App
