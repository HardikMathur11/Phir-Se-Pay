import { Response } from 'express';

export interface SSEEvent {
  event: string;
  data: any;
  timestamp: string;
}

class RealtimeService {
  private clients: Set<Response> = new Set();

  public addClient(res: Response) {
    this.clients.add(res);
    res.on('close', () => {
      this.clients.delete(res);
    });
  }

  public broadcast(event: string, data: any) {
    const sseEvent: SSEEvent = {
      event,
      data,
      timestamp: new Date().toISOString(),
    };

    const payload = `event: ${event}\ndata: ${JSON.stringify(sseEvent)}\n\n`;

    for (const client of this.clients) {
      try {
        client.write(payload);
      } catch {
        this.clients.delete(client);
      }
    }
  }

  public getClientCount(): number {
    return this.clients.size;
  }
}

export const realtimeService = new RealtimeService();
