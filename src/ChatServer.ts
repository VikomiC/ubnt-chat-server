import * as express from "express";
import { createServer, Server } from "http";
import * as socketIo from "socket.io";

import { handleInactivity, makeHandlers } from "./handlers";
import { Message } from "./model/Message";

export class ChatServer {
    public static readonly PORT: number = 4000;

    private app: express.Application;
    private server: Server;
    private io: SocketIO.Server;
    private port: string | number;

    constructor() {
        this.createApp();
        this.config();
        this.createServer();
        this.sockets();
        this.listen();
    }

    public getApp(): express.Application {
        return this.app;
    }

    private createApp(): void {
        this.app = express();
    }

    private createServer(): void {
        this.server = createServer(this.app);
    }

    private config(): void {
        this.port = process.env.PORT || ChatServer.PORT;
    }

    private sockets(): void {
        this.io = socketIo(this.server);
    }

    private listen(): void {
        this.server.listen(this.port, () => {
            /*tslint:disable-next-line:no-console*/
            console.log("Running server on port %s", this.port);
        });

        handleInactivity(this.io);

        this.io.on("connect", (socket: socketIo.Socket) => {
            /*tslint:disable-next-line:no-console*/
            console.log("Connected client on port %s.", this.port);

            const {
                handleRegister,
                handleNickname,
                handleMessage,
                handleDisconnect,
            } = makeHandlers(this.io, socket);

            /*tslint:disable-next-line:no-console*/
            console.log("Client registered with id: ", socket.id);
            handleRegister();

            socket.on("nickname", (nickname: any) => {
                /*tslint:disable-next-line:no-console*/
                console.log("nickname", nickname);
                handleNickname(nickname);
            });

            socket.on("message", (message: Message) => {
                /*tslint:disable-next-line:no-console*/
                console.log("(Received message): %s", JSON.stringify(message));
                handleMessage(message);
            });

            socket.on("disconnect", () => {
                /*tslint:disable-next-line:no-console*/
                console.log("Client disconnected with id: ", socket.id);
                handleDisconnect();
            });
        });
    }
}
