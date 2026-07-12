import fs from "fs";
import path from "path";

export class EnvHelper {
  private static readonly envPath = path.resolve(process.cwd(), ".env");

  static updateEnvVariable(key: string, value: string): void {
    let envContent = fs.readFileSync(this.envPath, "utf8");

    const regex = new RegExp(`^${key}=.*$`, "m");

    if (regex.test(envContent)) {
      envContent = envContent.replace(regex, `${key}=${value}`);
    } else {
      envContent += `\n${key}=${value}`;
    }

    fs.writeFileSync(this.envPath, envContent, "utf8");

    // Keep process.env updated for the current test run
    process.env[key] = value;
  }
}
