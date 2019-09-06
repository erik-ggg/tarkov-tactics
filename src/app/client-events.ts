// Actions you can take on the App
export enum Action {
    CREATE_ROOM,
    JOINED,
    LEFT,
    RENAME,
    OK,
    ERROR
}

// Socket.io events
export enum Event {
    CONNECT = 'connect',
    CREATE_ROOM = 'cr',
    CURSOR_DATA = 'c_d',
    DISCONNECT = 'disconnect',
    JOINING = 'joining',
    MAP_CHANGE = 'm_c',
    MAP_REQUEST = 'm_r',
    MAP_SENDED = 'm_s',
    RAISE_HOST = 'r_h',
    SUCCESSFUL_JOIN = 's_f'
}
