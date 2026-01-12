import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import {
  Container,
  Grid,
  Typography,
  Box,
  Chip,
  TextField,
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Skeleton,
  Button,
  Card,
  CardContent,
  Rating,
  Avatar,
} from '@mui/material';
import { 
  Search, 
  LocalShipping, 
  Verified, 
  CreditCard, 
  Bolt, 
  Star,
  TrendingUp,
  LocalOffer,
} from '@mui/icons-material';
import ProductListItem from '../components/ProductListItem';
import api from '../services/api';

const HomePage = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
  const [sortBy, setSortBy] = useState('');

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [selectedCategory, searchParams]);

  const fetchCategories = async () => {
    try {
      const response = await api.get('/products/categories');
      setCategories(response.data);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (selectedCategory) params.append('category', selectedCategory);
      if (searchParams.get('search')) params.append('search', searchParams.get('search'));
      
      const response = await api.get(`/products?${params.toString()}`);
      let sortedProducts = response.data;

      if (sortBy) {
        sortedProducts = [...sortedProducts].sort((a, b) => {
          switch (sortBy) {
            case 'price-asc': return a.price - b.price;
            case 'price-desc': return b.price - a.price;
            case 'rating': return b.rating - a.rating;
            case 'name': return a.title.localeCompare(b.title);
            default: return 0;
          }
        });
      }
      setProducts(sortedProducts);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (products.length > 0 && sortBy) {
      const sortedProducts = [...products].sort((a, b) => {
        switch (sortBy) {
          case 'price-asc': return a.price - b.price;
          case 'price-desc': return b.price - a.price;
          case 'rating': return b.rating - a.rating;
          case 'name': return a.title.localeCompare(b.title);
          default: return 0;
        }
      });
      setProducts(sortedProducts);
    }
  }, [sortBy]);

  const handleSearch = (e) => {
    if (e.key === 'Enter') {
      if (searchQuery.trim()) {
        setSearchParams({ search: searchQuery.trim() });
      } else {
        setSearchParams({});
      }
    }
  };

  const formatCategory = (category) => {
    return category?.replace("'s clothing", '').replace("'s", '');
  };

  // Mock reviews for testimonials
  const testimonials = [
    { name: 'Anna K.', rating: 5, text: 'Świetna jakość produktów! Polecam każdemu.', avatar: 'A' },
    { name: 'Piotr M.', rating: 5, text: 'Szybka dostawa i super ceny. Będę wracać!', avatar: 'P' },
    { name: 'Kasia W.', rating: 4, text: 'Bardzo zadowolona z zakupów. Produkty zgodne z opisem.', avatar: 'K' },
  ];

  // Featured categories with icons
  const featuredCategories = [
    { name: 'electronics', label: 'Elektronika', icon: <Bolt />, color: '#3b82f6' },
    { name: "men's clothing", label: 'Moda męska', icon: <TrendingUp />, color: '#10b981' },
    { name: "women's clothing", label: 'Moda damska', icon: <Star />, color: '#ec4899' },
    { name: 'jewelery', label: 'Biżuteria', icon: <LocalOffer />, color: '#f59e0b' },
  ];

  return (
    <Box>
      {/* Hero Banner */}
      <Box
        sx={{
          background: 'linear-gradient(135deg, #ff6b35 0%, #f7931e 50%, #ffb347 100%)',
          py: 4,
          mb: 3,
        }}
      >
        <Container maxWidth="lg">
          <Grid container spacing={3} alignItems="center">
            <Grid item xs={12} md={7}>
              <Typography
                variant="h3"
                sx={{ fontWeight: 800, color: 'white', mb: 1, textShadow: '1px 1px 2px rgba(0,0,0,0.1)' }}
              >
                Mega wyprzedaż! 🔥
              </Typography>
              <Typography variant="h6" sx={{ color: 'rgba(255,255,255,0.9)', mb: 2 }}>
                Do -70% na tysiące produktów. Darmowa dostawa od 50 zł!
              </Typography>
              <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                <Chip 
                  label="Darmowa dostawa" 
                  icon={<LocalShipping sx={{ color: 'white !important' }} />}
                  sx={{ backgroundColor: 'rgba(255,255,255,0.2)', color: 'white', fontWeight: 600 }}
                />
                <Chip 
                  label="Gwarancja jakości" 
                  icon={<Verified sx={{ color: 'white !important' }} />}
                  sx={{ backgroundColor: 'rgba(255,255,255,0.2)', color: 'white', fontWeight: 600 }}
                />
                <Chip 
                  label="Bezpieczne płatności" 
                  icon={<CreditCard sx={{ color: 'white !important' }} />}
                  sx={{ backgroundColor: 'rgba(255,255,255,0.2)', color: 'white', fontWeight: 600 }}
                />
              </Box>
            </Grid>
            <Grid item xs={12} md={5}>
              <Box
                sx={{
                  backgroundColor: 'white',
                  borderRadius: 3,
                  p: 3,
                  textAlign: 'center',
                  boxShadow: '0 8px 32px rgba(0,0,0,0.15)',
                }}
              >
                <Typography variant="overline" sx={{ color: '#f97316', fontWeight: 700 }}>
                  Oferta dnia
                </Typography>
                <Typography variant="h4" sx={{ fontWeight: 800, color: '#1f2937', my: 1 }}>
                  -50% na elektronikę
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  Tylko do końca tygodnia!
                </Typography>
                <Button 
                  variant="contained" 
                  size="large"
                  onClick={() => setSelectedCategory('electronics')}
                  sx={{ fontWeight: 700, px: 4 }}
                >
                  Zobacz ofertę
                </Button>
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>


      <Container maxWidth="lg">
        {/* Search & Filters */}
        <Box sx={{ 
          display: 'flex', 
          flexWrap: 'wrap',
          gap: 2, 
          mb: 3,
          alignItems: 'center',
          justifyContent: 'space-between',
          backgroundColor: 'white',
          p: 2,
          borderRadius: 2,
          boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
        }}>
          <TextField
            size="small"
            placeholder="Czego szukasz?"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyPress={handleSearch}
            sx={{ minWidth: 280, backgroundColor: '#f9fafb', borderRadius: 1 }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search sx={{ color: '#9ca3af', fontSize: 20 }} />
                </InputAdornment>
              ),
            }}
          />
          <FormControl size="small" sx={{ minWidth: 140 }}>
            <InputLabel>Sortuj</InputLabel>
            <Select value={sortBy} label="Sortuj" onChange={(e) => setSortBy(e.target.value)}>
              <MenuItem value="">Polecane</MenuItem>
              <MenuItem value="price-asc">Najtańsze</MenuItem>
              <MenuItem value="price-desc">Najdroższe</MenuItem>
              <MenuItem value="rating">Najlepiej oceniane</MenuItem>
            </Select>
          </FormControl>
        </Box>

        {/* Categories */}
        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 3 }}>
          <Chip
            label="Wszystkie"
            size="small"
            onClick={() => setSelectedCategory('')}
            sx={{
              backgroundColor: selectedCategory === '' ? '#f97316' : '#fff',
              color: selectedCategory === '' ? 'white' : '#374151',
              border: '1px solid #e5e7eb',
              fontWeight: 500,
              '&:hover': { backgroundColor: selectedCategory === '' ? '#ea580c' : '#f9fafb' },
            }}
          />
          {categories.map((category) => (
            <Chip
              key={category}
              label={formatCategory(category)}
              size="small"
              onClick={() => setSelectedCategory(category === selectedCategory ? '' : category)}
              sx={{
                textTransform: 'capitalize',
                backgroundColor: selectedCategory === category ? '#f97316' : '#fff',
                color: selectedCategory === category ? 'white' : '#374151',
                border: '1px solid #e5e7eb',
                fontWeight: 500,
                '&:hover': { backgroundColor: selectedCategory === category ? '#ea580c' : '#f9fafb' },
              }}
            />
          ))}
        </Box>

        {/* Results */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="body2" sx={{ color: '#6b7280' }}>
            {loading ? 'Wczytywanie...' : `${products.length} produktów`}
          </Typography>
        </Box>

        {/* Products List */}
        {loading ? (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {[...Array(6)].map((_, i) => (
              <Skeleton key={i} variant="rectangular" height={130} sx={{ borderRadius: 2 }} />
            ))}
          </Box>
        ) : products.length === 0 ? (
          <Box sx={{ textAlign: 'center', py: 8, backgroundColor: '#fff', borderRadius: 2 }}>
            <Typography variant="h6" color="text.secondary">Nie znaleziono produktów</Typography>
          </Box>
        ) : (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {products.map((product) => (
              <ProductListItem key={product.id} product={product} />
            ))}
          </Box>
        )}

        {/* Testimonials Section */}
        <Box sx={{ mt: 6, mb: 4 }}>
          <Typography variant="h6" sx={{ fontWeight: 700, mb: 3, color: '#1f2937', textAlign: 'center' }}>
            Co mówią nasi klienci ⭐
          </Typography>
          <Grid container spacing={2}>
            {testimonials.map((t, index) => (
              <Grid item xs={12} md={4} key={index}>
                <Card sx={{ height: '100%' }}>
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
                      <Avatar sx={{ backgroundColor: '#f97316', width: 40, height: 40 }}>{t.avatar}</Avatar>
                      <Box>
                        <Typography variant="body2" fontWeight={600}>{t.name}</Typography>
                        <Rating value={t.rating} size="small" readOnly />
                      </Box>
                    </Box>
                    <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic' }}>
                      "{t.text}"
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>

        {/* Trust badges */}
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'center', 
          gap: 4, 
          flexWrap: 'wrap',
          py: 4,
          borderTop: '1px solid #e5e7eb',
        }}>
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="h4" sx={{ fontWeight: 800, color: '#f97316' }}>1000+</Typography>
            <Typography variant="body2" color="text.secondary">Produktów</Typography>
          </Box>
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="h4" sx={{ fontWeight: 800, color: '#f97316' }}>50k+</Typography>
            <Typography variant="body2" color="text.secondary">Zadowolonych klientów</Typography>
          </Box>
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="h4" sx={{ fontWeight: 800, color: '#f97316' }}>4.8</Typography>
            <Typography variant="body2" color="text.secondary">Średnia ocena</Typography>
          </Box>
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="h4" sx={{ fontWeight: 800, color: '#f97316' }}>24/7</Typography>
            <Typography variant="body2" color="text.secondary">Wsparcie</Typography>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default HomePage;
