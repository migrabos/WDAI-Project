import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  Button,
  Grid,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Chip,
  Tabs,
  Tab,
  Rating,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  Snackbar,
} from '@mui/material';
import { Delete, ArrowBack, RateReview, People } from '@mui/icons-material';
import api from '../services/api';

const AdminPage = () => {
  const navigate = useNavigate();
  const [tab, setTab] = useState(0);
  const [reviews, setReviews] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteDialog, setDeleteDialog] = useState({ open: false, reviewId: null });
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  useEffect(() => {
    if (tab === 0) fetchReviews();
    else fetchUsers();
  }, [tab]);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const response = await api.get('/admin/reviews');
      setReviews(response.data);
    } catch (error) {
      console.error('Error fetching reviews:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await api.get('/admin/users');
      setUsers(response.data);
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteReview = async () => {
    try {
      await api.delete(`/reviews/${deleteDialog.reviewId}`);
      setSnackbar({ open: true, message: 'Opinia usunięta', severity: 'success' });
      fetchReviews();
    } catch (error) {
      setSnackbar({ open: true, message: 'Błąd', severity: 'error' });
    } finally {
      setDeleteDialog({ open: false, reviewId: null });
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 3 }}>
      <Button startIcon={<ArrowBack />} onClick={() => navigate('/')} sx={{ mb: 2, color: '#6b7280' }}>
        Wróć do sklepu
      </Button>

      <Typography variant="h5" sx={{ fontWeight: 700, color: '#1f2937', mb: 3 }}>
        Panel Administratora
      </Typography>

      <Card sx={{ boxShadow: '0 1px 3px rgba(0,0,0,0.08)' }}>
        <Tabs
          value={tab}
          onChange={(_, v) => setTab(v)}
          sx={{
            borderBottom: '1px solid #e5e7eb',
            '& .MuiTab-root': { textTransform: 'none', fontWeight: 600 },
            '& .Mui-selected': { color: '#f97316' },
            '& .MuiTabs-indicator': { backgroundColor: '#f97316' },
          }}
        >
          <Tab icon={<RateReview />} iconPosition="start" label="Opinie" />
          <Tab icon={<People />} iconPosition="start" label="Użytkownicy" />
        </Tabs>

        <CardContent>
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
              <CircularProgress sx={{ color: '#f97316' }} />
            </Box>
          ) : tab === 0 ? (
            <TableContainer>
              <Table size="small">
                <TableHead>
                  <TableRow sx={{ backgroundColor: '#f9fafb' }}>
                    <TableCell>Produkt</TableCell>
                    <TableCell>Autor</TableCell>
                    <TableCell>Ocena</TableCell>
                    <TableCell>Komentarz</TableCell>
                    <TableCell>Data</TableCell>
                    <TableCell align="right">Akcja</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {reviews.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} align="center" sx={{ py: 4, color: '#6b7280' }}>Brak opinii</TableCell>
                    </TableRow>
                  ) : (
                    reviews.map((r) => (
                      <TableRow key={r.id} hover>
                        <TableCell>
                          <Typography variant="body2" sx={{ maxWidth: 150, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', cursor: 'pointer', '&:hover': { color: '#f97316' } }} onClick={() => navigate(`/product/${r.productId}`)}>
                            {r.productTitle}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2">{r.firstName} {r.lastName}</Typography>
                        </TableCell>
                        <TableCell><Rating value={r.rating} size="small" readOnly /></TableCell>
                        <TableCell>
                          <Typography variant="body2" sx={{ maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{r.comment}</Typography>
                        </TableCell>
                        <TableCell><Typography variant="caption">{new Date(r.createdAt).toLocaleDateString('pl-PL')}</Typography></TableCell>
                        <TableCell align="right">
                          <IconButton size="small" onClick={() => setDeleteDialog({ open: true, reviewId: r.id })} sx={{ color: '#ef4444' }}>
                            <Delete fontSize="small" />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          ) : (
            <TableContainer>
              <Table size="small">
                <TableHead>
                  <TableRow sx={{ backgroundColor: '#f9fafb' }}>
                    <TableCell>ID</TableCell>
                    <TableCell>Imię i nazwisko</TableCell>
                    <TableCell>Email</TableCell>
                    <TableCell>Rola</TableCell>
                    <TableCell>Data rejestracji</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {users.map((u) => (
                    <TableRow key={u.id} hover>
                      <TableCell>{u.id}</TableCell>
                      <TableCell><Typography variant="body2" fontWeight={500}>{u.firstName} {u.lastName}</Typography></TableCell>
                      <TableCell>{u.email}</TableCell>
                      <TableCell>
                        <Chip
                          label={u.role === 'admin' ? 'Admin' : 'Użytkownik'}
                          size="small"
                          sx={{
                            backgroundColor: u.role === 'admin' ? '#fef3c7' : '#f3f4f6',
                            color: u.role === 'admin' ? '#92400e' : '#374151',
                            fontWeight: 500,
                          }}
                        />
                      </TableCell>
                      <TableCell><Typography variant="caption">{new Date(u.createdAt).toLocaleDateString('pl-PL')}</Typography></TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </CardContent>
      </Card>

      <Dialog open={deleteDialog.open} onClose={() => setDeleteDialog({ open: false, reviewId: null })}>
        <DialogTitle>Usuń opinię</DialogTitle>
        <DialogContent><Typography>Czy na pewno chcesz usunąć tę opinię?</Typography></DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialog({ open: false, reviewId: null })}>Anuluj</Button>
          <Button onClick={handleDeleteReview} color="error" variant="contained">Usuń</Button>
        </DialogActions>
      </Dialog>

      <Snackbar open={snackbar.open} autoHideDuration={3000} onClose={() => setSnackbar({ ...snackbar, open: false })}>
        <Alert severity={snackbar.severity}>{snackbar.message}</Alert>
      </Snackbar>
    </Container>
  );
};

export default AdminPage;
