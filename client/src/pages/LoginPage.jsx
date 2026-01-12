import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  Card,
  CardContent,
  Alert,
  InputAdornment,
  IconButton,
  Divider,
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';

const LoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const from = location.state?.from || '/';

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await login(formData.email, formData.password);
      navigate(from, { replace: true });
    } catch (error) {
      setError(error.response?.data?.message || 'Błąd logowania');
    } finally {
      setLoading(false);
    }
  };

  const demoAccounts = [
    { email: 'admin@shop.com', password: 'admin123', role: 'Admin' },
    { email: 'user1@shop.com', password: 'user123', role: 'Użytkownik' },
  ];

  const loginWithDemo = (account) => {
    setFormData({ email: account.email, password: account.password });
  };

  return (
    <Container maxWidth="xs">
      <Box sx={{ minHeight: '70vh', display: 'flex', alignItems: 'center', py: 4 }}>
        <Card sx={{ width: '100%', boxShadow: '0 1px 3px rgba(0,0,0,0.08)' }}>
          <CardContent sx={{ p: 3 }}>
            <Box sx={{ textAlign: 'center', mb: 3 }}>
              <Typography variant="h5" fontWeight={700} sx={{ color: '#1f2937', mb: 0.5 }}>
                Witaj ponownie!
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Zaloguj się do TamTemuExpress
              </Typography>
            </Box>

            {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

            <form onSubmit={handleSubmit}>
              <TextField
                fullWidth
                size="small"
                label="Email"
                name="email"
                type="email"
                placeholder="twoj@email.com"
                value={formData.email}
                onChange={handleChange}
                required
                sx={{ mb: 2 }}
              />
              <TextField
                fullWidth
                size="small"
                label="Hasło"
                name="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Wpisz hasło"
                value={formData.password}
                onChange={handleChange}
                required
                sx={{ mb: 2 }}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton size="small" onClick={() => setShowPassword(!showPassword)} edge="end">
                        {showPassword ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />

              <Button type="submit" fullWidth variant="contained" disabled={loading} sx={{ mb: 2 }}>
                {loading ? 'Logowanie...' : 'Zaloguj się'}
              </Button>
            </form>

            <Box sx={{ textAlign: 'center', mb: 2 }}>
              <Typography variant="body2" color="text.secondary">
                Nie masz konta?{' '}
                <Link to="/register" style={{ color: '#f97316', fontWeight: 600, textDecoration: 'none' }}>
                  Zarejestruj się
                </Link>
              </Typography>
            </Box>

            <Divider sx={{ my: 2 }}>
              <Typography variant="caption" color="text.secondary">KONTA DEMO</Typography>
            </Divider>

            <Box sx={{ display: 'flex', gap: 1 }}>
              {demoAccounts.map((account) => (
                <Button
                  key={account.email}
                  variant="outlined"
                  size="small"
                  fullWidth
                  onClick={() => loginWithDemo(account)}
                  sx={{ borderColor: '#e5e7eb', color: '#374151', '&:hover': { borderColor: '#f97316', backgroundColor: 'rgba(249,115,22,0.05)' } }}
                >
                  {account.role}
                </Button>
              ))}
            </Box>
          </CardContent>
        </Card>
      </Box>
    </Container>
  );
};

export default LoginPage;
