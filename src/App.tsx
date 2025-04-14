import { useState, useEffect } from 'react'
import { Box, CssBaseline, ThemeProvider, createTheme, ToggleButton, ToggleButtonGroup } from '@mui/material'
import { useVehiclesAndStations } from './hooks/useVehiclesAndStations'
import { MapContainer } from './components/MapContainer'
import { Header } from './components/Header'
import { MapMode } from './types'
import debounce from 'lodash/debounce'
import DirectionsBikeIcon from '@mui/icons-material/DirectionsBike'
import LocalParkingIcon from '@mui/icons-material/LocalParking'

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#FF5959'
    }
  }
})



interface Viewport {
  minimumLatitude: number
  maximumLatitude: number
  minimumLongitude: number
  maximumLongitude: number
}

function MapView() {
  const [mode, setMode] = useState<MapMode>('vehicles')
  const [bounds, setBounds] = useState<Viewport>({
    minimumLatitude: 59.9,
    maximumLatitude: 60.0,
    minimumLongitude: 10.7,
    maximumLongitude: 10.8,
  })
  
  // Use new hook for fetching and subscribing with bounding box
  const { vehicles, stations, connectionStatus, updateStats } = useVehiclesAndStations(bounds);

  // Filter out virtual stations
  const nonVirtualStations = stations.filter(station => !station.isVirtualStation)

  useEffect(() => {
    if (connectionStatus === 'connected' && (updateStats.vehicles % 10 === 0 || updateStats.stations % 10 === 0)) {
      console.log('Connection:', connectionStatus, 'Vehicle updates:', updateStats.vehicles, 'Station updates:', updateStats.stations);
    }
  }, [connectionStatus, updateStats]);

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
          left: '50%',
          transform: 'translateX(-50%)',
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
      </Box>
      <Header />
      <MapContainer
        vehicles={mode === 'vehicles' ? vehicles : []}
        stations={mode === 'stations' ? nonVirtualStations : []}
        mode={mode}
        onViewportChange={handleViewportChange}
      />
    </Box>
  )
}

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ height: '100vh', width: '100vw' }}>
        <MapView />
      </Box>
    </ThemeProvider>
  )
}

export default App
