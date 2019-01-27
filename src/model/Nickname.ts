export enum ResponseType {
    Error = "error",
    Success = "success",
}

export class NicknameResponse {
    constructor(
        private type: ResponseType,
        private nickname: string,
        private content?: string,
    ) {}
}
