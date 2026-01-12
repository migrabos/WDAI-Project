import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Badge,
  Box,
  Menu,
  MenuItem,
  InputBase,
  Avatar,
  Divider,
  ListItemIcon,
} from '@mui/material';
import {
  ShoppingCart,
  Search,
  Logout,
  History,
  AdminPanelSettings,
} from '@mui/icons-material';
import { styled, alpha } from '@mui/material/styles';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

const SearchWrapper = styled('div')(({ theme }) => ({
  position: 'relative',
  borderRadius: 8,
  backgroundColor: '#f3f4f6',
  '&:hover': {
    backgroundColor: '#e5e7eb',
  },
  marginRight: theme.spacing(2),
  marginLeft: theme.spacing(2),
  width: 'auto',
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(0, 1.5),
  height: '100%',
  position: 'absolute',
  pointerEvents: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: '#9ca3af',
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: '#1f2937',
  '& .MuiInputBase-input': {
    padding: theme.spacing(1, 1, 1, 0),
    paddingLeft: `calc(1em + ${theme.spacing(3)})`,
    width: '200px',
    fontSize: '0.875rem',
    '&:focus': {
      width: '280px',
    },
    transition: theme.transitions.create('width'),
  },
}));

const Header = () => {
  const navigate = useNavigate();
  const { user, logout, isAdmin } = useAuth();
  const { itemCount } = useCart();
  const [anchorEl, setAnchorEl] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = async () => {
    await logout();
    handleClose();
    navigate('/');
  };

  const handleSearch = (e) => {
    if (e.key === 'Enter' && searchQuery.trim()) {
      navigate(`/?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <AppBar position="sticky" elevation={0}>
      <Toolbar sx={{ py: 0.5 }}>
        <Link to="/" style={{ textDecoration: 'none' }}>
          <Typography
            variant="h6"
            sx={{
              fontWeight: 800,
              color: '#f97316',
            }}
          >
            TamTemuExpress
          </Typography>
        </Link>

        <SearchWrapper>
          <SearchIconWrapper>
            <Search />
          </SearchIconWrapper>
          <StyledInputBase
            placeholder="Szukaj..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyPress={handleSearch}
          />
        </SearchWrapper>

        <Box sx={{ flexGrow: 1 }} />

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <IconButton
            component={Link}
            to="/cart"
            sx={{ color: '#6b7280' }}
          >
            <Badge badgeContent={itemCount} color="primary">
              <ShoppingCart />
            </Badge>
          </IconButton>

          {user ? (
            <>
              <IconButton onClick={handleMenu}>
                <Avatar
                  sx={{
                    width: 32,
                    height: 32,
                    backgroundColor: '#f97316',
                    fontSize: '0.8rem',
                  }}
                >
                  {user.firstName?.[0]}{user.lastName?.[0]}
                </Avatar>
              </IconButton>
              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleClose}
                transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
              >
                <Box sx={{ px: 2, py: 1 }}>
                  <Typography variant="subtitle2" fontWeight={600}>
                    {user.firstName} {user.lastName}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {user.email}
                  </Typography>
                </Box>
                <Divider />
                <MenuItem onClick={() => { handleClose(); navigate('/orders'); }}>
                  <ListItemIcon>
                    <History fontSize="small" />
                  </ListItemIcon>
                  Historia zamówień
                </MenuItem>
                {isAdmin && (
                  <MenuItem onClick={() => { handleClose(); navigate('/admin'); }}>
                    <ListItemIcon>
                      <AdminPanelSettings fontSize="small" />
                    </ListItemIcon>
                    Panel Admina
                  </MenuItem>
                )}
                <Divider />
                <MenuItem onClick={handleLogout}>
                  <ListItemIcon>
                    <Logout fontSize="small" />
                  </ListItemIcon>
                  Wyloguj
                </MenuItem>
              </Menu>
            </>
          ) : (
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Button
                size="small"
                component={Link}
                to="/login"
                sx={{ color: '#6b7280' }}
              >
                Zaloguj
              </Button>
              <Button
                size="small"
                variant="contained"
                component={Link}
                to="/register"
              >
                Rejestracja
              </Button>
            </Box>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
