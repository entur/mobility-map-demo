import { useState, useCallback } from 'react'
import { Box, CssBaseline, ThemeProvider, createTheme, ToggleButton, ToggleButtonGroup, FormControl, InputLabel, Select, OutlinedInput, MenuItem, Checkbox, ListItemText } from '@mui/material'
import { ApolloClient, ApolloProvider, InMemoryCache, createHttpLink, useQuery, gql } from '@apollo/client'
import { MapContainer } from './components/MapContainer'
import { Header } from './components/Header'
import { Vehicle, Station, MapMode, Operator } from './types'
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

const httpLink = createHttpLink({
  uri: 'https://api.entur.io/mobility/v2/graphql',
  headers: {
    'ET-Client-Name': 'entur-mobility-demo'
  }
})

const client = new ApolloClient({
  link: httpLink,
  cache: new InMemoryCache()
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
        operator {
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
        name {
          translation {
            value
            language
          }
        }
        operator {
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

interface Viewport {
  minimumLatitude: number
  maximumLatitude: number
  minimumLongitude: number
  maximumLongitude: number
}

function MapView() {
  const [mode, setMode] = useState<MapMode>('vehicles')
  const [selectedOperators, setSelectedOperators] = useState<string[]>([])
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

  // Filter out virtual stations
  const nonVirtualStations = stationsData?.stations.filter(station => !station.isVirtualStation) || []

  const debouncedSetBounds = useCallback(
    debounce((newBounds: typeof bounds) => {
      setBounds(newBounds)
    }, 500),
    []
  )

  const handleViewportChange = useCallback((newBounds: typeof bounds) => {
    debouncedSetBounds(newBounds)
  }, [debouncedSetBounds])

  const handleModeChange = (_event: React.MouseEvent<HTMLElement>, newMode: MapMode) => {
    if (newMode !== null) {
      setMode(newMode)
    }
  }

  const handleOperatorChange = (event: any) => {
    setSelectedOperators(event.target.value as string[])
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
          top: 20,
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
      </Box>
      <Header />
      <MapContainer
        vehicles={mode === 'vehicles' ? vehiclesData?.vehicles || [] : []}
        stations={mode === 'stations' ? nonVirtualStations : []}
        mode={mode}
        onViewportChange={handleViewportChange}
      />
    </Box>
  )
}

function App() {
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
