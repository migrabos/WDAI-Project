import { useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Box,
  Button,
  Card,
  CardContent,
  IconButton,
  Grid,
  Divider,
} from '@mui/material';
import { Add, Remove, Delete, ShoppingBag, ArrowBack } from '@mui/icons-material';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

const CartPage = () => {
  const navigate = useNavigate();
  const { items, total, updateQuantity, removeFromCart, checkout } = useCart();
  const { user } = useAuth();

  const handleCheckout = async () => {
    if (!user) {
      navigate('/login', { state: { from: '/cart' } });
      return;
    }
    const result = await checkout();
    if (result.success) {
      navigate('/orders');
    }
  };

  if (items.length === 0) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Box sx={{ textAlign: 'center', py: 6, backgroundColor: '#fff', borderRadius: 2, boxShadow: '0 1px 3px rgba(0,0,0,0.08)' }}>
          <ShoppingBag sx={{ fontSize: 60, color: '#d1d5db', mb: 2 }} />
          <Typography variant="h5" sx={{ color: '#374151', mb: 1 }}>Koszyk jest pusty</Typography>
          <Typography color="text.secondary" sx={{ mb: 3 }}>Dodaj produkty, żeby kontynuować</Typography>
          <Button variant="contained" onClick={() => navigate('/')}>Przeglądaj produkty</Button>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 3 }}>
      <Button startIcon={<ArrowBack />} onClick={() => navigate('/')} sx={{ mb: 2, color: '#6b7280' }}>
        Kontynuuj zakupy
      </Button>

      <Typography variant="h5" sx={{ fontWeight: 700, color: '#1f2937', mb: 3 }}>
        Koszyk ({items.length})
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Card sx={{ boxShadow: '0 1px 3px rgba(0,0,0,0.08)' }}>
            {items.map((item, index) => (
              <Box key={item.id}>
                <CardContent sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                  <Box
                    sx={{ width: 80, height: 80, backgroundColor: '#f9fafb', borderRadius: 1, p: 1, flexShrink: 0, cursor: 'pointer' }}
                    onClick={() => navigate(`/product/${item.productId}`)}
                  >
                    <img src={item.image} alt={item.title} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                  </Box>
                  <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Typography
                      variant="body2"
                      sx={{ fontWeight: 600, mb: 0.5, cursor: 'pointer', '&:hover': { color: '#f97316' } }}
                      onClick={() => navigate(`/product/${item.productId}`)}
                    >
                      {item.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">${item.price?.toFixed(2)} / szt.</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', border: '1px solid #e5e7eb', borderRadius: 1 }}>
                    <IconButton size="small" onClick={() => updateQuantity(item.id, item.quantity - 1)} disabled={item.quantity <= 1}>
                      <Remove fontSize="small" />
                    </IconButton>
                    <Typography sx={{ px: 1.5, minWidth: 24, textAlign: 'center', fontSize: '0.9rem' }}>{item.quantity}</Typography>
                    <IconButton size="small" onClick={() => updateQuantity(item.id, item.quantity + 1)}>
                      <Add fontSize="small" />
                    </IconButton>
                  </Box>
                  <Typography variant="body1" sx={{ fontWeight: 700, color: '#f97316', minWidth: 70, textAlign: 'right' }}>
                    ${(item.price * item.quantity).toFixed(2)}
                  </Typography>
                  <IconButton size="small" onClick={() => removeFromCart(item.id)} sx={{ color: '#9ca3af', '&:hover': { color: '#ef4444' } }}>
                    <Delete fontSize="small" />
                  </IconButton>
                </CardContent>
                {index < items.length - 1 && <Divider />}
              </Box>
            ))}
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card sx={{ boxShadow: '0 1px 3px rgba(0,0,0,0.08)', position: 'sticky', top: 80 }}>
            <CardContent>
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>Podsumowanie</Typography>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography color="text.secondary">Produkty</Typography>
                <Typography>${total.toFixed(2)}</Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                <Typography color="text.secondary">Dostawa</Typography>
                <Typography sx={{ color: '#16a34a', fontWeight: 500 }}>Gratis</Typography>
              </Box>
              <Divider sx={{ my: 2 }} />
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
                <Typography variant="h6" fontWeight={700}>Razem</Typography>
                <Typography variant="h5" sx={{ fontWeight: 800, color: '#f97316' }}>${total.toFixed(2)}</Typography>
              </Box>
              <Button variant="contained" fullWidth size="large" onClick={handleCheckout} sx={{ fontWeight: 700 }}>
                Zamów teraz
              </Button>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

export default CartPage;
