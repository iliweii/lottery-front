// src/utils/websocket.js

export default class WebSocketService {
    static instance = null;
    static reconnectInterval = 3000; // 初始重连间隔（毫秒）
    static maxReconnectAttempts = 50; // 最大重连次数

    reconnectAttempts = 0;

    static getInstance() {
        if (!this.instance) {
            this.instance = new WebSocketService();
        }
        return this.instance;
    }

    ws = null;
    url = this.getWebSocketUrl();
    reconnectTimeout = null;

    getWebSocketUrl() {
        const isDevelopment = process.env.NODE_ENV === 'development';
        if (isDevelopment) {
            return 'ws://192.168.199.149:8081/api/ws'; // 确保这里是正确的 URL
        }

        const {protocol, host} = window.location;
        const wsProtocol = protocol === 'https:' ? 'wss:' : 'ws:';
        return `${wsProtocol}//${host}/api/ws`;
    }

    connect() {
        console.log("尝试连接到 WebSocket 服务器...");
        if (!this.ws) {
            this.ws = new WebSocket(this.url);

            this.ws.onopen = () => {
                console.log("WebSocket 连接已成功建立。");
                this.resetReconnect();
                this.reconnectAttempts = 0; // 重置重连尝试次数
                console.log("重连尝试次数已重置为 0。");
            };

            this.ws.onmessage = (message) => {
                console.log("接收到消息:", message.data);
                this.handleMessage(message.data);
            };

            this.ws.onerror = (error) => {
                console.error("WebSocket 发生错误:", error);
                console.log("错误详情:", error.message);
            };

            this.ws.onclose = (event) => {
                console.log(`WebSocket 连接关闭，关闭代码: ${event.code}，原因: ${event.reason || '无'}`);
                this.reconnect();
            };
        }
    }

    reconnect() {
        if (this.reconnectAttempts < WebSocketService.maxReconnectAttempts) {
            const timeout = WebSocketService.reconnectInterval * Math.pow(2, this.reconnectAttempts); // 指数回退策略
            console.log(`WebSocket 连接关闭，尝试在 ${timeout} 毫秒后重新连接...`);
            this.reconnectTimeout = setTimeout(() => {
                this.reconnectAttempts++;
                console.log(`重连尝试次数: ${this.reconnectAttempts}`);
                this.ws = null;
                this.connect();
            }, timeout);
        } else {
            console.error("已达到最大重连次数，放弃重连。");
        }
    }

    resetReconnect() {
        if (this.reconnectTimeout) {
            console.log("清除重连定时器...");
            clearTimeout(this.reconnectTimeout);
            this.reconnectTimeout = null;
        }
    }

    handleMessage(data) {
        const event = new CustomEvent("websocketMessage", { detail: data });
        window.dispatchEvent(event);
        // console.log("触发全局事件 'websocketMessage'，消息内容:", data);
    }

    sendMessage(msg) {
        if (this.ws && this.ws.readyState === WebSocket.OPEN) {
            this.ws.send(msg);
            console.log("发送消息:", msg);
        } else {
            console.error("WebSocket 连接未打开，无法发送消息。");
        }
    }

    close() {
        if (this.ws) {
            this.ws.close();
            console.log("关闭 WebSocket 连接...");
        }
    }
}
