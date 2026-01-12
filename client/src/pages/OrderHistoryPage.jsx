import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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
} from '@mui/material';
import { ArrowBack, Receipt, ChevronRight } from '@mui/icons-material';
import api from '../services/api';

const OrderHistoryPage = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await api.get('/orders');
      setOrders(response.data);
    } catch (error) {
      console.error('Error fetching orders:', error);
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

  return (
    <Container maxWidth="lg" sx={{ py: 3 }}>
      <Button startIcon={<ArrowBack />} onClick={() => navigate('/')} sx={{ mb: 2, color: '#6b7280' }}>
        Wróć do sklepu
      </Button>

      <Typography variant="h5" sx={{ fontWeight: 700, color: '#1f2937', mb: 3 }}>
        Moje zamówienia
      </Typography>

      {orders.length === 0 ? (
        <Box sx={{ textAlign: 'center', py: 6, backgroundColor: '#fff', borderRadius: 2, boxShadow: '0 1px 3px rgba(0,0,0,0.08)' }}>
          <Receipt sx={{ fontSize: 60, color: '#d1d5db', mb: 2 }} />
          <Typography variant="h6" color="text.secondary" mb={2}>Brak zamówień</Typography>
          <Button variant="contained" onClick={() => navigate('/')}>Przeglądaj produkty</Button>
        </Box>
      ) : (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {orders.map((order) => (
            <Card
              key={order.id}
              sx={{ boxShadow: '0 1px 3px rgba(0,0,0,0.08)', cursor: 'pointer', '&:hover': { borderColor: '#f97316' } }}
              onClick={() => navigate(`/orders/${order.id}`)}
            >
              <CardContent>
                <Grid container alignItems="center" spacing={2}>
                  <Grid item xs={12} sm={3}>
                    <Typography variant="caption" color="text.secondary">Zamówienie</Typography>
                    <Typography variant="subtitle1" fontWeight={700}>#{order.id.toString().padStart(5, '0')}</Typography>
                  </Grid>
                  <Grid item xs={6} sm={2}>
                    <Typography variant="caption" color="text.secondary">Data</Typography>
                    <Typography variant="body2">{new Date(order.createdAt).toLocaleDateString('pl-PL')}</Typography>
                  </Grid>
                  <Grid item xs={6} sm={2}>
                    <Typography variant="caption" color="text.secondary">Produkty</Typography>
                    <Typography variant="body2">{order.itemCount} szt.</Typography>
                  </Grid>
                  <Grid item xs={6} sm={2}>
                    <Typography variant="caption" color="text.secondary">Wartość</Typography>
                    <Typography variant="subtitle1" sx={{ fontWeight: 700, color: '#f97316' }}>${order.total?.toFixed(2)}</Typography>
                  </Grid>
                  <Grid item xs={6} sm={2}>
                    {getStatusChip(order.status)}
                  </Grid>
                  <Grid item xs={12} sm={1} sx={{ textAlign: 'right' }}>
                    <ChevronRight sx={{ color: '#9ca3af' }} />
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          ))}
        </Box>
      )}
    </Container>
  );
};

export default OrderHistoryPage;
