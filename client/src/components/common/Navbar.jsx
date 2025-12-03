import React from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  useScrollTrigger,
  Slide,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemText,
  Divider,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import {
  LocalPharmacy,
  Menu as MenuIcon,
  Close as CloseIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

function HideOnScroll(props) {
  const { children } = props;
  const trigger = useScrollTrigger();

  return (
    <Slide appear={false} direction="down" in={!trigger}>
      {children}
    </Slide>
  );
}

const Navbar = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [mobileOpen, setMobileOpen] = React.useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const navItems = [
    { label: 'Home', path: '/' },
    { label: 'About', path: '/about' },
    { label: 'Contact', path: '/contact' },
    { label: 'Support', path: '/support' },
  ];

  const drawer = (
    <Box sx={{ width: 280, backgroundColor: '#ECF4E8', height: '100%' }}>
      <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h6" sx={{ fontWeight: 700, color: '#2C3E50', display: 'flex', alignItems: 'center', gap: 1 }}>
          <LocalPharmacy sx={{ color: '#ABE7B2' }} /> Jayathura
        </Typography>
        <IconButton onClick={handleDrawerToggle}>
          <CloseIcon sx={{ color: '#2C3E50' }} />
        </IconButton>
      </Box>
      <Divider />
      <List>
        {navItems.map((item) => (
          <ListItem button key={item.label} onClick={() => { navigate(item.path); handleDrawerToggle(); }}>
            <ListItemText primary={item.label} sx={{ color: '#2C3E50', fontWeight: 500 }} />
          </ListItem>
        ))}
      </List>
      <Box sx={{ p: 2, mt: 'auto' }}>
        <Button
          fullWidth
          variant="contained"
          sx={{
            backgroundColor: '#ABE7B2',
            color: '#2C3E50',
            '&:hover': { backgroundColor: '#CBF3BB' },
            mb: 1,
          }}
          onClick={() => { navigate('/login'); handleDrawerToggle(); }}
        >
          Login
        </Button>
        <Button
          fullWidth
          variant="contained"
          sx={{
            backgroundColor: '#93BFC7',
            color: '#2C3E50',
            '&:hover': { backgroundColor: '#7AA8B0' },
          }}
          onClick={() => { navigate('/register'); handleDrawerToggle(); }}
        >
          Get Started
        </Button>
      </Box>
    </Box>
  );

  return (
    <>
      <HideOnScroll>
        <AppBar position="fixed" sx={{ backgroundColor: '#FFFFFF', boxShadow: '0 2px 10px rgba(0,0,0,0.05)' }}>
          <Toolbar>
            <Typography
              variant="h5"
              component="div"
              sx={{
                flexGrow: 1,
                fontWeight: 700,
                color: '#2C3E50',
                display: 'flex',
                alignItems: 'center',
                gap: 1,
              }}
            >
              <LocalPharmacy sx={{ color: '#ABE7B2' }} />
              Jayathura LifeCare
            </Typography>

            {isMobile ? (
              <IconButton edge="start" onClick={handleDrawerToggle}>
                <MenuIcon sx={{ color: '#2C3E50', fontSize: 30 }} />
              </IconButton>
            ) : (
              <Box sx={{ display: 'flex', gap: 3, alignItems: 'center' }}>
                {navItems.map((item) => (
                  <Button
                    key={item.label}
                    onClick={() => navigate(item.path)}
                    sx={{
                      color: '#2C3E50',
                      fontWeight: 500,
                      textTransform: 'none',
                      '&:hover': { color: '#93BFC7' },
                    }}
                  >
                    {item.label}
                  </Button>
                ))}
                <Button
                  onClick={() => navigate('/login')}
                  sx={{
                    color: '#93BFC7',
                    fontWeight: 500,
                    '&:hover': { backgroundColor: '#f5fffa' },
                  }}
                >
                  Login
                </Button>
                <Button
                  variant="contained"
                  sx={{
                    backgroundColor: '#ABE7B2',
                    color: '#2C3E50',
                    fontWeight: 600,
                    '&:hover': { backgroundColor: '#CBF3BB' },
                    px: 3,
                  }}
                  onClick={() => navigate('/register')}
                >
                  Get Started
                </Button>
              </Box>
            )}
          </Toolbar>
        </AppBar>
      </HideOnScroll>

      <Drawer anchor="right" open={mobileOpen} onClose={handleDrawerToggle}>
        {drawer}
      </Drawer>

      <Toolbar />
    </>
  );
};

export default Navbar;

