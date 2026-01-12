import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
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
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';

const RegisterPage = () => {
  const navigate = useNavigate();
  const { register } = useAuth();

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      setError('Hasła nie są identyczne');
      return;
    }
    if (formData.password.length < 6) {
      setError('Hasło musi mieć min. 6 znaków');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await register(formData.firstName, formData.lastName, formData.email, formData.password);
      navigate('/');
    } catch (error) {
      setError(error.response?.data?.message || 'Błąd rejestracji');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="xs">
      <Box sx={{ minHeight: '70vh', display: 'flex', alignItems: 'center', py: 4 }}>
        <Card sx={{ width: '100%', boxShadow: '0 1px 3px rgba(0,0,0,0.08)' }}>
          <CardContent sx={{ p: 3 }}>
            <Box sx={{ textAlign: 'center', mb: 3 }}>
              <Typography variant="h5" fontWeight={700} sx={{ color: '#1f2937', mb: 0.5 }}>
                Utwórz konto
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Dołącz do TamTemuExpress
              </Typography>
            </Box>

            {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

            <form onSubmit={handleSubmit}>
              <Box sx={{ display: 'flex', gap: 1.5, mb: 1.5 }}>
                <TextField
                  fullWidth
                  size="small"
                  label="Imię"
                  name="firstName"
                  placeholder="Jan"
                  value={formData.firstName}
                  onChange={handleChange}
                  required
                />
                <TextField
                  fullWidth
                  size="small"
                  label="Nazwisko"
                  name="lastName"
                  placeholder="Kowalski"
                  value={formData.lastName}
                  onChange={handleChange}
                  required
                />
              </Box>
              <TextField
                fullWidth
                size="small"
                label="Email"
                name="email"
                type="email"
                placeholder="jan.kowalski@email.com"
                value={formData.email}
                onChange={handleChange}
                required
                sx={{ mb: 1.5 }}
              />
              <TextField
                fullWidth
                size="small"
                label="Hasło"
                name="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Minimum 6 znaków"
                value={formData.password}
                onChange={handleChange}
                required
                sx={{ mb: 1.5 }}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton size="small" onClick={() => setShowPassword(!showPassword)}>
                        {showPassword ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
              <TextField
                fullWidth
                size="small"
                label="Potwierdź hasło"
                name="confirmPassword"
                type={showPassword ? 'text' : 'password'}
                placeholder="Powtórz hasło"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                sx={{ mb: 2 }}
              />
              <Button type="submit" fullWidth variant="contained" disabled={loading}>
                {loading ? 'Rejestracja...' : 'Zarejestruj się'}
              </Button>
            </form>

            <Box sx={{ textAlign: 'center', mt: 2 }}>
              <Typography variant="body2" color="text.secondary">
                Masz już konto?{' '}
                <Link to="/login" style={{ color: '#f97316', fontWeight: 600, textDecoration: 'none' }}>
                  Zaloguj się
                </Link>
              </Typography>
            </Box>
          </CardContent>
        </Card>
      </Box>
    </Container>
  );
};

export default RegisterPage;
