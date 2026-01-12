import { Box, Container, Typography, Link, Grid, IconButton } from '@mui/material';
import { Facebook, Instagram, Twitter, YouTube, Email, Phone, LocationOn } from '@mui/icons-material';

const Footer = () => {
  return (
    <Box
      component="footer"
      sx={{
        py: 4,
        mt: 'auto',
        backgroundColor: '#1f2937',
        color: 'white',
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          {/* Logo & Description */}
          <Grid item xs={12} md={4}>
            <Typography variant="h5" sx={{ fontWeight: 800, color: '#f97316', mb: 2 }}>
              TamTemuExpress
            </Typography>
            <Typography variant="body2" sx={{ color: '#9ca3af', mb: 2, lineHeight: 1.7 }}>
              Twój ulubiony sklep internetowy z najlepszymi produktami w najniższych cenach. 
              Darmowa dostawa, bezpieczne płatności i gwarancja satysfakcji!
            </Typography>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <IconButton size="small" sx={{ color: '#9ca3af', '&:hover': { color: '#f97316' } }}>
                <Facebook />
              </IconButton>
              <IconButton size="small" sx={{ color: '#9ca3af', '&:hover': { color: '#f97316' } }}>
                <Instagram />
              </IconButton>
              <IconButton size="small" sx={{ color: '#9ca3af', '&:hover': { color: '#f97316' } }}>
                <Twitter />
              </IconButton>
              <IconButton size="small" sx={{ color: '#9ca3af', '&:hover': { color: '#f97316' } }}>
                <YouTube />
              </IconButton>
            </Box>
          </Grid>

          {/* Quick Links */}
          <Grid item xs={6} md={2}>
            <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 2 }}>
              Sklep
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <Link href="/" sx={{ color: '#9ca3af', fontSize: '0.875rem', '&:hover': { color: '#f97316' } }}>
                Strona główna
              </Link>
              <Link href="/?category=electronics" sx={{ color: '#9ca3af', fontSize: '0.875rem', '&:hover': { color: '#f97316' } }}>
                Elektronika
              </Link>
              <Link href="/?category=jewelery" sx={{ color: '#9ca3af', fontSize: '0.875rem', '&:hover': { color: '#f97316' } }}>
                Biżuteria
              </Link>
              <Link href="/cart" sx={{ color: '#9ca3af', fontSize: '0.875rem', '&:hover': { color: '#f97316' } }}>
                Koszyk
              </Link>
            </Box>
          </Grid>

          {/* Customer Service */}
          <Grid item xs={6} md={2}>
            <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 2 }}>
              Pomoc
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <Link href="/orders" sx={{ color: '#9ca3af', fontSize: '0.875rem', '&:hover': { color: '#f97316' } }}>
                Moje zamówienia
              </Link>
              <Link href="#" sx={{ color: '#9ca3af', fontSize: '0.875rem', '&:hover': { color: '#f97316' } }}>
                Zwroty
              </Link>
              <Link href="#" sx={{ color: '#9ca3af', fontSize: '0.875rem', '&:hover': { color: '#f97316' } }}>
                FAQ
              </Link>
              <Link href="#" sx={{ color: '#9ca3af', fontSize: '0.875rem', '&:hover': { color: '#f97316' } }}>
                Regulamin
              </Link>
            </Box>
          </Grid>

          {/* Contact */}
          <Grid item xs={12} md={4}>
            <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 2 }}>
              Kontakt
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Email sx={{ fontSize: 18, color: '#f97316' }} />
                <Typography variant="body2" sx={{ color: '#9ca3af' }}>
                  kontakt@tamtemuexpress.pl
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Phone sx={{ fontSize: 18, color: '#f97316' }} />
                <Typography variant="body2" sx={{ color: '#9ca3af' }}>
                  +48 123 456 789
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <LocationOn sx={{ fontSize: 18, color: '#f97316' }} />
                <Typography variant="body2" sx={{ color: '#9ca3af' }}>
                  ul. Kawiory 17, Kraków
                </Typography>
              </Box>
            </Box>
          </Grid>
        </Grid>

        {/* Bottom Bar */}
        <Box sx={{ 
          borderTop: '1px solid #374151', 
          mt: 4, 
          pt: 3,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 2,
        }}>
          <Typography variant="caption" sx={{ color: '#6b7280' }}>
            © 2024 TamTemuExpress - Projekt WDAI. Wszelkie prawa zastrzeżone.
          </Typography>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Typography variant="caption" sx={{ color: '#6b7280' }}>
              🔒 Bezpieczne płatności
            </Typography>
            <Typography variant="caption" sx={{ color: '#6b7280' }}>
              🚚 Darmowa dostawa od 50 zł
            </Typography>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;
