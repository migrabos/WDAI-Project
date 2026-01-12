import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container,
  Grid,
  Typography,
  Box,
  Button,
  Rating,
  Chip,
  TextField,
  Divider,
  IconButton,
  Card,
  CardContent,
  Avatar,
  CircularProgress,
  Alert,
  Snackbar,
} from '@mui/material';
import { Add, Remove, ShoppingCart, ArrowBack, Edit, Delete } from '@mui/icons-material';
import api from '../services/api';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

const ProductDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { user, isAdmin } = useAuth();

  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);
  const [editingReview, setEditingReview] = useState(null);

  useEffect(() => {
    fetchProduct();
    fetchReviews();
  }, [id]);

  const fetchProduct = async () => {
    try {
      const response = await api.get(`/products/${id}`);
      setProduct(response.data);
    } catch (error) {
      console.error('Error fetching product:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchReviews = async () => {
    try {
      const response = await api.get(`/reviews/product/${id}`);
      setReviews(response.data);
    } catch (error) {
      console.error('Error fetching reviews:', error);
    }
  };

  const handleAddToCart = async () => {
    if (!user) {
      navigate('/login', { state: { from: `/product/${id}` } });
      return;
    }
    const result = await addToCart(product.id, quantity);
    if (result.success) {
      setSnackbar({ open: true, message: 'Dodano do koszyka!', severity: 'success' });
    } else {
      setSnackbar({ open: true, message: result.message, severity: 'error' });
    }
  };

  const handleSubmitReview = async () => {
    if (!user) {
      navigate('/login', { state: { from: `/product/${id}` } });
      return;
    }
    if (!reviewComment.trim()) {
      setSnackbar({ open: true, message: 'Napisz komentarz', severity: 'warning' });
      return;
    }
    setSubmittingReview(true);
    try {
      if (editingReview) {
        await api.put(`/reviews/${editingReview.id}`, { rating: reviewRating, comment: reviewComment });
        setSnackbar({ open: true, message: 'Opinia zaktualizowana!', severity: 'success' });
      } else {
        await api.post('/reviews', { productId: parseInt(id), rating: reviewRating, comment: reviewComment });
        setSnackbar({ open: true, message: 'Opinia dodana!', severity: 'success' });
      }
      setReviewRating(5);
      setReviewComment('');
      setEditingReview(null);
      fetchReviews();
    } catch (error) {
      setSnackbar({ open: true, message: error.response?.data?.message || 'Błąd', severity: 'error' });
    } finally {
      setSubmittingReview(false);
    }
  };

  const handleDeleteReview = async (reviewId) => {
    try {
      await api.delete(`/reviews/${reviewId}`);
      setSnackbar({ open: true, message: 'Opinia usunięta', severity: 'success' });
      fetchReviews();
    } catch (error) {
      setSnackbar({ open: true, message: 'Błąd przy usuwaniu', severity: 'error' });
    }
  };

  const userHasReview = user && reviews.some((r) => r.userId === user.id);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
        <CircularProgress sx={{ color: '#f97316' }} />
      </Box>
    );
  }

  if (!product) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Typography variant="h5">Produkt nie znaleziony</Typography>
        <Button onClick={() => navigate('/')} sx={{ mt: 2 }}>Wróć</Button>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 3 }}>
      <Button startIcon={<ArrowBack />} onClick={() => navigate(-1)} sx={{ mb: 2, color: '#6b7280' }}>
        Wróć
      </Button>

      <Box sx={{ backgroundColor: '#fff', borderRadius: 2, p: 3, boxShadow: '0 1px 3px rgba(0,0,0,0.08)' }}>
        <Grid container spacing={4}>
          <Grid item xs={12} md={5}>
            <Box sx={{ backgroundColor: '#f9fafb', borderRadius: 2, p: 2, display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 300 }}>
              <img src={product.image} alt={product.title} style={{ maxWidth: '100%', maxHeight: 280, objectFit: 'contain' }} />
            </Box>
          </Grid>

          <Grid item xs={12} md={7}>
            <Chip label={product.category} size="small" sx={{ mb: 1, backgroundColor: '#fef3c7', color: '#92400e', textTransform: 'capitalize' }} />
            <Typography variant="h5" sx={{ fontWeight: 700, color: '#1f2937', mb: 1 }}>{product.title}</Typography>
            
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
              <Rating value={product.rating || 0} precision={0.5} readOnly size="small" />
              <Typography variant="body2" color="text.secondary">({product.ratingCount || 0} opinii)</Typography>
            </Box>

            <Typography variant="h4" sx={{ fontWeight: 800, color: '#f97316', mb: 2 }}>${product.price?.toFixed(2)}</Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3, lineHeight: 1.7 }}>{product.description}</Typography>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
              <Typography variant="body2" fontWeight={500}>Dostępność:</Typography>
              {product.stock > 0 ? (
                <Chip label={`${product.stock} szt.`} size="small" sx={{ backgroundColor: '#dcfce7', color: '#166534' }} />
              ) : (
                <Chip label="Brak" size="small" sx={{ backgroundColor: '#fee2e2', color: '#991b1b' }} />
              )}
            </Box>

            {product.stock > 0 && (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', border: '1px solid #e5e7eb', borderRadius: 1 }}>
                  <IconButton size="small" onClick={() => setQuantity(Math.max(1, quantity - 1))} disabled={quantity <= 1}>
                    <Remove fontSize="small" />
                  </IconButton>
                  <Typography sx={{ px: 2, minWidth: 30, textAlign: 'center' }}>{quantity}</Typography>
                  <IconButton size="small" onClick={() => setQuantity(Math.min(product.stock, quantity + 1))} disabled={quantity >= product.stock}>
                    <Add fontSize="small" />
                  </IconButton>
                </Box>
                <Button variant="contained" startIcon={<ShoppingCart />} onClick={handleAddToCart} sx={{ fontWeight: 600 }}>
                  Dodaj do koszyka
                </Button>
              </Box>
            )}
          </Grid>
        </Grid>
      </Box>

      {/* Reviews */}
      <Box sx={{ mt: 4 }}>
        <Typography variant="h6" sx={{ fontWeight: 700, color: '#1f2937', mb: 2 }}>
          Opinie ({reviews.length})
        </Typography>

        {user && !userHasReview && (
          <Card sx={{ mb: 3, boxShadow: '0 1px 3px rgba(0,0,0,0.08)' }}>
            <CardContent>
              <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
                {editingReview ? 'Edytuj opinię' : 'Dodaj opinię'}
              </Typography>
              <Rating value={reviewRating} onChange={(_, v) => setReviewRating(v || 5)} sx={{ mb: 1 }} />
              <TextField
                fullWidth size="small" multiline rows={2}
                placeholder="Twoja opinia..."
                value={reviewComment}
                onChange={(e) => setReviewComment(e.target.value)}
                sx={{ mb: 1 }}
              />
              <Box sx={{ display: 'flex', gap: 1 }}>
                <Button variant="contained" size="small" onClick={handleSubmitReview} disabled={submittingReview}>
                  {submittingReview ? 'Wysyłanie...' : 'Dodaj'}
                </Button>
                {editingReview && (
                  <Button size="small" onClick={() => { setEditingReview(null); setReviewRating(5); setReviewComment(''); }}>
                    Anuluj
                  </Button>
                )}
              </Box>
            </CardContent>
          </Card>
        )}

        {!user && (
          <Alert severity="info" sx={{ mb: 2 }}>
            <Button color="inherit" size="small" onClick={() => navigate('/login')}>Zaloguj się</Button> aby dodać opinię
          </Alert>
        )}

        {reviews.length === 0 ? (
          <Box sx={{ textAlign: 'center', py: 4, backgroundColor: '#fff', borderRadius: 2 }}>
            <Typography color="text.secondary">Brak opinii</Typography>
          </Box>
        ) : (
          <Grid container spacing={2}>
            {reviews.map((review) => (
              <Grid item xs={12} sm={6} key={review.id}>
                <Card sx={{ boxShadow: '0 1px 3px rgba(0,0,0,0.08)' }}>
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5 }}>
                      <Avatar sx={{ width: 32, height: 32, backgroundColor: '#f97316', fontSize: '0.8rem' }}>
                        {review.firstName?.[0]}{review.lastName?.[0]}
                      </Avatar>
                      <Box sx={{ flex: 1 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                          <Typography variant="body2" fontWeight={600}>{review.firstName} {review.lastName}</Typography>
                          {(user?.id === review.userId || isAdmin) && (
                            <Box>
                              {user?.id === review.userId && (
                                <IconButton size="small" onClick={() => { setEditingReview(review); setReviewRating(review.rating); setReviewComment(review.comment); }}>
                                  <Edit sx={{ fontSize: 16 }} />
                                </IconButton>
                              )}
                              <IconButton size="small" onClick={() => handleDeleteReview(review.id)} sx={{ color: '#ef4444' }}>
                                <Delete sx={{ fontSize: 16 }} />
                              </IconButton>
                            </Box>
                          )}
                        </Box>
                        <Rating value={review.rating} size="small" readOnly sx={{ my: 0.5 }} />
                        <Typography variant="body2" color="text.secondary">{review.comment}</Typography>
                        <Typography variant="caption" color="text.secondary">{new Date(review.createdAt).toLocaleDateString('pl-PL')}</Typography>
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </Box>

      <Snackbar open={snackbar.open} autoHideDuration={3000} onClose={() => setSnackbar({ ...snackbar, open: false })}>
        <Alert severity={snackbar.severity}>{snackbar.message}</Alert>
      </Snackbar>
    </Container>
  );
};

export default ProductDetailPage;
