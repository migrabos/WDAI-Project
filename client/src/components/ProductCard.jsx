import { Link } from 'react-router-dom';
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Box,
  Rating,
  Chip,
  IconButton,
} from '@mui/material';
import { AddShoppingCart, Visibility } from '@mui/icons-material';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

const ProductCard = ({ product }) => {
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
    <Card
      component={Link}
      to={`/product/${product.id}`}
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        textDecoration: 'none',
        cursor: 'pointer',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <Box sx={{ position: 'relative' }}>
        <CardMedia
          component="img"
          height="120"
          image={product.image}
          alt={product.title}
          sx={{
            objectFit: 'contain',
            p: 1,
            backgroundColor: '#fff',
          }}
        />
        {user && (
          <IconButton
            size="small"
            onClick={handleAddToCart}
            sx={{
              position: 'absolute',
              top: 4,
              right: 4,
              backgroundColor: '#f97316',
              color: 'white',
              width: 28,
              height: 28,
              '&:hover': {
                backgroundColor: '#ea580c',
              },
            }}
          >
            <AddShoppingCart sx={{ fontSize: 16 }} />
          </IconButton>
        )}
      </Box>
      <CardContent sx={{ flexGrow: 1, p: 1.5, '&:last-child': { pb: 1.5 } }}>
        <Typography
          variant="body2"
          sx={{
            fontWeight: 600,
            mb: 0.5,
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            lineHeight: 1.3,
            fontSize: '0.8rem',
            color: '#1f2937',
          }}
        >
          {product.title}
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 0.5 }}>
          <Rating
            value={product.rating || 0}
            precision={0.5}
            size="small"
            readOnly
            sx={{ fontSize: '0.85rem' }}
          />
          <Typography variant="caption" color="text.secondary">
            ({product.ratingCount || 0})
          </Typography>
        </Box>
        <Typography
          variant="subtitle2"
          sx={{
            fontWeight: 700,
            color: '#f97316',
          }}
        >
          ${product.price?.toFixed(2)}
        </Typography>
      </CardContent>
    </Card>
  );
};

export default ProductCard;
