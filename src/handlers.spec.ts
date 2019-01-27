import { Server, Socket } from "socket.io";

import { makeHandlers } from "./handlers";
import { NicknameResponse, ResponseType } from "./model/Nickname";

describe("handlers", () => {
    describe("#makeHandlers", () => {
        let serverMock: any;
        let socketMock: any;
        let handlers: any;

        beforeEach(() => {
            serverMock = {
                emit: jest.fn(),
            } as Partial<Socket>;
            socketMock = {
                emit: jest.fn(),
                id: "id",
            } as Partial<Socket>;

            handlers = makeHandlers(serverMock, socketMock);
        });

        describe("#handleNickname", () => {
            it("should response with Error when empty name", () => {
                handlers.handleNickname("");

                const response = new NicknameResponse(
                    ResponseType.Error,
                    "",
                    "You didn't enter a nickname.",
                );
                expect(socketMock.emit).toHaveBeenCalledWith("nickname", response);
            });

            it("should response with Error when short name", () => {
                handlers.handleNickname("ot");

                const response = new NicknameResponse(
                    ResponseType.Error,
                    "ot",
                    "The nickname should be from 3 to 20 symbols.",
                );
                expect(socketMock.emit).toHaveBeenCalledWith("nickname", response);
            });

            it("should response with Error when long name", () => {
                handlers.handleNickname("123456789012345678901");

                const response = new NicknameResponse(
                    ResponseType.Error,
                    "123456789012345678901",
                    "The nickname should be from 3 to 20 symbols.",
                );
                expect(socketMock.emit).toHaveBeenCalledWith("nickname", response);
            });

            it("should response with Error when illegal characters", () => {
                handlers.handleNickname(" InvalidName!@£$ ");

                const response = new NicknameResponse(
                    ResponseType.Error,
                    " InvalidName!@£$ ",
                    "The nickname contains illegal characters.",
                );
                expect(socketMock.emit).toHaveBeenCalledWith("nickname", response);
            });

            it("should response with Error when nickname is taken", () => {
                handlers.handleRegister();
                handlers.handleNickname("GoodNickname");
                socketMock.id = "2";
                handlers.handleRegister();
                handlers.handleNickname("GoodNickname");

                const response = new NicknameResponse(
                    ResponseType.Error,
                    "GoodNickname",
                    "Failed to connect. Nickname already taken.",
                );
                expect(socketMock.emit).toHaveBeenNthCalledWith(2, "nickname", response);

                socketMock.id = "1";
                handlers.handleDisconnect();
                socketMock.id = "2";
                handlers.handleDisconnect();
            });

            it("should response with Success", () => {
                socketMock.id = "1";
                handlers.handleRegister();
                handlers.handleNickname("GoodNickname");

                const response = new NicknameResponse(
                    ResponseType.Success,
                    "GoodNickname",
                );
                expect(socketMock.emit).toHaveBeenCalledWith("nickname", response);

                socketMock.id = "1";
                handlers.handleDisconnect();
            });
        });

    });
});
