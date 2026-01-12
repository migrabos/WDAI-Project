import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  Button,
  Chip,
  Grid,
  CircularProgress,
  Divider,
} from '@mui/material';
import { ArrowBack, Receipt } from '@mui/icons-material';
import api from '../services/api';

const OrderDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrder();
  }, [id]);

  const fetchOrder = async () => {
    try {
      const response = await api.get(`/orders/${id}`);
      setOrder(response.data);
    } catch (error) {
      console.error('Error fetching order:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusChip = (status) => {
    const styles = {
      completed: { bg: '#dcfce7', color: '#166534', label: 'Zrealizowane' },
      pending: { bg: '#fef3c7', color: '#92400e', label: 'W realizacji' },
      cancelled: { bg: '#fee2e2', color: '#991b1b', label: 'Anulowane' },
    };
    const s = styles[status] || styles.pending;
    return <Chip label={s.label} size="small" sx={{ backgroundColor: s.bg, color: s.color, fontWeight: 500 }} />;
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
        <CircularProgress sx={{ color: '#f97316' }} />
      </Box>
    );
  }

  if (!order) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Typography variant="h5">Zamówienie nie znalezione</Typography>
        <Button onClick={() => navigate('/orders')} sx={{ mt: 2 }}>Wróć</Button>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 3 }}>
      <Button startIcon={<ArrowBack />} onClick={() => navigate('/orders')} sx={{ mb: 2, color: '#6b7280' }}>
        Wróć do zamówień
      </Button>

      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Card sx={{ boxShadow: '0 1px 3px rgba(0,0,0,0.08)', mb: 2 }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                  <Receipt sx={{ color: '#f97316' }} />
                  <Box>
                    <Typography variant="h6" fontWeight={700}>Zamówienie #{order.id.toString().padStart(5, '0')}</Typography>
                    <Typography variant="caption" color="text.secondary">{new Date(order.createdAt).toLocaleString('pl-PL')}</Typography>
                  </Box>
                </Box>
                {getStatusChip(order.status)}
              </Box>
              <Divider sx={{ my: 2 }} />
              <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 2 }}>Produkty</Typography>
              {order.items?.map((item) => (
                <Box
                  key={item.id}
                  sx={{ display: 'flex', gap: 2, alignItems: 'center', py: 1.5, cursor: 'pointer', '&:hover': { backgroundColor: '#f9fafb' }, borderRadius: 1 }}
                  onClick={() => navigate(`/product/${item.productId}`)}
                >
                  <Box sx={{ width: 50, height: 50, backgroundColor: '#f9fafb', borderRadius: 1, p: 0.5, flexShrink: 0 }}>
                    <img src={item.image} alt={item.title} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                  </Box>
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="body2" fontWeight={500}>{item.title}</Typography>
                    <Typography variant="caption" color="text.secondary">{item.quantity} x ${item.price?.toFixed(2)}</Typography>
                  </Box>
                  <Typography variant="body2" fontWeight={700} sx={{ color: '#f97316' }}>${(item.price * item.quantity).toFixed(2)}</Typography>
                </Box>
              ))}
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card sx={{ boxShadow: '0 1px 3px rgba(0,0,0,0.08)' }}>
            <CardContent>
              <Typography variant="subtitle1" fontWeight={700} sx={{ mb: 2 }}>Podsumowanie</Typography>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="body2" color="text.secondary">Produkty</Typography>
                <Typography variant="body2">${order.total?.toFixed(2)}</Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="body2" color="text.secondary">Dostawa</Typography>
                <Typography variant="body2" sx={{ color: '#16a34a' }}>Gratis</Typography>
              </Box>
              <Divider sx={{ my: 2 }} />
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="subtitle1" fontWeight={700}>Razem</Typography>
                <Typography variant="h6" sx={{ fontWeight: 800, color: '#f97316' }}>${order.total?.toFixed(2)}</Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

export default OrderDetailPage;
