import SockJS from 'sockjs-client';
import Stomp from 'stompjs';
import apiClient from './api';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';
const WS_URL = import.meta.env.VITE_WS_URL || API_BASE_URL.replace(/\/api\/?$/, '/ws');

class ChatService {
    private stompClient: any = null;
    private subscriptions: Map<string, any> = new Map();

    connect(userId: number, onMessageReceived: (message: any) => void, token?: string, debug: boolean = false, onTypingReceived?: (typing: any) => void) {
        const socket = new SockJS(WS_URL, undefined, { withCredentials: true } as any);
        this.stompClient = Stomp.over(socket);
        this.stompClient.debug = debug ? console.log.bind(console) : () => {}; // optionally enable debug logs

        const headers: any = {};
        if (token) headers.Authorization = `Bearer ${token}`;

        this.stompClient.connect(headers, () => {
            if (debug) console.log('WebSocket connected for user', userId);

            // Subscribe to possible broker destinations to maximize compatibility.
            const topics = [
                { path: `/user/queue/messages`, callback: onMessageReceived },
                { path: `/user/${userId}/queue/messages`, callback: onMessageReceived },
                { path: `/user/queue/typing`, callback: onTypingReceived },
                { path: `/user/${userId}/queue/typing`, callback: onTypingReceived }
            ];

            topics.forEach((topic) => {
                if (topic.callback) {
                    try {
                        if (!this.subscriptions.has(topic.path)) {
                            const sub = this.stompClient.subscribe(topic.path, (sdkEvent: any) => {
                                try {
                                    const parsed = JSON.parse(sdkEvent.body);
                                    if (debug) console.log('WS message', topic.path, parsed);
                                    topic.callback!(parsed);
                                } catch (err) {
                                    if (debug) console.error('Failed to parse WS message', err, sdkEvent.body);
                                }
                            });
                            this.subscriptions.set(topic.path, sub);
                        }
                    } catch (e) {
                        if (debug) console.error('Subscribe error for topic', topic.path, e);
                    }
                }
            });
        }, (error: any) => {
            console.error('WebSocket connection error:', error);
            // Retry connection after 5 seconds
            setTimeout(() => this.connect(userId, onMessageReceived, token, debug, onTypingReceived), 5000);
        });
    }

    sendMessage(chatMessage: { senderId: number, senderName: string, receiverId: number, content: string }) {
        if (this.stompClient && this.stompClient.connected) {
            this.stompClient.send("/app/chat.sendMessage", {}, JSON.stringify(chatMessage));
        } else {
            console.error('Cannot send message: Not connected');
        }
    }

    sendTyping(typing: { senderId: number, receiverId: number, isTyping: boolean }) {
        if (this.stompClient && this.stompClient.connected) {
            this.stompClient.send("/app/chat.typing", {}, JSON.stringify(typing));
        }
    }

    async getHistory(userId: number, contactId: number) {
        const response = await apiClient.get(`/chat/history/${userId}/${contactId}`);
        // Backend may return { data: [...] } or [...] — normalize to array
        return response.data?.data ?? response.data;
    }

    async getContacts(userId: number) {
        const response = await apiClient.get(`/chat/contacts/${userId}`);
        // Normalize contacts list
        return response.data?.data ?? response.data;
    }

    disconnect() {
        if (this.stompClient) {
            this.stompClient.disconnect();
        }
        this.subscriptions.clear();
    }
}

export const chatService = new ChatService();
