class WebSocketService {
  private socket: WebSocket | null = null;
  private productIds: string[] = [];
  private onMessageCallback: ((data: any) => void) | null = null;

  connect(url: string): void {
    this.socket = new WebSocket(url);

    this.socket.addEventListener('open', () => {
      console.log('WebSocket connected.');
    });

    this.socket.addEventListener('message', (event) => {
      // Handle incoming messages
      const data = JSON.parse(event.data);
      console.log('socket received', data);
      // Call the onMessage callback if provided
      if (this.onMessageCallback) {
        this.onMessageCallback(data);
      }
    });

    this.socket.addEventListener('close', () => {
      console.log('WebSocket closed.');
      // Implement reconnection logic here if needed
    });

    this.socket.addEventListener('error', (error) => {
      console.error('WebSocket error:', error);
      // Additional error handling logic
    });
  }

  disconnect(): void {
    if (this.socket) {
      this.socket.close();
    }
  }

  onMessage(callback: (data: any) => void): void {
    this.onMessageCallback = callback;
  }

  forceError(): void {
    // Force WebSocket feed to throw an error
    if (this.socket) {
      this.socket.dispatchEvent(new Event('error'));
    }
  }

  getProductIds(): string[] {
    return this.productIds;
  }

  subscribe(newProductIds: string[]): void {
    // Unsubscribe from the current feed
    if (this.productIds.length > 0) {
      const unsubscribeMessage = {
        event: 'unsubscribe',
        feed: 'book_ui_1',
        product_ids: this.productIds,
      };
      this.send(JSON.stringify(unsubscribeMessage));
    }

    // Subscribe to the new feed
    const subscribeMessage = {
      event: 'subscribe',
      feed: 'book_ui_1',
      product_ids: newProductIds,
    };
    this.send(JSON.stringify(subscribeMessage));

    // Update the productIds property
    this.productIds = newProductIds;
  }
  
  unsubscribe(): void {
    // Unsubscribe from the current feed
    if (this.productIds.length > 0) {
      const unsubscribeMessage = {
        event: 'unsubscribe',
        feed: 'book_ui_1',
        product_ids: this.productIds,
      };
      this.send(JSON.stringify(unsubscribeMessage));
    }
  }

  private send(message: string): void {
    if (this.socket && this.socket.readyState === WebSocket.OPEN) {
      this.socket.send(message);
    }
  }
}

export default WebSocketService;
