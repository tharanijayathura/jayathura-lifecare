// client/src/components/pharmacist/ChatDashboard.jsx
import React, { useState, useEffect, useRef } from 'react';
import { 
  Box, 
  Paper, 
  Typography, 
  List, 
  ListItem, 
  ListItemText, 
  ListItemAvatar, 
  Avatar, 
  Chip, 
  Button, 
  TextField, 
  Grid, 
  Divider, 
  Badge,
  CircularProgress,
  IconButton
} from '@mui/material';
import { Send, Refresh, Person, Chat as ChatIcon } from '@mui/icons-material';
import { chatAPI } from '../../services/api';

const ChatDashboard = () => {
  const [conversations, setConversations] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [inputMessage, setInputMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    fetchConversations();
    const interval = setInterval(fetchConversations, 5000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [selectedChat?.messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const fetchConversations = async () => {
    try {
      const response = await chatAPI.getConversations();
      if (response.data) {
        setConversations(response.data);
        if (selectedChat) {
          const updated = response.data.find(c => c._id === selectedChat._id);
          if (updated) setSelectedChat(updated);
        }
      }
    } catch (error) {
      console.error('Error fetching conversations:', error);
    } finally {
      setFetching(false);
    }
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || !selectedChat || loading) return;

    const messageText = inputMessage.trim();
    setInputMessage('');
    setLoading(true);

    try {
      await chatAPI.sendMessage({
        chatId: selectedChat._id,
        message: messageText,
        patientId: selectedChat.patientId._id || selectedChat.patientId
      });
      await fetchConversations();
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

  return (
    <Box sx={{ height: 'calc(100vh - 250px)', minHeight: 600 }}>
      <Grid container spacing={3} sx={{ height: '100%' }}>
        {/* Chat List */}
        <Grid item xs={12} md={4} sx={{ height: '100%' }}>
          <Paper elevation={0} sx={{ height: '100%', display: 'flex', flexDirection: 'column', border: '1px solid rgba(147, 191, 199, 0.25)', borderRadius: 4, overflow: 'hidden' }}>
            <Box sx={{ p: 2, bgcolor: '#f8fafc', borderBottom: '1px solid rgba(147, 191, 199, 0.25)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="h6" sx={{ fontWeight: 800, fontSize: '0.9rem' }}>ACTIVE CONVERSATIONS</Typography>
              <IconButton size="small" onClick={fetchConversations}><Refresh fontSize="small" /></IconButton>
            </Box>
            <List sx={{ flexGrow: 1, overflowY: 'auto', p: 0 }}>
              {fetching && conversations.length === 0 ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}><CircularProgress size={20} /></Box>
              ) : conversations.length === 0 ? (
                <Box sx={{ p: 4, textAlign: 'center' }}>
                  <Typography variant="body2" color="text.secondary">No active patient chats</Typography>
                </Box>
              ) : (
                conversations.map((chat) => (
                  <ListItem
                    key={chat._id}
                    button
                    selected={selectedChat?._id === chat._id}
                    onClick={() => setSelectedChat(chat)}
                    sx={{ 
                      py: 2,
                      borderBottom: '1px solid #f1f5f9',
                      '&.Mui-selected': { bgcolor: '#ECF4E8' }
                    }}
                  >
                    <ListItemAvatar>
                      <Badge badgeContent={chat.unreadCount?.pharmacist || 0} color="error">
                        <Avatar sx={{ bgcolor: '#7AA8B0' }}><Person /></Avatar>
                      </Badge>
                    </ListItemAvatar>
                    <ListItemText
                      primary={<Typography sx={{ fontWeight: 700 }}>{chat.patientId?.name || 'Patient'}</Typography>}
                      secondary={
                        <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', mt: 0.5 }}>
                          {chat.messages?.[chat.messages.length - 1]?.message.substring(0, 30) || 'New conversation'}...
                        </Typography>
                      }
                    />
                  </ListItem>
                ))
              )}
            </List>
          </Paper>
        </Grid>

        {/* Chat Window */}
        <Grid item xs={12} md={8} sx={{ height: '100%' }}>
          <Paper elevation={0} sx={{ height: '100%', display: 'flex', flexDirection: 'column', border: '1px solid rgba(147, 191, 199, 0.25)', borderRadius: 4, overflow: 'hidden' }}>
            {selectedChat ? (
              <>
                <Box sx={{ p: 2, bgcolor: '#f8fafc', borderBottom: '1px solid rgba(147, 191, 199, 0.25)' }}>
                  <Typography sx={{ fontWeight: 800 }}>Chatting with: {selectedChat.patientId?.name}</Typography>
                  <Typography variant="caption" color="text.secondary">{selectedChat.patientId?.email}</Typography>
                </Box>
                
                <Box sx={{ flexGrow: 1, overflowY: 'auto', p: 3, display: 'flex', flexDirection: 'column', gap: 2, bgcolor: '#fdfdfd' }}>
                  {selectedChat.messages?.map((msg, idx) => (
                    <Box
                      key={idx}
                      sx={{
                        alignSelf: msg.senderRole === 'pharmacist' ? 'flex-end' : 'flex-start',
                        maxWidth: '70%',
                      }}
                    >
                      <Paper
                        elevation={0}
                        sx={{
                          p: 1.5,
                          px: 2,
                          borderRadius: 3,
                          bgcolor: msg.senderRole === 'pharmacist' ? '#7AA8B0' : '#f1f5f9',
                          color: msg.senderRole === 'pharmacist' ? 'white' : '#1e293b',
                        }}
                      >
                        <Typography variant="body2">{msg.message}</Typography>
                        <Typography variant="caption" sx={{ display: 'block', mt: 0.5, opacity: 0.8, textAlign: 'right', fontSize: '0.65rem' }}>
                          {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </Typography>
                      </Paper>
                    </Box>
                  ))}
                  <div ref={messagesEndRef} />
                </Box>

                <Box sx={{ p: 2, borderTop: '1px solid rgba(147, 191, 199, 0.25)', display: 'flex', gap: 1 }}>
                  <TextField
                    fullWidth
                    size="small"
                    placeholder="Type professional response..."
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    disabled={loading}
                  />
                  <Button 
                    variant="contained" 
                    onClick={handleSendMessage}
                    disabled={loading || !inputMessage.trim()}
                    sx={{ bgcolor: '#1e293b', '&:hover': { bgcolor: '#000' } }}
                  >
                    {loading ? <CircularProgress size={20} color="inherit" /> : <Send />}
                  </Button>
                </Box>
              </>
            ) : (
              <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: 'text.secondary' }}>
                <ChatIcon sx={{ fontSize: 64, opacity: 0.2, mb: 2 }} />
                <Typography>Select a patient conversation to begin</Typography>
              </Box>
            )}
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default ChatDashboard;
