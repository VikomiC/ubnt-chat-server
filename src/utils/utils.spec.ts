import { validateNickname } from "./utils";

describe("utils/utils", () => {
    describe("#validateNickname", () => {
        it("should pass on valid nicknames", () => {
            expect(validateNickname("asd")).toBeTruthy();
            expect(validateNickname("ASDasd")).toBeTruthy();
            expect(validateNickname("123ASDasd")).toBeTruthy();
            expect(validateNickname("123 ASD asd")).toBeTruthy();
            expect(validateNickname("123_ASD asd")).toBeTruthy();
            expect(validateNickname("ASD_123 asd")).toBeTruthy();
        });

        it("should fail if nickname is started with space or undescore", () => {
            expect(validateNickname("  myNik  ")).toBeFalsy();
            expect(validateNickname("__myNik__")).toBeFalsy();
        });

        const illegalsChars = "#!@£$%^&*()-=§+|/.,\\\"'`";
        for (const iChar of illegalsChars) {
            it(`should fail on nicknames with ${iChar} symbol`, () => {
                expect(validateNickname(iChar)).toBeFalsy();
            });
        }
    });
});
