import { Injectable } from '@angular/core';
import {
  EMPTY,
  Observable,
  asapScheduler,
  of,
  scheduled,
  throwError,
} from 'rxjs';
import { Socket, io } from 'socket.io-client';
import { LoginService } from './login.service';

@Injectable({
  providedIn: 'root',
})
export class SocketService {
  socket: Socket | null = null;

  constructor(private loginService: LoginService) {
    this.loginService.getLogoutObservable().subscribe(() => {
      if (this.socket) {
        this.socket.disconnect();
        this.socket = null;
      }
    });
  }

  connectToSocketServer() {
    if (this.socket) return scheduled<void>(EMPTY, asapScheduler);
    return new Observable<void>((observer) => {
      this.socket = io('http://localhost:3000');
      this.socket.on('connect', () => {
        observer.next();
        observer.complete();
      });
    });
  }

  joinToRoom(roomId: string) {
    if (!this.socket) return;
    this.socket.volatile.emit('joinRoom', roomId);
  }

  getSocketInstance() {
    return this.socket;
  }

  getUserRooms(callback: (rooms: string[]) => void) {
    if (!this.socket) return;
    this.socket.emit('getUserRooms', callback);
  }
}
