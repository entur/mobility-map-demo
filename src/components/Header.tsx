import { Box, Typography, Link, IconButton, useMediaQuery, useTheme, Collapse } from '@mui/material'
import { useState } from 'react'
import InfoIcon from '@mui/icons-material/Info'
import CloseIcon from '@mui/icons-material/Close'

export const Header = () => {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))
  const [expandedOnMobile, setExpandedOnMobile] = useState(false)
  // Description is always shown on desktop; on mobile it is collapsed by
  // default and toggled by the user. Deriving it during render avoids the
  // effect-based state sync flagged by react-hooks/set-state-in-effect.
  const showDescription = isMobile ? expandedOnMobile : true

  return (
    <Box
      sx={{
        position: 'absolute',
        bottom: { xs: 10, sm: 20 },
        left: { xs: 10, sm: 20 },
        zIndex: 1000,
        backgroundColor: '#181c56',
        borderRadius: 1,
        boxShadow: 2,
        p: { xs: 1.5, sm: 2 },
        maxWidth: { xs: 'calc(100% - 20px)', sm: '400px' }
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', mb: showDescription ? 1 : 0 }}>
        <img 
          src="/logo.png" 
          alt="Entur logo" 
          style={{ height: '24px', marginRight: '12px' }}
        />
        <Typography 
          variant="h6" 
          component="h1" 
          sx={{ 
            color: '#ff5959',
            fontSize: { xs: '1rem', sm: '1.25rem' },
            flexGrow: 1
          }}
        >
          Mobility Map Demo
        </Typography>
        {isMobile && (
          <IconButton
            size="small"
            onClick={() => setExpandedOnMobile((prev) => !prev)}
            sx={{ color: 'white', ml: 1 }}
          >
            {showDescription ? <CloseIcon /> : <InfoIcon />}
          </IconButton>
        )}
      </Box>
      <Collapse in={showDescription}>
        <Typography 
          variant="body2" 
          sx={{ 
            color: 'white',
            fontSize: { xs: '0.875rem', sm: '1rem' }
          }}
        >
          This is a technical demonstration of{' '}
          <Link 
            href="https://developer.entur.org/pages-mobility-docs-mobility-v2" 
            target="_blank"
            rel="noopener noreferrer"
            sx={{ 
              color: 'white',
              textDecoration: 'underline',
              '&:hover': {
                color: '#ff5959'
              }
            }}
          >
            Entur's National Mobility API
          </Link>
          , showing available services for participating operators.
        </Typography>
      </Collapse>
    </Box>
  )
}
