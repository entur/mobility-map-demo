import { Box, Typography, Link } from '@mui/material'

export const Header = () => {
  return (
    <Box
      sx={{
        position: 'absolute',
        bottom: 20,
        left: 20,
        zIndex: 1000,
        backgroundColor: '#181c56',
        borderRadius: 1,
        boxShadow: 2,
        p: 2,
        maxWidth: '400px'
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
        <img 
          src="/logo.png" 
          alt="Entur logo" 
          style={{ height: '24px', marginRight: '12px' }}
        />
        <Typography variant="h6" component="h1" sx={{ color: '#ff5959' }}>
          Mobility Map Demo
        </Typography>
      </Box>
      <Typography variant="body2" sx={{ color: 'white' }}>
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
    </Box>
  )
}
