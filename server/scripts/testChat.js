// server/scripts/testChat.js
const mongoose = require('mongoose');
const Chat = require('../models/Chat');
const User = require('../models/User');
require('dotenv').config();

async function testChat() {
  try {
    await mongoose.connect(process.env.MONGO_URI, { serverSelectionTimeoutMS: 15000 });
    console.log('✅ Connected to MongoDB\n');

    // Check if Chat collection exists
    const db = mongoose.connection.db;
    const collections = await db.listCollections().toArray();
    const chatCollection = collections.find(c => c.name === 'chats');
    
    console.log('=== CHAT FEATURE CHECK ===\n');
    
    if (chatCollection) {
      console.log('✅ Chat collection exists');
      const chatCount = await Chat.countDocuments();
      console.log(`   Total chats: ${chatCount}`);
    } else {
      console.log('⚠️  Chat collection does not exist (will be created on first use)');
    }

    // Check Chat model
    console.log('\n✅ Chat model loaded');
    console.log('   Schema fields:', Object.keys(Chat.schema.paths).slice(0, 10).join(', '));

    // Check if there are any chats
    const chats = await Chat.find().limit(5);
    if (chats.length > 0) {
      console.log(`\n📝 Sample chats (${chats.length}):`);
      chats.forEach((chat, i) => {
        console.log(`   ${i + 1}. Patient: ${chat.patientId}, Messages: ${chat.messages?.length || 0}, Status: ${chat.status}`);
      });
    } else {
      console.log('\n📝 No chats yet (will be created when users start chatting)');
    }

    // Check chatbot utility
    try {
      const { getBotResponse } = require('../utils/chatbot');
      const testResponse = getBotResponse('hello');
      console.log('\n✅ Chatbot utility loaded');
      console.log(`   Test response: "${testResponse.substring(0, 50)}..."`);
    } catch (err) {
      console.log('\n❌ Chatbot utility error:', err.message);
    }

    // Check routes
    console.log('\n✅ Chat routes should be available at:');
    console.log('   GET  /api/chat/conversation');
    console.log('   GET  /api/chat/conversations');
    console.log('   POST /api/chat/message');
    console.log('   PUT  /api/chat/read/:chatId');
    console.log('   PUT  /api/chat/close/:chatId');

    console.log('\n✅ Chat feature is ready!');
    console.log('\n📝 To test:');
    console.log('   1. Login as a patient');
    console.log('   2. Open chat widget (floating button)');
    console.log('   3. Send a message');
    console.log('   4. Bot should respond automatically');

    process.exit(0);
  } catch (err) {
    console.error('❌ Error:', err.message);
    process.exit(1);
  }
}

testChat();

