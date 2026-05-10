import SockJS from 'sockjs-client';
import Stomp from 'stompjs';
import apiClient from './api';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';
const WS_URL = import.meta.env.VITE_WS_URL || (
    API_BASE_URL.startsWith('http') 
        ? API_BASE_URL.replace(/\/api\/?$/, '/ws')
        : `${window.location.origin}${API_BASE_URL.replace(/\/api\/?$/, '/ws')}`
);

class ChatService {
    private stompClient: any = null;
    private subscriptions: Map<string, any> = new Map();
    private messageListeners: Set<(msg: any) => void> = new Set();
    private typingListeners: Set<(typing: any) => void> = new Set();
    private isConnecting: boolean = false;
    private connectedUserId: number | null = null;

    connect(userId: number, onMessage: (msg: any) => void, token?: string, debug: boolean = false, onTyping?: (typing: any) => void) {
        // Add listeners to our sets
        this.messageListeners.add(onMessage);
        if (onTyping) this.typingListeners.add(onTyping);

        // If already connected for this user, don't reconnect
        if (this.stompClient?.connected && this.connectedUserId === userId) {
            console.log('♻️ WebSocket already connected, added new listener.');
            return;
        }

        if (this.isConnecting) return;
        this.isConnecting = true;
        this.connectedUserId = userId;

        // Cleanup old connection if exists
        this.cleanup();

        console.log('🔌 Starting WebSocket connection for user', userId);
        const socket = new SockJS(WS_URL, undefined, { withCredentials: true } as any);
        this.stompClient = Stomp.over(socket);
        
        this.stompClient.debug = (msg: string) => {
            if (debug || msg.includes('CONNECTED') || msg.includes('SUBSCRIBE')) {
                console.log('[STOMP]', msg);
            }
        };

        const headers: any = {};
        if (token) headers.Authorization = `Bearer ${token}`;

        this.stompClient.connect(headers, () => {
            this.isConnecting = false;
            console.log('✅ WebSocket connected successfully for user', userId);

            const topics = [
                { path: `/user/queue/messages`, type: 'message' },
                { path: `/user/${userId}/queue/messages`, type: 'message' },
                { path: `/user/queue/typing`, type: 'typing' },
                { path: `/user/${userId}/queue/typing`, type: 'typing' }
            ];

            topics.forEach((topic) => {
                const sub = this.stompClient.subscribe(topic.path, (sdkEvent: any) => {
                    try {
                        const parsed = JSON.parse(sdkEvent.body);
                        console.log(`📩 [STOMP] Received ${topic.type} from ${topic.path}:`, parsed);
                        
                        if (topic.type === 'message') {
                            this.messageListeners.forEach(listener => listener(parsed));
                        } else {
                            this.typingListeners.forEach(listener => listener(parsed));
                        }
                    } catch (err) {
                        console.error('❌ [STOMP] Parse error:', err, sdkEvent.body);
                    }
                });
                console.log(`📡 [STOMP] Subscribed to ${topic.path}`);
                this.subscriptions.set(topic.path, sub);
            });
        }, (error: any) => {
            this.isConnecting = false;
            console.error('❌ WebSocket connection error details:', error);
            // Retry connection after 5 seconds
            setTimeout(() => this.connect(userId, onMessage, token, debug, onTyping), 5000);
        });
    }

    sendMessage(chatMessage: { senderId: number, senderName: string, receiverId: number, content: string }) {
        if (this.stompClient?.connected) {
            this.stompClient.send("/app/chat.sendMessage", {}, JSON.stringify(chatMessage));
        } else {
            console.error('Cannot send message: Not connected');
        }
    }

    sendTyping(typing: { senderId: number, receiverId: number, isTyping: boolean }) {
        if (this.stompClient?.connected) {
            this.stompClient.send("/app/chat.typing", {}, JSON.stringify(typing));
        }
    }

    async getHistory(userId: number, contactId: number) {
        const response = await apiClient.get(`/chat/history/${userId}/${contactId}`);
        return response.data?.data ?? response.data;
    }

    async getContacts(userId: number) {
        const response = await apiClient.get(`/chat/contacts/${userId}`);
        return response.data?.data ?? response.data;
    }

    private cleanup() {
        if (this.stompClient) {
            try { this.stompClient.disconnect(); } catch (e) {}
        }
        this.subscriptions.clear();
        this.stompClient = null;
    }

    disconnect(onMessage: (msg: any) => void, onTyping?: (typing: any) => void) {
        this.messageListeners.delete(onMessage);
        if (onTyping) this.typingListeners.delete(onTyping);

        // Only actually disconnect if no one is listening anymore
        if (this.messageListeners.size === 0 && this.typingListeners.size === 0) {
            console.log('🔌 All listeners removed, closing WebSocket.');
            this.cleanup();
            this.connectedUserId = null;
        }
    }
}

export const chatService = new ChatService();
