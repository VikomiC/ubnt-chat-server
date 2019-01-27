import { Message } from "./Message";
import { User } from "./User";

export class ChatMessage extends Message {
    constructor(from: User, content: string) {
        super(from, content);
    }
}
