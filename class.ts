class AppConfig {
  private static instance: AppConfig;
  private constructor(public apiUrl: string) {}


  //  Singleton pattern (Static method)
  static getInstance() {
    if (!AppConfig.instance) {
      console.log("Creating a new instance");
      AppConfig.instance = new AppConfig("http://localhost:3000");
    }
    console.log("Getting the old instance");
    return AppConfig.instance;
  }


  //  static utility
  static isProduction(): boolean {
    return process.env.NODE_ENV === "production";
  }
  static isDevelopment(): boolean {
    return process.env.NODE_ENV !== "production";
  }
}


const config = AppConfig.getInstance();
if (AppConfig.isDevelopment()) {
  console.log("Development Mode Enabled");
}
