import * as socketIo from "socket.io";

export class User {
    constructor(
        public socket: socketIo.Socket,
        public latestActivity: number,
        public nickname: string,
    ) {}

    public updateActivity() {
        this.latestActivity = Date.now();
    }
}
