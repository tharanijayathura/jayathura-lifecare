// client/src/components/chat/ChatWidget.jsx
import React, { useState, useEffect, useRef } from 'react';
import {
  Box,
  Paper,
  Typography,
  TextField,
  IconButton,
  Fab,
  Avatar,
  Chip,
  CircularProgress,
} from '@mui/material';
import {
  Send,
  Close,
  Chat as ChatIcon,
  SmartToy,
} from '@mui/icons-material';
import { useAuth } from '../../contexts/useAuth';
import { chatAPI } from '../../services/api';

const ChatWidget = ({ onOpenFullScreen }) => {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [chatId, setChatId] = useState(null);
  const messagesEndRef = useRef(null);
  const pollIntervalRef = useRef(null);

  useEffect(() => {
    if (isOpen && user) {
      loadConversation();
      // Poll for new messages every 3 seconds
      pollIntervalRef.current = setInterval(() => {
        loadConversation();
      }, 3000);
    } else {
      if (pollIntervalRef.current) {
        clearInterval(pollIntervalRef.current);
      }
    }

    return () => {
      if (pollIntervalRef.current) {
        clearInterval(pollIntervalRef.current);
      }
    };
  }, [isOpen, user]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const loadConversation = async () => {
    try {
      const response = await chatAPI.getConversation();
      if (response.data) {
        setChatId(response.data._id);
        setMessages(response.data.messages || []);
      }
    } catch (error) {
      console.error('Error loading conversation:', error);
    }
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || loading) return;

    const messageText = inputMessage.trim();
    setInputMessage('');
    setLoading(true);

    try {
      await chatAPI.sendMessage({
        chatId,
        message: messageText,
      });
      await loadConversation();
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
    return null;
  }

  return (
    <>
      {/* Chat Button */}
      {!isOpen && (
        <Fab
          color="primary"
          aria-label="chat"
          sx={{
            position: 'fixed',
            bottom: 24,
            right: 24,
            zIndex: 1000,
          }}
          onClick={() => setIsOpen(true)}
        >
          <ChatIcon />
        </Fab>
      )}

      {/* Chat Window */}
      {isOpen && (
        <Paper
          elevation={8}
          sx={{
            position: 'fixed',
            bottom: 24,
            right: 24,
            width: { xs: 'calc(100% - 48px)', sm: 400 },
            height: { xs: 'calc(100% - 100px)', sm: 500 },
            maxHeight: 500,
            display: 'flex',
            flexDirection: 'column',
            zIndex: 1000,
            borderRadius: 3,
            overflow: 'hidden',
          }}
        >
          {/* Header */}
          <Box
            sx={{
              bgcolor: 'primary.main',
              color: 'text.primary',
              p: 2,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <ChatIcon />
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                Chat Support
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', gap: 1 }}>
              {onOpenFullScreen && (
                <IconButton
                  size="small"
                  onClick={onOpenFullScreen}
                  sx={{ color: 'text.primary' }}
                >
                  <ChatIcon fontSize="small" />
                </IconButton>
              )}
              <IconButton
                size="small"
                onClick={() => setIsOpen(false)}
                sx={{ color: 'text.primary' }}
              >
                <Close />
              </IconButton>
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
            {messages.length === 0 ? (
              <Box sx={{ textAlign: 'center', mt: 4 }}>
                <ChatIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
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
                      maxWidth: '75%',
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
                        width: 32,
                        height: 32,
                      }}
                    >
                      {msg.isBot ? (
                        <SmartToy fontSize="small" />
                      ) : (
                        msg.senderName.charAt(0).toUpperCase()
                      )}
                    </Avatar>
                    <Box>
                      <Chip
                        label={msg.isBot ? 'Bot' : msg.senderName}
                        size="small"
                        sx={{
                          mb: 0.5,
                          bgcolor: msg.isBot
                            ? 'info.light'
                            : msg.senderRole === 'patient'
                            ? 'primary.light'
                            : 'secondary.light',
                          fontSize: '0.7rem',
                        }}
                      />
                      <Paper
                        elevation={1}
                        sx={{
                          p: 1.5,
                          bgcolor:
                            msg.senderRole === 'patient'
                              ? 'primary.light'
                              : msg.isBot
                              ? 'info.light'
                              : 'background.paper',
                          borderRadius: 2,
                        }}
                      >
                        <Typography variant="body2" sx={{ wordBreak: 'break-word' }}>
                          {msg.message}
                        </Typography>
                        <Typography
                          variant="caption"
                          sx={{ display: 'block', mt: 0.5, color: 'text.secondary' }}
                        >
                          {new Date(msg.timestamp).toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
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
              size="small"
              placeholder="Type your message..."
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              disabled={loading}
              multiline
              maxRows={3}
            />
            <IconButton
              color="primary"
              onClick={handleSendMessage}
              disabled={loading || !inputMessage.trim()}
            >
              {loading ? <CircularProgress size={20} /> : <Send />}
            </IconButton>
          </Box>
        </Paper>
      )}
    </>
  );
};

export default ChatWidget;

