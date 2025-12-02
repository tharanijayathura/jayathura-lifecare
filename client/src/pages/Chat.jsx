// client/src/pages/Chat.jsx
import React, { useState, useEffect, useRef } from 'react';
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

const Chat = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [conversations, setConversations] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const pollIntervalRef = useRef(null);

  useEffect(() => {
    if (user) {
      loadData();
      pollIntervalRef.current = setInterval(() => {
        loadData();
      }, 3000);
    }

    return () => {
      if (pollIntervalRef.current) {
        clearInterval(pollIntervalRef.current);
      }
    };
  }, [user]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const loadData = async () => {
    try {
      if (user?.role === 'patient') {
        const response = await chatAPI.getConversation();
        if (response.data) {
          setSelectedChat(response.data);
          setMessages(response.data.messages || []);
        }
      } else if (user?.role === 'pharmacist' || user?.role === 'admin') {
        const response = await chatAPI.getConversations();
        setConversations(response.data || []);
        if (selectedChat) {
          const updated = response.data.find((c) => c._id === selectedChat._id);
          if (updated) {
            setSelectedChat(updated);
            setMessages(updated.messages || []);
          }
        }
      }
    } catch (error) {
      console.error('Error loading data:', error);
    }
  };

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

  if (!user) {
    navigate('/login');
    return null;
  }

  const isPharmacist = user?.role === 'pharmacist' || user?.role === 'admin';

  return (
    <Container maxWidth="lg" sx={{ py: 4, mt: 4 }}>
      <PageHeader title="Chat Support" subtitle={isPharmacist ? "Manage patient conversations" : "Get help from our pharmacists"} />

      <Grid container spacing={3} sx={{ height: 'calc(100vh - 200px)', minHeight: 600 }}>
        {/* Conversations List (Pharmacist only) */}
        {isPharmacist && (
          <Grid item xs={12} md={4}>
            <Paper sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
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
                          chat.messages?.[chat.messages.length - 1]?.message?.substring(0, 30) + '...' ||
                          'No messages'
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
                p: 2,
                borderBottom: 1,
                borderColor: 'divider',
                bgcolor: 'primary.light',
                display: 'flex',
                alignItems: 'center',
                gap: 2,
              }}
            >
              <Avatar sx={{ bgcolor: 'primary.main' }}>
                {isPharmacist
                  ? selectedChat?.patientId?.name?.charAt(0)?.toUpperCase() || 'P'
                  : user?.name?.charAt(0)?.toUpperCase() || 'U'}
              </Avatar>
              <Box>
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  {isPharmacist
                    ? selectedChat?.patientId?.name || 'Select a conversation'
                    : 'Chat Support'}
                </Typography>
                <Typography variant="caption" color="text.secondary">
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
                p: 2,
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
                        maxWidth: '70%',
                        display: 'flex',
                        flexDirection: msg.senderRole === 'patient' ? 'row-reverse' : 'row',
                        gap: 1,
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
                        }}
                      >
                        {msg.isBot ? (
                          <SmartToy />
                        ) : (
                          msg.senderName.charAt(0).toUpperCase()
                        )}
                      </Avatar>
                      <Box>
                        <Chip
                          label={msg.isBot ? 'Jayathura Bot' : msg.senderName}
                          size="small"
                          sx={{
                            mb: 0.5,
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
                            p: 2,
                            bgcolor:
                              msg.senderRole === 'patient'
                                ? 'primary.light'
                                : msg.isBot
                                ? 'info.light'
                                : 'background.paper',
                            borderRadius: 2,
                          }}
                        >
                          <Typography variant="body1" sx={{ wordBreak: 'break-word' }}>
                            {msg.message}
                          </Typography>
                          <Typography
                            variant="caption"
                            sx={{ display: 'block', mt: 1, color: 'text.secondary' }}
                          >
                            {new Date(msg.timestamp).toLocaleString()}
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
                p: 2,
                borderTop: 1,
                borderColor: 'divider',
                bgcolor: 'background.paper',
                display: 'flex',
                gap: 1,
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
                maxRows={4}
              />
              <IconButton
                color="primary"
                onClick={handleSendMessage}
                disabled={loading || !inputMessage.trim() || (!selectedChat && isPharmacist)}
                sx={{ alignSelf: 'flex-end' }}
              >
                {loading ? <CircularProgress size={24} /> : <Send />}
              </IconButton>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Chat;

