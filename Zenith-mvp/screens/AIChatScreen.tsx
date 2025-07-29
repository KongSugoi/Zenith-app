import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  Image,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useRoute } from '@react-navigation/native';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'ai';
  timestamp: Date;
  type?: 'text' | 'voice';
}

export default function AIChatScreen() {
  const route = useRoute();
  const { contactId, contactName, contactRole, contactAvatar } = route.params as any;
  
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: `Xin chào! Tôi là ${contactName}. Hôm nay bạn cảm thấy thế nào?`,
      sender: 'ai',
      timestamp: new Date(Date.now() - 60000),
    },
  ]);
  
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const scrollViewRef = useRef<ScrollView>(null);

  useEffect(() => {
    // Auto scroll to bottom when new messages arrive
    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 100);
  }, [messages]);

  const sendMessage = () => {
    if (!inputText.trim()) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      text: inputText.trim(),
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, newMessage]);
    setInputText('');
    
    // Simulate AI response
    setIsTyping(true);
    setTimeout(() => {
      const aiResponse = generateAIResponse(inputText.trim(), contactRole);
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: aiResponse,
        sender: 'ai',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, aiMessage]);
      setIsTyping(false);
    }, 1500);
  };

  const generateAIResponse = (userMessage: string, role: string): string => {
    const lowerMessage = userMessage.toLowerCase();
    
    if (role === 'Bác sĩ tim mạch') {
      if (lowerMessage.includes('nhịp tim') || lowerMessage.includes('tim')) {
        return 'Nhịp tim bình thường của người lớn tuổi là 60-100 nhịp/phút. Nếu có bất thường, hãy đo định kỳ và ghi chép lại để theo dõi.';
      }
      if (lowerMessage.includes('huyết áp')) {
        return 'Huyết áp lý tưởng là dưới 120/80 mmHg. Với người cao tuổi, cần kiểm soát chế độ ăn ít muối và tập thể dục nhẹ nhàng.';
      }
      if (lowerMessage.includes('thuốc')) {
        return 'Nhớ uống thuốc đúng giờ như bác sĩ kê đơn. Nếu có tác dụng phụ, hãy liên hệ với tôi ngay.';
      }
    } else if (role === 'Y tá') {
      if (lowerMessage.includes('đau') || lowerMessage.includes('khó chịu')) {
        return 'Tôi hiểu bạn đang cảm thấy không thoải mái. Hãy mô tả cụ thể hơn về cảm giác đau để tôi có thể tư vấn phù hợp.';
      }
      if (lowerMessage.includes('ăn') || lowerMessage.includes('dinh dưỡng')) {
        return 'Chế độ ăn cân bằng rất quan trọng. Hãy ăn nhiều rau xanh, trái cây và uống đủ nước nhé.';
      }
    } else if (role.includes('Con') || role.includes('con')) {
      if (lowerMessage.includes('nhớ') || lowerMessage.includes('yêu')) {
        return 'Con rất yêu và nhớ ba/mẹ. Hãy chăm sóc sức khỏe thật tốt để con yên tâm nhé!';
      }
      if (lowerMessage.includes('sức khỏe')) {
        return 'Ba/mẹ có theo dõi sức khỏe đều đặn không? Con luôn lo lắng và muốn ba/mẹ khỏe mạnh.';
      }
    }

    // Default responses
    const defaultResponses = [
      'Cảm ơn bạn đã chia sẻ. Tôi đang lắng nghe và sẵn sàng hỗ trợ.',
      'Điều đó rất quan trọng. Bạn có muốn tôi tư vấn thêm về vấn đề này không?',
      'Tôi hiểu. Hãy theo dõi và ghi chép lại để có thể đánh giá tốt hơn.',
      'Đó là thông tin hữu ích. Bạn còn câu hỏi nào khác không?',
    ];

    return defaultResponses[Math.floor(Math.random() * defaultResponses.length)];
  };

  const startVoiceRecording = () => {
    setIsRecording(true);
    Alert.alert(
      'Ghi âm',
      'Tính năng ghi âm đang được phát triển. Hiện tại vui lòng sử dụng tin nhắn văn bản.',
      [
        { text: 'OK', onPress: () => setIsRecording(false) }
      ]
    );
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('vi-VN', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoid}
      >
        {/* Chat Header */}
        <View style={styles.chatHeader}>
          <View style={styles.contactInfo}>
            <Image source={{ uri: contactAvatar }} style={styles.headerAvatar} />
            <View>
              <Text style={styles.headerName}>{contactName}</Text>
              <Text style={styles.headerRole}>{contactRole}</Text>
            </View>
          </View>
          <View style={styles.headerActions}>
            <TouchableOpacity style={styles.headerButton}>
              <Icon name="videocam" size={24} color="#1e40af" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.headerButton}>
              <Icon name="call" size={24} color="#1e40af" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Messages */}
        <ScrollView
          ref={scrollViewRef}
          style={styles.messagesContainer}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.messagesContent}
        >
          {messages.map((message) => (
            <View
              key={message.id}
              style={[
                styles.messageWrapper,
                message.sender === 'user' ? styles.userMessageWrapper : styles.aiMessageWrapper,
              ]}
            >
              {message.sender === 'ai' && (
                <Image source={{ uri: contactAvatar }} style={styles.messageAvatar} />
              )}
              <View
                style={[
                  styles.messageBubble,
                  message.sender === 'user' ? styles.userMessage : styles.aiMessage,
                ]}
              >
                <Text
                  style={[
                    styles.messageText,
                    message.sender === 'user' ? styles.userMessageText : styles.aiMessageText,
                  ]}
                >
                  {message.text}
                </Text>
                <Text
                  style={[
                    styles.messageTime,
                    message.sender === 'user' ? styles.userMessageTime : styles.aiMessageTime,
                  ]}
                >
                  {formatTime(message.timestamp)}
                </Text>
              </View>
            </View>
          ))}

          {/* Typing Indicator */}
          {isTyping && (
            <View style={[styles.messageWrapper, styles.aiMessageWrapper]}>
              <Image source={{ uri: contactAvatar }} style={styles.messageAvatar} />
              <View style={[styles.messageBubble, styles.aiMessage]}>
                <View style={styles.typingIndicator}>
                  <View style={styles.typingDot} />
                  <View style={styles.typingDot} />
                  <View style={styles.typingDot} />
                </View>
              </View>
            </View>
          )}
        </ScrollView>

        {/* Input Area */}
        <View style={styles.inputContainer}>
          <View style={styles.inputWrapper}>
            <TextInput
              style={styles.textInput}
              placeholder="Nhập tin nhắn..."
              value={inputText}
              onChangeText={setInputText}
              multiline
              maxLength={500}
            />
            <View style={styles.inputActions}>
              <TouchableOpacity
                style={styles.voiceButton}
                onPress={startVoiceRecording}
              >
                <Icon
                  name={isRecording ? 'stop' : 'mic'}
                  size={20}
                  color={isRecording ? '#ef4444' : '#6b7280'}
                />
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.sendButton,
                  inputText.trim() ? styles.sendButtonActive : styles.sendButtonInactive,
                ]}
                onPress={sendMessage}
                disabled={!inputText.trim()}
              >
                <Icon
                  name="send"
                  size={20}
                  color={inputText.trim() ? '#ffffff' : '#6b7280'}
                />
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Quick Suggestions */}
        <View style={styles.suggestionsContainer}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {[
              'Hôm nay tôi cảm thấy khỏe',
              'Nhịp tim hôm nay như thế nào?',
              'Tôi cần lời khuyên về thuốc',
              'Cảm ơn bạn',
            ].map((suggestion, index) => (
              <TouchableOpacity
                key={index}
                style={styles.suggestionChip}
                onPress={() => setInputText(suggestion)}
              >
                <Text style={styles.suggestionText}>{suggestion}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  keyboardAvoid: {
    flex: 1,
  },
  chatHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#ffffff',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  contactInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  headerAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  headerName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
  },
  headerRole: {
    fontSize: 12,
    color: '#6b7280',
  },
  headerActions: {
    flexDirection: 'row',
    gap: 8,
  },
  headerButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f3f4f6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  messagesContainer: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  messagesContent: {
    padding: 16,
    paddingBottom: 8,
  },
  messageWrapper: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  userMessageWrapper: {
    justifyContent: 'flex-end',
  },
  aiMessageWrapper: {
    justifyContent: 'flex-start',
  },
  messageAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginRight: 8,
    marginTop: 4,
  },
  messageBubble: {
    maxWidth: '75%',
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  userMessage: {
    backgroundColor: '#1e40af',
    borderBottomRightRadius: 4,
  },
  aiMessage: {
    backgroundColor: '#ffffff',
    borderBottomLeftRadius: 4,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  messageText: {
    fontSize: 16,
    lineHeight: 22,
    marginBottom: 4,
  },
  userMessageText: {
    color: '#ffffff',
  },
  aiMessageText: {
    color: '#1f2937',
  },
  messageTime: {
    fontSize: 12,
    alignSelf: 'flex-end',
  },
  userMessageTime: {
    color: 'rgba(255, 255, 255, 0.7)',
  },
  aiMessageTime: {
    color: '#6b7280',
  },
  typingIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingVertical: 4,
  },
  typingDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#6b7280',
    opacity: 0.6,
  },
  inputContainer: {
    backgroundColor: '#ffffff',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    backgroundColor: '#f9fafb',
    borderRadius: 24,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    paddingHorizontal: 16,
    paddingVertical: 8,
    minHeight: 48,
  },
  textInput: {
    flex: 1,
    fontSize: 16,
    color: '#1f2937',
    maxHeight: 100,
    paddingVertical: 8,
  },
  inputActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginLeft: 8,
  },
  voiceButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendButtonActive: {
    backgroundColor: '#1e40af',
  },
  sendButtonInactive: {
    backgroundColor: 'transparent',
  },
  suggestionsContainer: {
    backgroundColor: '#ffffff',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderTopWidth: 1,
    borderTopColor: '#f3f4f6',
  },
  suggestionChip: {
    backgroundColor: '#f3f4f6',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 16,
    marginRight: 8,
  },
  suggestionText: {
    fontSize: 14,
    color: '#374151',
  },
});