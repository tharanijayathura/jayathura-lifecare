// client/src/components/common/PortalHeader.jsx
// Shared top header used by Patient, Pharmacist, and Admin portals.
// Displays: logo, dashboard title + user name, date badge, and a profile/logout dropdown.
import React, { useState, useEffect } from 'react';
import {
  Box, Stack, Typography, Paper, Avatar, Menu, MenuItem,
  Divider, Container
} from '@mui/material';
import { CalendarToday, KeyboardArrowDown } from '@mui/icons-material';
import { useAuth } from '../../contexts/useAuth';
import { useNavigate } from 'react-router-dom';
import medicalSymbol from '../../assets/medical-symbol.png';
import API from '../../services/api';

// Role-based color palette
const ROLE_COLORS = {
  patient:    { accent: '#10b981', bg: '#eef7f2' },
  pharmacist: { accent: '#6366f1', bg: '#f0f0ff' },
  admin:      { accent: '#f59e0b', bg: '#fffbeb' },
  delivery:   { accent: '#06b6d4', bg: '#ecfeff' },
};

// Fetch latest profile name from the correct API per role
const fetchProfileName = async (role) => {
  try {
    let endpoint = '';
    if (role === 'patient')    endpoint = '/patients/profile';
    if (role === 'pharmacist') endpoint = '/pharmacists/profile';
    if (role === 'admin')      endpoint = '/admin/profile';
    if (!endpoint) return null;
    const res = await API.get(endpoint);
    return res.data?.name || null;
  } catch {
    return null;
  }
};

/**
 * PortalHeader – the top navigation bar shared across all portals.
 *
 * Props:
 *  - title       {string}   – Main heading text (e.g. "Patient Dashboard")
 *  - subtitle    {string}   – Sub-line underneath (optional)
 *  - onLogoClick {function} – Called when logo is clicked
 *  - onProfile   {function} – Called when "Profile" is chosen from the dropdown
 *  - role        {string}   – 'patient' | 'pharmacist' | 'admin' | 'delivery'
 */
