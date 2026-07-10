import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '..', '.env') });

export type Environment = 'dev' | 'staging' | 'pro';

interface EnvConfig {
  // Domain của app (dùng làm baseURL cho playwright.config.ts)
  baseURL: string;
  // Domain gốc (không có "app.") - dùng cho trang landing/login
  rootURL: string;
  // Dữ liệu test (id...) khác nhau giữa các môi trường
  hsk: {
    testSetId: number;
    testDetailId: number;
    submissionSkillId: string;
  };
  vstep: {
    testDetailId: number;
    unitId: number;
  };
}

export const environments: Record<Environment, EnvConfig> = {
  dev: {
    baseURL: 'https://app.testsprep.online/',
    rootURL: 'https://testsprep.online/',
    hsk: {
      testSetId: 476,
      testDetailId: 13362,
      submissionSkillId: '6a4c7294f252ce29180bc89d',
    },
    vstep: {
      testDetailId: 13408,
      unitId: 9620,
    },
  },
  staging: {
    baseURL: 'https://app.prepstg.com/',
    rootURL: 'https://prepstg.com/',
    hsk: {
      testSetId: 371,
      testDetailId: 22742,
      submissionSkillId: '6a339e3316522fe27f090b12',
    },
    vstep: {
      testDetailId: 0, // TODO: cập nhật khi có id thực tế trên staging
      unitId: 0,
    },
  },
  pro: {
    baseURL: 'https://app.prepedu.com/',
    rootURL: 'https://prepedu.com/',
    hsk: {
      testSetId: 0, // TODO: cập nhật khi có id thực tế trên production
      testDetailId: 0,
      submissionSkillId: '',
    },
    vstep: {
      testDetailId: 0, // TODO: cập nhật khi có id thực tế trên production
      unitId: 0,
    },
  },
};

export const currentEnv: Environment = (process.env.TARGET_ENV as Environment) || 'staging';
export const currentEnvConfig = environments[currentEnv];
