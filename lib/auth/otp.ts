// lib/auth/otp.ts
import { randomInt } from 'crypto';

/**
 * Generate a 6-digit OTP code
 */
export function generateOTP(): string {
  return randomInt(100000, 999999).toString();
}

/**
 * OTP Service
 * Handles OTP generation, storage, and verification
 */

interface OTPData {
  code: string;
  identifier: string;
  attempts: number;
  expiresAt: Date;
  createdAt: Date;
}

// In-memory storage for development
// In production, use Redis
const otpStore = new Map<string, OTPData>();

export class OTPService {
  private static readonly EXPIRY_MINUTES = 5;
  private static readonly MAX_ATTEMPTS = 3;

  /**
   * Generate and store OTP
   */
  static async generateAndStore(identifier: string): Promise<string> {
    const code = generateOTP();
    const expiresAt = new Date(Date.now() + this.EXPIRY_MINUTES * 60 * 1000);

    const otpData: OTPData = {
      code,
      identifier,
      attempts: 0,
      expiresAt,
      createdAt: new Date(),
    };

    otpStore.set(identifier, otpData);

    // Clean up old OTPs
    this.cleanup();

    return code;
  }

  /**
   * Verify OTP code
   */
  static async verify(
    identifier: string,
    code: string
  ): Promise<{ success: boolean; error?: string }> {
    const otpData = otpStore.get(identifier);

    if (!otpData) {
      return { success: false, error: 'OTP не найден или истек срок действия' };
    }

    // Check expiration
    if (new Date() > otpData.expiresAt) {
      otpStore.delete(identifier);
      return { success: false, error: 'Срок действия кода истек' };
    }

    // Check attempts
    if (otpData.attempts >= this.MAX_ATTEMPTS) {
      otpStore.delete(identifier);
      return {
        success: false,
        error: 'Превышено количество попыток. Запросите новый код',
      };
    }

    // Verify code
    if (otpData.code !== code) {
      otpData.attempts++;
      otpStore.set(identifier, otpData);
      return {
        success: false,
        error: `Неверный код. Осталось попыток: ${
          this.MAX_ATTEMPTS - otpData.attempts
        }`,
      };
    }

    // Success - remove OTP
    otpStore.delete(identifier);
    return { success: true };
  }

  /**
   * Clean up expired OTPs
   */
  private static cleanup() {
    const now = new Date();
    for (const [identifier, data] of otpStore.entries()) {
      if (now > data.expiresAt) {
        otpStore.delete(identifier);
      }
    }
  }

  /**
   * Get remaining time for OTP
   */
  static getRemainingTime(identifier: string): number {
    const otpData = otpStore.get(identifier);
    if (!otpData) return 0;

    const remainingMs = otpData.expiresAt.getTime() - Date.now();
    return Math.max(0, Math.floor(remainingMs / 1000));
  }
}

/**
 * Email Service
 * Send OTP via email
 */
export class EmailService {
  static async sendOTP(email: string, code: string): Promise<void> {
    // TODO: Implement actual email sending using nodemailer or SendGrid
    console.log(`[EMAIL] Sending OTP ${code} to ${email}`);

    // Simulate email sending delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // For development, just log it
    if (process.env.NODE_ENV === 'development') {
      console.log(`✅ OTP for ${email}: ${code}`);
    }

    // Production implementation:
    /*
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD,
      },
    });

    await transporter.sendMail({
      from: process.env.SMTP_FROM,
      to: email,
      subject: 'Ваш код подтверждения',
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px;">
          <h2>Код подтверждения</h2>
          <p>Ваш код для входа в систему управления материальной помощью:</p>
          <h1 style="color: #3b82f6; font-size: 32px; letter-spacing: 8px;">${code}</h1>
          <p>Код действителен в течение 5 минут.</p>
          <p>Если вы не запрашивали этот код, проигнорируйте это письмо.</p>
        </div>
      `,
    });
    */
  }
}

/**
 * SMS Service
 * Send OTP via SMS
 */
export class SMSService {
  static async sendOTP(phone: string, code: string): Promise<void> {
    // TODO: Implement actual SMS sending using Twilio or MessageBird
    console.log(`[SMS] Sending OTP ${code} to ${phone}`);

    // Simulate SMS sending delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // For development, just log it
    if (process.env.NODE_ENV === 'development') {
      console.log(`✅ OTP for ${phone}: ${code}`);
    }

    // Production implementation (Twilio):
    /*
    const client = require('twilio')(
      process.env.TWILIO_ACCOUNT_SID,
      process.env.TWILIO_AUTH_TOKEN
    );

    await client.messages.create({
      body: `Ваш код подтверждения: ${code}. Действителен 5 минут.`,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: phone,
    });
    */
  }
}
