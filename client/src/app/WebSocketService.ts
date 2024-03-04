import { Injectable } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class WebSocketService {
  private socket: Socket | undefined;

  public connect(url: string): void {
    this.socket = io(url);
  }

  public send(message: any): void {
    this.socket?.emit('message', message);
  }

  public close(): void {
    this.socket?.disconnect();
  }

  public onMessage(): Observable<any> {
    return new Observable(observer => {
      this.socket?.on('message', (message) => observer.next(message));
    });
  }
}
