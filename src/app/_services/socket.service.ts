import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
// import { Message } from '../model/message';
import { Event } from '../client-events';

import * as socketIo from 'socket.io-client';
import { fromEvent } from 'rxjs';

const SERVER_URL = 'http://localhost:3000';

@Injectable()
export class SocketService {
    private socket: SocketIOClient.Socket;

    public initSocket(id: string): void {
        this.socket = socketIo(SERVER_URL);
        this.socket.emit('id', { id: id });
    }

    public sendData(data: any): void {
        console.log('Emiting data: ' + data);
        this.socket.emit('data', data);
    }

    public onData(): Observable<any> {
        return new Observable<Event>(observer => {
            this.socket.on('data', (data: any) => observer.next(data));
        });
    }

    public onEvent(event: Event): Observable<any> {
        return new Observable<Event>(observer => {
            this.socket.on(event, () => observer.next());
        });
    }
}