const PortalHeader = ({
  title,
  subtitle = 'Manage your health services',
  onLogoClick,
  onProfile,
  role = 'patient',
}) => {
  const { user, logout, updateUser } = useAuth();
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);
  // Live name synced from the DB on mount; falls back to auth context
  const [liveName, setLiveName] = useState('');

  const colors = ROLE_COLORS[role] || ROLE_COLORS.patient;

  // On mount: fetch the latest name from the DB so it always reflects the profile
  useEffect(() => {
    fetchProfileName(role).then((name) => {
      if (name) {
        setLiveName(name);
        // Also keep the auth context in sync so other components are up-to-date
        if (name !== user?.name) {
          updateUser({ name });
        }
      }
    });
    // Re-run whenever the auth user name changes (e.g. after profile save)
  }, [user?.name, role]);

  // Keep liveName in sync whenever updateUser is called from a profile page
  useEffect(() => {
    if (user?.name) setLiveName(user.name);
  }, [user?.name]);

  const handleMenuOpen = (e) => setAnchorEl(e.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);

  const handleLogout = () => {
    handleMenuClose();
    logout();
    navigate('/login');
  };

  const handleProfileClick = () => {
    handleMenuClose();
    if (onProfile) onProfile();
  };

  const fallback = role === 'admin' ? 'Admin' : role === 'pharmacist' ? 'Pharmacist' : role === 'delivery' ? 'Staff' : 'Patient';
  const displayName = liveName || user?.name || fallback;
  const initial = displayName[0]?.toUpperCase() || '?';

  return (
    <Container maxWidth="xl" sx={{ pt: { xs: 3, md: 4 }, pb: { xs: 2, md: 3 } }}>
      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        justifyContent="space-between"
        alignItems={{ xs: 'flex-start', sm: 'center' }}
        spacing={2.5}
      >
        {/* ── Left: Logo + Title ── */}
        <Stack direction="row" spacing={2} alignItems="center">
          {/* Logo button */}
          <Box
            onClick={onLogoClick}
            sx={{
              width: 44,
              height: 44,
              borderRadius: '50%',
              bgcolor: 'white',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
              border: '1px solid rgba(0,0,0,0.05)',
              cursor: onLogoClick ? 'pointer' : 'default',
              transition: 'all 0.2s',
              '&:hover': onLogoClick ? {
                transform: 'scale(1.05)',
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
              } : {},
            }}
          >
            <Box
              component="img"
              src={medicalSymbol}
              alt="Jayathura Healthcare"
              sx={{ width: 32, height: 32, objectFit: 'contain' }}
            />
          </Box>

          {/* Title & subtitle */}
          <Box>
            <Typography
              variant="h6"
              sx={{
                fontWeight: 900,
                color: '#0f172a',
                letterSpacing: '-0.5px',
                fontFamily: "'Inter', sans-serif",
                lineHeight: 1.2,
                fontSize: { xs: '1.05rem', sm: '1.2rem' },
              }}
            >
              {title}:{' '}
              <Box component="span" sx={{ color: colors.accent }}>
                {displayName}
              </Box>
            </Typography>
            <Typography
              variant="body2"
              sx={{
                color: '#64748b',
                fontWeight: 500,
                fontFamily: "'Inter', sans-serif",
                fontSize: { xs: '0.73rem', sm: '0.78rem' },
              }}
            >
              {subtitle}
            </Typography>
          </Box>
        </Stack>

        {/* ── Right: Date badge + User dropdown ── */}
        <Stack
          direction="row"
          spacing={2}
          alignItems="center"
          sx={{ width: { xs: '100%', sm: 'auto' }, justifyContent: { xs: 'space-between', sm: 'flex-end' } }}
        >
          {/* Date badge */}
          <Paper
            variant="outlined"
            sx={{
              py: 1.1, px: 2.2, borderRadius: 4,
              borderColor: 'rgba(0,0,0,0.06)',
              bgcolor: 'white',
              display: 'flex', alignItems: 'center', gap: 1,
              boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
            }}
          >
            <CalendarToday sx={{ color: '#64748b', fontSize: 14 }} />
            <Typography
              variant="caption"
              sx={{
                fontWeight: 800, color: '#64748b', fontSize: '0.72rem',
                textTransform: 'uppercase', fontFamily: "'Inter', sans-serif",
                letterSpacing: '0.5px',
              }}
            >
              {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
            </Typography>
          </Paper>

          {/* User dropdown trigger */}
          <Stack
            direction="row"
            spacing={1}
            alignItems="center"
            onClick={handleMenuOpen}
            sx={{
              cursor: 'pointer',
              p: 0.8, px: 2, borderRadius: 4,
              bgcolor: 'white',
              border: '1px solid rgba(0,0,0,0.06)',
              boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
              transition: 'all 0.2s',
              '&:hover': { bgcolor: '#f8fafc' },
            }}
          >
            <Avatar
              src={user?.image || undefined}
              sx={{
                width: 28, height: 28,
                bgcolor: colors.accent,
                fontSize: '0.78rem', fontWeight: 800,
              }}
            >
              {!user?.image && initial}
            </Avatar>
            <Typography
              sx={{
                fontWeight: 800, color: '#1e293b', fontSize: '0.82rem',
                fontFamily: "'Inter', sans-serif",
              }}
            >
              {displayName}
            </Typography>
            <KeyboardArrowDown sx={{ color: '#64748b', fontSize: 18 }} />
          </Stack>

          {/* Dropdown menu */}
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
            transformOrigin={{ horizontal: 'right', vertical: 'top' }}
            anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
            PaperProps={{
              elevation: 0,
              sx: {
                overflow: 'visible',
                filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.08))',
                border: '1px solid rgba(0,0,0,0.05)',
                mt: 1, borderRadius: 3,
                minWidth: 160,
                '& .MuiMenuItem-root': {
                  fontSize: '0.85rem', fontWeight: 700,
                  fontFamily: "'Inter', sans-serif",
                  py: 1, px: 2, color: '#475569',
                  '&:hover': { bgcolor: '#f1f5f9', color: colors.accent },
                },
              },
            }}
          >
            {/* User info header inside dropdown */}
            <Box sx={{ px: 2, py: 1.5, borderBottom: '1px solid #f1f5f9', mb: 0.5 }}>
              <Typography sx={{ fontWeight: 900, fontSize: '0.85rem', color: '#1e293b', fontFamily: "'Inter', sans-serif" }}>
                {displayName}
              </Typography>
              <Typography sx={{ fontSize: '0.72rem', color: '#94a3b8', fontFamily: "'Inter', sans-serif", fontWeight: 500 }}>
                {user?.email || ''}
              </Typography>
            </Box>

            {onProfile && (
              <MenuItem onClick={handleProfileClick}>👤 Profile</MenuItem>
            )}
            {onProfile && <Divider sx={{ my: 0.5 }} />}
            <MenuItem onClick={handleLogout} sx={{ color: '#ef4444 !important' }}>
              🚪 Logout
            </MenuItem>
          </Menu>
        </Stack>
      </Stack>
    </Container>
  );
};

export default PortalHeader;
