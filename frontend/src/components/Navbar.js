import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ethers } from 'ethers';
import PolarSciContract from '../utils/contract';
import {
  AppBar,
  Box,
  Toolbar,
  IconButton,
  Typography,
  Menu,
  Container,
  Avatar,
  Button,
  Tooltip,
  MenuItem,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import ScienceIcon from '@mui/icons-material/Science';
import DashboardIcon from '@mui/icons-material/Dashboard';
import DataObjectIcon from '@mui/icons-material/DataObject';
import GroupIcon from '@mui/icons-material/Group';

const pages = [
  { name: 'Dashboard', path: '/dashboard', icon: <DashboardIcon /> },
  { name: 'Experiments', path: '/experiments', icon: <ScienceIcon /> },
  { name: 'Data', path: '/data', icon: <DataObjectIcon /> },
  { name: 'Community', path: '/community', icon: <GroupIcon /> },
];

const Navbar = () => {
  const [account, setAccount] = useState('');
  const [balance, setBalance] = useState('0');
  const [contract, setContract] = useState(null);
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  useEffect(() => {
    const initContract = async () => {
      try {
        if (window.ethereum) {
          const provider = new ethers.providers.Web3Provider(window.ethereum);
          const signer = provider.getSigner();
          const polarSciContract = new PolarSciContract(provider, signer);
          await polarSciContract.init();
          setContract(polarSciContract);

          const address = await signer.getAddress();
          setAccount(address);

          const balance = await polarSciContract.getBalance(address);
          setBalance(ethers.utils.formatEther(balance));
        }
      } catch (err) {
        console.error('Failed to initialize contract:', err);
      }
    };

    initContract();
  }, []);

  const connectWallet = async () => {
    try {
      if (window.ethereum) {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        await provider.send("eth_requestAccounts", []);
        const signer = provider.getSigner();
        const address = await signer.getAddress();
        setAccount(address);

        const polarSciContract = new PolarSciContract(provider, signer);
        await polarSciContract.init();
        setContract(polarSciContract);

        const balance = await polarSciContract.getBalance(address);
        setBalance(ethers.utils.formatEther(balance));
      } else {
        alert('Please install MetaMask to use this application');
      }
    } catch (err) {
      console.error('Failed to connect wallet:', err);
    }
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <AppBar position="sticky" sx={{ background: 'rgba(10, 10, 26, 0.8)', backdropFilter: 'blur(10px)' }}>
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          {/* Logo for mobile */}
          <ScienceIcon sx={{ display: { xs: 'flex', md: 'none' }, mr: 1 }} />
          <Typography
            variant="h6"
            noWrap
            component={Link}
            to="/"
            sx={{
              mr: 2,
              display: { xs: 'flex', md: 'none' },
              flexGrow: 1,
              fontFamily: 'monospace',
              fontWeight: 700,
              letterSpacing: '.3rem',
              color: 'inherit',
              textDecoration: 'none',
            }}
          >
            POLARSCI
          </Typography>

          {/* Mobile menu */}
          <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
            <IconButton
              size="large"
              aria-label="menu"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
              color="inherit"
            >
              <MenuIcon />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorElNav}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'left',
              }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              sx={{
                display: { xs: 'block', md: 'none' },
              }}
            >
              {pages.map((page) => (
                <MenuItem
                  key={page.name}
                  component={Link}
                  to={page.path}
                  onClick={handleCloseNavMenu}
                  selected={location.pathname === page.path}
                >
                  <Typography textAlign="center">{page.name}</Typography>
                </MenuItem>
              ))}
            </Menu>
          </Box>

          {/* Logo for desktop */}
          <ScienceIcon sx={{ display: { xs: 'none', md: 'flex' }, mr: 1 }} />
          <Typography
            variant="h6"
            noWrap
            component={Link}
            to="/"
            sx={{
              mr: 2,
              display: { xs: 'none', md: 'flex' },
              fontFamily: 'monospace',
              fontWeight: 700,
              letterSpacing: '.3rem',
              color: 'inherit',
              textDecoration: 'none',
            }}
          >
            POLARSCI
          </Typography>

          {/* Desktop menu */}
          <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
            {pages.map((page) => (
              <Button
                key={page.name}
                component={Link}
                to={page.path}
                onClick={handleCloseNavMenu}
                sx={{
                  my: 2,
                  color: 'white',
                  display: 'block',
                  mx: 1,
                  '&.Mui-selected': {
                    color: 'secondary.main',
                  },
                }}
                startIcon={page.icon}
              >
                {page.name}
              </Button>
            ))}
          </Box>

          {/* User menu */}
          <Box sx={{ flexGrow: 0 }}>
            <Tooltip title="Open settings">
              <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                <Avatar alt="User" src="/static/images/avatar/2.jpg" />
              </IconButton>
            </Tooltip>
            <Menu
              sx={{ mt: '45px' }}
              id="menu-appbar"
              anchorEl={anchorElUser}
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              open={Boolean(anchorElUser)}
              onClose={handleCloseUserMenu}
            >
              <MenuItem onClick={handleCloseUserMenu}>
                <Typography textAlign="center">Profile</Typography>
              </MenuItem>
              <MenuItem onClick={handleCloseUserMenu}>
                <Typography textAlign="center">Settings</Typography>
              </MenuItem>
              <MenuItem onClick={handleCloseUserMenu}>
                <Typography textAlign="center">Logout</Typography>
              </MenuItem>
            </Menu>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Navbar; 