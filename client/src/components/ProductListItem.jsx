import { Link } from 'react-router-dom';
import {
  Box,
  Typography,
  Rating,
  Chip,
  IconButton,
  Button,
} from '@mui/material';
import { AddShoppingCart } from '@mui/icons-material';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

const ProductListItem = ({ product }) => {
  const { addToCart } = useCart();
  const { user } = useAuth();

  const handleAddToCart = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (user) {
      await addToCart(product.id, 1);
    }
  };

  return (
    <Box
      component={Link}
      to={`/product/${product.id}`}
      sx={{
        display: 'flex',
        gap: 2,
        p: 2,
        backgroundColor: '#fff',
        borderRadius: 2,
        textDecoration: 'none',
        boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
        transition: 'all 0.2s',
        '&:hover': {
          boxShadow: '0 4px 12px rgba(249, 115, 22, 0.15)',
          borderColor: '#f97316',
        },
        border: '1px solid #e5e7eb',
      }}
    >
      {/* Image */}
      <Box
        sx={{
          width: 120,
          height: 120,
          flexShrink: 0,
          backgroundColor: '#f9fafb',
          borderRadius: 1,
          p: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <img
          src={product.image}
          alt={product.title}
          style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }}
        />
      </Box>

      {/* Content */}
      <Box sx={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
        <Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
            <Chip
              label={product.category?.replace("'s clothing", '').replace("'s", '')}
              size="small"
              sx={{ 
                backgroundColor: '#fef3c7', 
                color: '#92400e', 
                textTransform: 'capitalize',
                fontSize: '0.7rem',
                height: 20,
              }}
            />
            {product.stock <= 5 && product.stock > 0 && (
              <Chip label={`Tylko ${product.stock} szt.`} size="small" sx={{ backgroundColor: '#fee2e2', color: '#991b1b', fontSize: '0.7rem', height: 20 }} />
            )}
          </Box>
          <Typography
            variant="body1"
            sx={{
              fontWeight: 600,
              color: '#1f2937',
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
              lineHeight: 1.4,
              mb: 0.5,
            }}
          >
            {product.title}
          </Typography>
          <Typography
            variant="body2"
            sx={{
              color: '#6b7280',
              display: '-webkit-box',
              WebkitLineClamp: 1,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
            }}
          >
            {product.description}
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Rating value={product.rating || 0} precision={0.5} size="small" readOnly />
          <Typography variant="caption" color="text.secondary">({product.ratingCount || 0})</Typography>
        </Box>
      </Box>

      {/* Price & Action */}
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', justifyContent: 'space-between', minWidth: 100 }}>
        <Typography variant="h6" sx={{ fontWeight: 800, color: '#f97316' }}>
          ${product.price?.toFixed(2)}
        </Typography>
        {user && (
          <Button
            variant="contained"
            size="small"
            startIcon={<AddShoppingCart sx={{ fontSize: 16 }} />}
            onClick={handleAddToCart}
            sx={{ fontSize: '0.75rem' }}
          >
            Dodaj
          </Button>
        )}
      </Box>
    </Box>
  );
};

export default ProductListItem;
