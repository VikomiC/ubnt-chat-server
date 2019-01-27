import { Server, Socket } from "socket.io";

import { Disconnect, DisconnectType } from "./model/Disconnect";
import { Message } from "./model/Message";
import { NicknameResponse, ResponseType } from "./model/Nickname";
import { User } from "./model/User";
import { validateNickname } from "./utils/utils";

/*tslint:disable-next-line:no-var-requires*/
const config = require("./config/config.json");

const activityTime = parseInt(config.activityTime, 10) || 2000;

const nickNames: string[] = [];
const users = new Map<string, User>();

const INACTIVITY_INTERVAL_PERIOD = 1000;

function clearUnusedNickname(nickname: string) {
    nickNames.splice(nickNames.indexOf(nickname), 1);
}

export function handleInactivity(io: Server) {
    function inactivityCheck() {
        if (users.size === 0) {
            return;
        }
        const mostActiveTime = Date.now() - activityTime;
        users.forEach((user: User, key: string) => {
            if (user.nickname && user.latestActivity < mostActiveTime) {
                kickoutInactiveUser(user);
            }
        });
    }

    function kickoutInactiveUser(user: User) {
        const socket = user.socket;
        /*tslint:disable-next-line:no-console*/
        console.log("User kickout: ", socket.id);
        clearUnusedNickname(user.nickname);
        users.delete(socket.id);
        socket.emit("kickout");
        socket.disconnect();
        io.emit("user.disconnect", new Disconnect(DisconnectType.Kickout, user.nickname));
    }

    const inactivityCheckIntervalId = setInterval(inactivityCheck, INACTIVITY_INTERVAL_PERIOD);
}

export function makeHandlers(io: Server, socket: Socket) {

    function handleRegister() {
        users.set(socket.id, new User(socket, Date.now(), null));
    }

    function isNicknameAvailable(nickname: string) {
        const user = users.get(socket.id);
        if (user.nickname === nickname) {
            return true;
        }
        return nickNames.indexOf(nickname) === -1;
    }

    function handleNickname(nickname: string) {
        let response: NicknameResponse;
        if (nickname === "") {
            response = new NicknameResponse(
                ResponseType.Error,
                nickname,
                "You didn't enter a nickname.",
            );
        } else if (nickname.length < 3 || nickname.length > 20) {
            response = new NicknameResponse(
                ResponseType.Error,
                nickname,
                "The nickname should be from 3 to 20 symbols.",
            );
        } else if (!validateNickname(nickname)) {
            response = new NicknameResponse(
                ResponseType.Error,
                nickname,
                "The nickname contains illegal characters.",
            );
        } else if (!isNicknameAvailable(nickname)) {
            response = new NicknameResponse(
                ResponseType.Error,
                nickname,
                "Failed to connect. Nickname already taken.",
            );
        } else {
            const user = users.get(socket.id);
            if (user.nickname) {
                clearUnusedNickname(user.nickname);
            }
            user.nickname = nickname;
            nickNames.push(nickname);
            response = new NicknameResponse(ResponseType.Success, nickname);
        }
        socket.emit("nickname", response);
    }

    function handleMessage(message: Message) {
        const user = users.get(socket.id);
        if (user) {
            user.updateActivity();
            io.emit("message", message);
        }
    }

    function handleDisconnect() {
        const user = users.get(socket.id);
        if (!user) {
            return;
        }
        /*tslint:disable-next-line:no-console*/
        console.log("User left: ", socket.id);
        clearUnusedNickname(user.nickname);
        users.delete(socket.id);
        io.emit("user.disconnect", new Disconnect(DisconnectType.Left, user.nickname));
    }

    return {
        handleDisconnect,
        handleMessage,
        handleNickname,
        handleRegister,
    };
}
