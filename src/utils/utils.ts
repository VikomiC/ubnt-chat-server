export function validateNickname(nickname: string) {
    const error = "";
    const allowedChars = /^(?:[A-Za-z0-9]+)(?:[A-Za-z0-9 _]*)$/; // allow letters, numbers, spaces and underscores
    return allowedChars.test(nickname);
}
