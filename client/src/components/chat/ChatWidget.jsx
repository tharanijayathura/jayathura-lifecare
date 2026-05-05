// client/src/components/chat/ChatWidget.jsx
import React, { useState, useEffect, useRef } from 'react';
import { chatBotFAQs } from './ChatBotFAQ';
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
  Button,
  Stack,
} from '@mui/material';
import {
  Send,
  Close,
  Chat as ChatIcon,
  SmartToy,
  Login,
  AppRegistration,
  SupportAgent,
} from '@mui/icons-material';
import { useAuth } from '../../contexts/useAuth';
import { chatAPI } from '../../services/api';
import { useNavigate } from 'react-router-dom';

const ChatWidget = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [chatData, setChatData] = useState(null);
  const messagesEndRef = useRef(null);
  const pollIntervalRef = useRef(null);

  const GUEST_WELCOME = {
    id: 'welcome',
    senderRole: 'bot',
    senderName: 'Jayathura Bot',
    message: "👋 Welcome to Jayathura LifeCare! I'm your virtual assistant. How can I help you today? Please select a question below.",
    timestamp: new Date(),
    isBot: true,
  };

  useEffect(() => {
    if (isOpen) {
      if (user) {
        fetchChatHistory();
        if (pollIntervalRef.current) clearInterval(pollIntervalRef.current);
        pollIntervalRef.current = setInterval(fetchChatHistory, 3000);
      } else {
        // Only set guest welcome if no messages yet
        if (messages.length === 0) {
          setMessages([GUEST_WELCOME]);
        }
      }
    } else {
      if (pollIntervalRef.current) clearInterval(pollIntervalRef.current);
    }
    return () => { if (pollIntervalRef.current) clearInterval(pollIntervalRef.current); };
  }, [isOpen, user]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const fetchChatHistory = async () => {
    try {
      const response = await chatAPI.getConversation();
      if (response.data) {
        setChatData(response.data);
        setMessages(response.data.messages || []);
      }
    } catch (error) {
      // For guests, this will 401, which is fine
      if (!user) console.debug('Guest mode: chat history not available');
      else console.error('Chat history fetch error:', error);
    }
  };

  const handleFAQClick = async (faq) => {
    if (!user) {
      // Local Guest Interaction
      const userMsg = { senderRole: 'patient', senderName: 'Guest', message: faq.question, timestamp: new Date() };
      const botMsg = { senderRole: 'bot', senderName: 'Jayathura Bot', message: faq.answer, timestamp: new Date(), isBot: true, showGuestCTA: true };
      setMessages(prev => [...prev, userMsg, botMsg]);
      return;
    }

    // Auth Mode: Send to server
    setLoading(true);
    try {
      await chatAPI.sendMessage({ message: faq.question });
      await fetchChatHistory();
    } catch (error) {
      console.error('FAQ send error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || loading || !user) return;
    const msgText = inputMessage.trim();
    setInputMessage('');
    setLoading(true);
    try {
      await chatAPI.sendMessage({ message: msgText });
      await fetchChatHistory();
    } catch (error) {
      console.error('Send error:', error);
    } finally {
      setLoading(false);
    }
  };

  // Determine if chips should be shown:
  // - Show if user is a guest
  // - Show if user is logged in as a patient AND no pharmacist has sent a message yet
  // - Or just show them always for patients to make it easier
  const showChips = !user || (user.role === 'patient');

  return (
    <>
      {!isOpen && (
        <Fab
          onClick={() => setIsOpen(true)}
          sx={{
            position: 'fixed',
            bottom: 24,
            right: 24,
            bgcolor: '#ABE7B2',
            color: '#2C3E50',
            zIndex: 1000,
            '&:hover': { bgcolor: '#CBF3BB' },
            boxShadow: '0 4px 20px rgba(0,0,0,0.2)'
          }}
        >
          <ChatIcon />
        </Fab>
      )}

      {isOpen && (
        <Paper
          elevation={24}
          sx={{
            position: 'fixed',
            bottom: 24,
            right: 24,
            width: { xs: 'calc(100% - 48px)', sm: 380 },
            height: { xs: 'calc(100% - 100px)', sm: 580 },
            display: 'flex',
            flexDirection: 'column',
            borderRadius: 4,
            overflow: 'hidden',
            zIndex: 2000, // High z-index to be above everything
            border: '1px solid rgba(147, 191, 199, 0.4)',
            boxShadow: '0 12px 48px rgba(0,0,0,0.2)',
          }}
        >
          {/* Header */}
          <Box sx={{ p: 2, bgcolor: '#ECF4E8', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #e2e8f0' }}>
            <Stack direction="row" spacing={1.5} alignItems="center">
              <Avatar sx={{ bgcolor: '#ABE7B2', width: 36, height: 36 }}>
                <SupportAgent sx={{ color: '#2C3E50' }} />
              </Avatar>
              <Box>
                <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#2C3E50', fontSize: '0.9rem' }}>
                  LIFECARE SUPPORT
                </Typography>
                <Typography variant="caption" sx={{ color: '#546E7A', display: 'block' }}>
                  {chatData?.pharmacistId ? 'Pharmacist is Online' : 'Automated Assistant'}
                </Typography>
              </Box>
            </Stack>
            <IconButton size="small" onClick={() => setIsOpen(false)} sx={{ color: '#2C3E50' }}>
              <Close />
            </IconButton>
          </Box>

          {/* Messages Container */}
          <Box sx={{ flexGrow: 1, overflowY: 'auto', p: 2, bgcolor: '#fdfdfd', display: 'flex', flexDirection: 'column', gap: 2 }}>
            {messages.map((msg, idx) => (
              <Box key={idx} sx={{ alignSelf: msg.senderRole === 'patient' ? 'flex-end' : 'flex-start', maxWidth: '85%' }}>
                <Paper
                  elevation={0}
                  sx={{
                    p: 1.5,
                    borderRadius: 3,
                    bgcolor: msg.senderRole === 'patient' ? '#7AA8B0' : '#f1f5f9',
                    color: msg.senderRole === 'patient' ? 'white' : '#1e293b',
                    border: msg.senderRole === 'patient' ? 'none' : '1px solid #e2e8f0',
                  }}
                >
                  <Typography variant="body2" sx={{ lineHeight: 1.6 }}>{msg.message}</Typography>
                  
                  {/* CTA Buttons for Bot messages */}
                  {msg.isBot && (
                    <Stack spacing={1} sx={{ mt: 2 }}>
                      {!user && (
                        <>
                          <Button
                            variant="contained"
                            size="small"
                            fullWidth
                            startIcon={<Login />}
                            onClick={() => navigate('/login')}
                            sx={{ bgcolor: '#1e293b', color: 'white', '&:hover': { bgcolor: '#000' }, textTransform: 'none', borderRadius: 2 }}
                          >
                            Login to Contact Pharmacist
                          </Button>
                          <Button
                            variant="outlined"
                            size="small"
                            fullWidth
                            startIcon={<AppRegistration />}
                            onClick={() => navigate('/register')}
                            sx={{ color: '#1e293b', borderColor: '#1e293b', textTransform: 'none', borderRadius: 2 }}
                          >
                            Register New Account
                          </Button>
                        </>
                      )}
                      
                      {/* For logged in users, the pharmacist will respond via server bot logic */}
                      {user && msg.message.includes('Contact our pharmacist') && (
                        <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 600, fontStyle: 'italic', display: 'block', mt: 1 }}>
                          ℹ️ One of our pharmacists has been notified and will join this chat shortly.
                        </Typography>
                      )}
                    </Stack>
                  )}
                </Paper>
                <Typography variant="caption" sx={{ display: 'block', mt: 0.5, opacity: 0.6, textAlign: msg.senderRole === 'patient' ? 'right' : 'left', fontSize: '0.7rem' }}>
                  {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </Typography>
              </Box>
            ))}
            <div ref={messagesEndRef} />
          </Box>

          {/* Suggested Questions (Chips) */}
          {showChips && (
            <Box sx={{ p: 1.5, bgcolor: '#f8fafc', borderTop: '1px solid #e2e8f0', boxShadow: '0 -2px 10px rgba(0,0,0,0.02)' }}>
              <Typography variant="caption" sx={{ fontWeight: 800, color: '#94a3b8', mb: 1, display: 'block', letterSpacing: 0.5 }}>
                SELECT A QUESTION
              </Typography>
              <Box sx={{ display: 'flex', gap: 1, overflowX: 'auto', pb: 0.5, '&::-webkit-scrollbar': { height: 4, bgcolor: 'transparent' }, '&::-webkit-scrollbar-thumb': { bgcolor: '#e2e8f0', borderRadius: 2 } }}>
                {chatBotFAQs.map((faq) => (
                  <Chip
                    key={faq.id}
                    label={faq.question}
                    onClick={() => handleFAQClick(faq)}
                    sx={{ bgcolor: 'white', border: '1px solid #e2e8f0', fontWeight: 600, fontSize: '0.75rem', '&:hover': { bgcolor: '#ECF4E8', borderColor: '#ABE7B2' }, transition: 'all 0.2s' }}
                  />
                ))}
              </Box>
            </Box>
          )}

          {/* Input Area */}
          <Box sx={{ p: 2, borderTop: '1px solid #e2e8f0', bgcolor: 'white', display: 'flex', gap: 1 }}>
            <TextField
              fullWidth
              size="small"
              placeholder={user ? "Type your question..." : "Select a question above..."}
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              disabled={!user || loading}
              sx={{ '& .MuiOutlinedInput-root': { borderRadius: 4, bgcolor: !user ? '#f8fafc' : 'white' } }}
            />
            <IconButton color="primary" onClick={handleSendMessage} disabled={!user || !inputMessage.trim() || loading}>
              {loading ? <CircularProgress size={24} /> : <Send />}
            </IconButton>
          </Box>
        </Paper>
      )}
    </>
  );
};

export default ChatWidget;
