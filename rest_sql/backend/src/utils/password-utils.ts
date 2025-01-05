import * as bcrypt from 'bcrypt';

export class PasswordUtils {
  private readonly saltRound = 10;

  async hashPassword(passowrd: string): Promise<string> {
    // const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(passowrd, this.saltRound);
    return hashedPassword;
  }

  async comparePassword(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
  }
}
