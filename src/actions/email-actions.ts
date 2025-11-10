"use server";

import { createTransport } from "nodemailer";

interface SendRecoveryEmailParams {
  email: string;
  token: string;
  name?: string;
}

interface SendPasswordChangedEmailParams {
  email: string;
}

const transporter = createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT || "587"),
  secure: process.env.SMTP_SECURE === "true",
  auth: {
    user: process.env.FROM_EMAIL,
    pass: process.env.SMTP_PASSWORD,
  },
});

const appName = process.env.NEXT_PUBLIC_APP_NAME || "OTIC";
const supportEmail =
  process.env.FROM_EMAIL || "goregerenciadesarrollosocial@gmail.com";

export async function sendRecoveryEmail({
  email,
  token,
  name,
}: SendRecoveryEmailParams) {
  const mailOptions = {
    from: `"Soporte ${appName}" <${process.env.FROM_EMAIL}>`,
    to: email,
    subject: `Recuperación de contraseña - ${appName}`,
    html: `
      <div style="font-family: Arial, sans-serif; background-color: #f9fafb; padding: 30px;">
        <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 10px; padding: 30px; border: 1px solid #e5e7eb;">
          <h2 style="color: #111827; text-align: center; margin-bottom: 10px;">Recupera tu contraseña</h2>
          <p style="color: #4b5563; text-align: center; margin-bottom: 20px;">
            Hola <strong>${name || "usuario"}</strong>,<br>
            Usa el siguiente código para restablecer tu contraseña. El código es válido por 15 minutos.
          </p>
          <div style="text-align: center; margin: 30px 0;">
            <span style="background-color: #e0f2fe; color: #0369a1; padding: 12px 25px; border-radius: 6px; font-size: 20px; font-weight: bold; letter-spacing: 2px;">
              ${token}
            </span>
          </div>
          <p style="color: #6b7280; text-align: center; font-size: 14px;">
            Si no solicitaste este cambio, ignora este mensaje o contacta a soporte.
          </p>
          <hr style="margin: 30px 0; border: none; border-top: 1px solid #e5e7eb;" />
          <p style="text-align: center; font-size: 13px; color: #9ca3af;">
            ¿Necesitas ayuda? <a href="mailto:${supportEmail}" style="color: #2563eb; text-decoration: none;">Contáctanos</a><br>
            © ${new Date().getFullYear()} ${appName}. Todos los derechos reservados.
          </p>
        </div>
      </div>
    `,
    text: `
Hola ${name || "usuario"},

Tu código de recuperación es: ${token}

Este código expirará en 15 minutos.

Si no solicitaste este cambio, ignora este mensaje o contacta a soporte en ${supportEmail}.
    `,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error("❌ Error al enviar correo de recuperación:", error);
    throw new Error("No se pudo enviar el correo de recuperación.");
  }
}

export async function sendPasswordChangedEmail({
  email,
}: SendPasswordChangedEmailParams) {
  const mailOptions = {
    from: `"Soporte ${appName}" <${process.env.FROM_EMAIL}>`,
    to: email,
    subject: `Contraseña actualizada - ${appName}`,
    html: `
      <div style="font-family: Arial, sans-serif; background-color: #f9fafb; padding: 30px;">
        <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 10px; padding: 30px; border: 1px solid #e5e7eb;">
          <h2 style="color: #111827; text-align: center; margin-bottom: 10px;">Contraseña actualizada</h2>
          <p style="color: #4b5563; text-align: center; margin-bottom: 20px;">
            Tu contraseña ha sido actualizada correctamente.
          </p>
          <p style="color: #6b7280; text-align: center; font-size: 14px;">
            Si no realizaste este cambio, contacta a nuestro soporte inmediatamente.
          </p>
          <hr style="margin: 30px 0; border: none; border-top: 1px solid #e5e7eb;" />
          <p style="text-align: center; font-size: 13px; color: #9ca3af;">
            ¿Necesitas ayuda? <a href="mailto:${supportEmail}" style="color: #2563eb; text-decoration: none;">Contáctanos</a><br>
            © ${new Date().getFullYear()} ${appName}. Todos los derechos reservados.
          </p>
        </div>
      </div>
    `,
    text: `
Tu contraseña ha sido actualizada correctamente.

Si no realizaste este cambio, contacta a soporte en ${supportEmail}.
    `,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error("❌ Error al enviar correo de confirmación:", error);
    throw new Error("No se pudo enviar el correo de confirmación.");
  }
}
