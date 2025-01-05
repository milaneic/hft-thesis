export declare class PasswordUtils {
    private readonly saltRound;
    hashPassword(passowrd: string): Promise<string>;
    comparePassword(password: string, hash: string): Promise<boolean>;
}
