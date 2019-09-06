import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
// import { Message } from '../model/message';
import { Event } from '../client-events';
import { Action } from '../client-events'

import * as socketIo from 'socket.io-client';

const SERVER_URL = 'http://localhost:3000';

@Injectable()
export class SocketService {
    private _socket: SocketIOClient.Socket;
    // If client is online it send data to server
    // Only for perfomance purposes
    private _isOnline: boolean;
    private res: Action;

    public initSocket(): void {
        this._socket = socketIo(SERVER_URL);
    }

    public sendData(event: Event, ...args: any): void {
        // console.log("DEBUG. Data ", ...args);
        this._socket.emit(event, ...args);
    }

    public onData(): Observable<any> {
        return new Observable<Event>(observer => {
            this._socket.on('data', (data: any) => observer.next(data));
        });
    }

    public onEvent(event: Event): Observable<any> {
        return new Observable<Event>(observer => {
            this._socket.on(event, (...args: any) => observer.next(...args));
        });
    }

    public sendEvent(event: Event, socketId?: string): void {
        console.log("DEBUG. Sending event:", event)
        switch (event) {
            case Event.DISCONNECT: {
                // this._socket.emit(Event.DISCONNECT);
                this._socket.close();
                this._socket.connect();
                // this._socket.connect();
                break;
            }
            case Event.JOINING: {
                this._socket.emit(Event.JOINING, socketId);
                break;
            }
            default: {
                console.log("Error!! Event %s not recogniced", event);
            }
        }

    }

    get isOnline(): boolean {
        return this._isOnline;
    }

    get socket(): SocketIOClient.Socket {
        return this._socket;
    }

    set isOnline(status: boolean) {
        this._isOnline = status;
    }
}
