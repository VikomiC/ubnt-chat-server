import { User } from "./User";

export class Message {
    constructor(private from: User, private content: string) {}
}
