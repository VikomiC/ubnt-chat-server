export enum DisconnectType {
    Kickout = "kickout",
    Left = "left",
}

export class Disconnect {
    constructor(
        private type: DisconnectType,
        private nickname: string,
    ) {}
}
