import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailerService {
  private transporter: nodemailer.Transporter;

  constructor(private configService: ConfigService) {
    this.transporter = nodemailer.createTransport({
      host: this.configService.get('SMTP_HOST'),
      port: this.configService.get('SMTP_PORT'),
      secure: true,
      auth: {
        user: this.configService.get('SMTP_USER'),
        pass: this.configService.get('SMTP_PASS'),
      },
    });
  }

  async sendPasswordReset(email: string, token: string) {
    const resetUrl = `${this.configService.get('FRONTEND_URL')}/reset-password?token=${token}`;

    const mailOptions = {
      from: this.configService.get('SMTP_FROM'),
      to: email,
      subject: 'Recuperação de Senha - Fitness 360',
      html: `
        <h1>Recuperação de Senha</h1>
        <p>Você solicitou a recuperação de senha da sua conta na Plataforma Fitness 360.</p>
        <p>Clique no link abaixo para criar uma nova senha:</p>
        <a href="${resetUrl}">Recuperar Senha</a>
        <p>Se você não solicitou a recuperação de senha, ignore este email.</p>
        <p>O link é válido por 1 hora.</p>
      `,
    };

    await this.transporter.sendMail(mailOptions);
  }
} 