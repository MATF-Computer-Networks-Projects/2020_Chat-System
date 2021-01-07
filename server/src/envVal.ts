import dotenv from 'dotenv';

dotenv.config();

export interface EnvValType {
  serverPort: string;
}

const loadEnvVars = (): EnvValType => {
  if(
    !process.env.SERVER_PORT
    ) {
      throw new Error('Invalid .env file, some values are undefined, please check .env.example to see what you are missing');
  }

  return {
    serverPort: process.env.SERVER_PORT,
  }
}

export const envVal = loadEnvVars();

