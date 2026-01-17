import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Container,
  Box,
  Paper,
  Typography,
  TextField,
  IconButton,
  Avatar,
  Chip,
  CircularProgress,
  Grid,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Badge,
  Divider,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import {
  Send,
  Chat as ChatIcon,
  SmartToy,
} from '@mui/icons-material';
import { useAuth } from '../contexts/useAuth';
import { chatAPI } from '../services/api';
import { useNavigate } from 'react-router-dom';
import PageHeader from '../components/common/PageHeader';
import Navbar from '../components/common/Navbar';

const Chat = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [conversations, setConversations] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const pollIntervalRef = useRef(null);

  useEffect(() => {
    // Check if user is authenticated
    if (!user) {
      // Redirect to login immediately
      navigate('/login', { replace: true });
      return;
    }

    // Load chat data
    loadData();
    
    // Set up polling for new messages
    pollIntervalRef.current = setInterval(() => {
      loadData();
    }, 3000);

    return () => {
      if (pollIntervalRef.current) {
        clearInterval(pollIntervalRef.current);
      }
    };
  }, [user, navigate, loadData]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const loadData = useCallback(async () => {
    if (!user) return;
    
    try {
      if (user.role === 'patient') {
        const response = await chatAPI.getConversation();
        if (response?.data) {
          setSelectedChat(response.data);
          setMessages(response.data.messages || []);
        }
      } else if (user.role === 'pharmacist' || user.role === 'admin') {
        const response = await chatAPI.getConversations();
        if (response?.data) {
          setConversations(response.data || []);
          setSelectedChat((prevSelected) => {
            if (prevSelected) {
              const updated = response.data.find((c) => c._id === prevSelected._id);
              if (updated) {
                setMessages(updated.messages || []);
                return updated;
              }
            }
            return prevSelected;
          });
        }
      }
    } catch (error) {
      console.error('Error loading chat data:', error);
      // Don't throw error, just log it so the component can still render
    }
  }, [user]);

  const handleSelectChat = async (chat) => {
    setSelectedChat(chat);
    setMessages(chat.messages || []);
    if (chat._id) {
      await chatAPI.markAsRead(chat._id);
    }
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || loading) return;

    const messageText = inputMessage.trim();
    setInputMessage('');
    setLoading(true);

    try {
      await chatAPI.sendMessage({
        chatId: selectedChat?._id,
        message: messageText,
        patientId: user?.role === 'patient' ? undefined : selectedChat?.patientId?._id || selectedChat?.patientId,
      });
      await loadData();
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Show loading state while checking authentication
  if (!user) {
    return (
      <Container maxWidth="lg" sx={{ py: 4, mt: 4, textAlign: 'center' }}>
        <CircularProgress sx={{ mb: 2 }} />
        <Typography>Redirecting to login...</Typography>
      </Container>
    );
  }

  const isPharmacist = user.role === 'pharmacist' || user.role === 'admin';

  return (
    <Container maxWidth="lg" sx={{ py: { xs: 2, md: 4 }, mt: { xs: 2, md: 4 }, px: { xs: 1, sm: 2 } }}>
      <Navbar />
      <PageHeader title="Chat Support" subtitle={isPharmacist ? "Manage patient conversations" : "Get help from our pharmacists"} />

      <Grid container spacing={{ xs: 1, sm: 2, md: 3 }} sx={{ height: { xs: 'calc(100vh - 150px)', md: 'calc(100vh - 200px)' }, minHeight: { xs: 500, md: 600 } }}>
        {/* Conversations List (Pharmacist only) */}
        {isPharmacist && (
          <Grid item xs={12} md={4} sx={{ display: { xs: selectedChat ? 'none' : 'block', md: 'block' } }}>
            <Paper sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              <Box sx={{ p: { xs: 1.5, md: 2 }, borderBottom: 1, borderColor: 'divider' }}>
                <Typography 
                  variant="h6" 
                  sx={{ 
                    fontWeight: 600,
                    fontSize: { xs: '1rem', md: '1.25rem' },
                  }}
                >
                  Conversations
                </Typography>
              </Box>
              <List sx={{ flexGrow: 1, overflowY: 'auto' }}>
                {conversations.length === 0 ? (
                  <Box sx={{ textAlign: 'center', mt: 4 }}>
                    <Typography variant="body2" color="text.secondary">
                      No active conversations
                    </Typography>
                  </Box>
                ) : (
                  conversations.map((chat) => (
                    <ListItem
                      key={chat._id}
                      button
                      selected={selectedChat?._id === chat._id}
                      onClick={() => handleSelectChat(chat)}
                      sx={{
                        '&.Mui-selected': {
                          bgcolor: 'primary.light',
                        },
                      }}
                    >
                      <ListItemAvatar>
                        <Badge
                          badgeContent={chat.unreadCount?.pharmacist || 0}
                          color="error"
                          invisible={!chat.unreadCount?.pharmacist}
                        >
                          <Avatar sx={{ bgcolor: 'primary.main' }}>
                            {chat.patientId?.name?.charAt(0)?.toUpperCase() || 'P'}
                          </Avatar>
                        </Badge>
                      </ListItemAvatar>
                      <ListItemText
                        primary={chat.patientId?.name || 'Patient'}
                        secondary={
                          chat.messages && chat.messages.length > 0
                            ? (chat.messages[chat.messages.length - 1]?.message?.substring(0, 30) || '') + '...'
                            : 'No messages'
                        }
                      />
                    </ListItem>
                  ))
                )}
              </List>
            </Paper>
          </Grid>
        )}

        {/* Chat Window */}
        <Grid item xs={12} md={isPharmacist ? 8 : 12}>
          <Paper sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            {/* Header */}
            <Box
              sx={{
                p: { xs: 1.5, md: 2 },
                borderBottom: 1,
                borderColor: 'divider',
                bgcolor: 'primary.light',
                display: 'flex',
                alignItems: 'center',
                gap: { xs: 1.5, md: 2 },
              }}
            >
              {isPharmacist && (
                <IconButton
                  sx={{ display: { xs: 'block', md: 'none' }, mr: 1 }}
                  onClick={() => setSelectedChat(null)}
                >
                  ←
                </IconButton>
              )}
              <Avatar sx={{ bgcolor: 'primary.main', width: { xs: 36, md: 40 }, height: { xs: 36, md: 40 } }}>
                {isPharmacist
                  ? selectedChat?.patientId?.name?.charAt(0)?.toUpperCase() || 'P'
                  : user?.name?.charAt(0)?.toUpperCase() || 'U'}
              </Avatar>
              <Box sx={{ flex: 1, minWidth: 0 }}>
                <Typography 
                  variant="h6" 
                  sx={{ 
                    fontWeight: 600,
                    fontSize: { xs: '0.95rem', md: '1.25rem' },
                  }}
                >
                  {isPharmacist
                    ? selectedChat?.patientId?.name || 'Select a conversation'
                    : 'Chat Support'}
                </Typography>
                <Typography 
                  variant="caption" 
                  color="text.secondary"
                  sx={{ fontSize: { xs: '0.7rem', md: '0.75rem' } }}
                >
                  {isPharmacist
                    ? selectedChat?.patientId?.email || ''
                    : 'Our team is here to help you'}
                </Typography>
              </Box>
            </Box>

            {/* Messages */}
            <Box
              sx={{
                flexGrow: 1,
                overflowY: 'auto',
                p: { xs: 1, sm: 1.5, md: 2 },
                bgcolor: 'background.default',
              }}
            >
              {!selectedChat && isPharmacist ? (
                <Box sx={{ textAlign: 'center', mt: 8 }}>
                  <ChatIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
                  <Typography variant="h6" color="text.secondary">
                    Select a conversation to start chatting
                  </Typography>
                </Box>
              ) : messages.length === 0 ? (
                <Box sx={{ textAlign: 'center', mt: 8 }}>
                  <ChatIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
                  <Typography variant="body2" color="text.secondary">
                    Start a conversation! Our team is here to help.
                  </Typography>
                </Box>
              ) : (
                messages.map((msg, index) => (
                  <Box
                    key={index}
                    sx={{
                      display: 'flex',
                      justifyContent: msg.senderRole === 'patient' ? 'flex-end' : 'flex-start',
                      mb: 2,
                    }}
                  >
                    <Box
                      sx={{
                        maxWidth: { xs: '85%', sm: '75%', md: '70%' },
                        display: 'flex',
                        flexDirection: msg.senderRole === 'patient' ? 'row-reverse' : 'row',
                        gap: { xs: 0.75, md: 1 },
                        alignItems: 'flex-start',
                      }}
                    >
                      <Avatar
                        sx={{
                          bgcolor: msg.isBot
                            ? 'info.main'
                            : msg.senderRole === 'patient'
                            ? 'primary.main'
                            : 'secondary.main',
                          width: { xs: 32, md: 40 },
                          height: { xs: 32, md: 40 },
                        }}
                      >
                        {msg.isBot ? (
                          <SmartToy sx={{ fontSize: { xs: 18, md: 24 } }} />
                        ) : (
                          (msg.senderName || 'U').charAt(0).toUpperCase()
                        )}
                      </Avatar>
                      <Box sx={{ flex: 1, minWidth: 0 }}>
                        <Chip
                          label={msg.isBot ? 'Jayathura Bot' : (msg.senderName || 'User')}
                          size="small"
                          sx={{
                            mb: 0.5,
                            fontSize: { xs: '0.7rem', md: '0.75rem' },
                            height: { xs: 20, md: 24 },
                            bgcolor: msg.isBot
                              ? 'info.light'
                              : msg.senderRole === 'patient'
                              ? 'primary.light'
                              : 'secondary.light',
                          }}
                        />
                        <Paper
                          elevation={2}
                          sx={{
                            p: { xs: 1.5, md: 2 },
                            bgcolor:
                              msg.senderRole === 'patient'
                                ? 'primary.light'
                                : msg.isBot
                                ? 'info.light'
                                : 'background.paper',
                            borderRadius: 2,
                          }}
                        >
                          <Typography 
                            variant="body1" 
                            sx={{ 
                              wordBreak: 'break-word',
                              fontSize: { xs: '0.85rem', md: '1rem' },
                            }}
                          >
                            {msg.message}
                          </Typography>
                          <Typography
                            variant="caption"
                            sx={{ 
                              display: 'block', 
                              mt: 1, 
                              color: 'text.secondary',
                              fontSize: { xs: '0.65rem', md: '0.75rem' },
                            }}
                          >
                            {msg.timestamp ? new Date(msg.timestamp).toLocaleString() : 'Just now'}
                          </Typography>
                        </Paper>
                      </Box>
                    </Box>
                  </Box>
                ))
              )}
              <div ref={messagesEndRef} />
            </Box>

            {/* Input */}
            <Box
              sx={{
                p: { xs: 1.5, md: 2 },
                borderTop: 1,
                borderColor: 'divider',
                bgcolor: 'background.paper',
                display: 'flex',
                gap: { xs: 0.75, md: 1 },
              }}
            >
              <TextField
                fullWidth
                placeholder="Type your message..."
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                disabled={loading || (!selectedChat && isPharmacist)}
                multiline
                maxRows={isMobile ? 3 : 4}
                size={isMobile ? 'small' : 'medium'}
                sx={{
                  '& .MuiInputBase-root': {
                    fontSize: { xs: '0.9rem', md: '1rem' },
                  },
                }}
              />
              <IconButton
                color="primary"
                onClick={handleSendMessage}
                disabled={loading || !inputMessage.trim() || (!selectedChat && isPharmacist)}
                sx={{ alignSelf: 'flex-end' }}
                size={isMobile ? 'small' : 'medium'}
              >
                {loading ? <CircularProgress size={isMobile ? 20 : 24} /> : <Send sx={{ fontSize: { xs: 20, md: 24 } }} />}
              </IconButton>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Chat;

