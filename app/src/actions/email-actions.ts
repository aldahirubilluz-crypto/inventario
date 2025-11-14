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
const supportEmail = process.env.FROM_EMAIL;

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
      <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f3f4f6; padding: 40px;">
        <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 14px; padding: 35px; border: 1px solid #e5e7eb; box-shadow: 0 4px 20px rgba(0,0,0,0.05);">
          
          <h2 style="color: #111827; text-align: center; margin-bottom: 5px; font-size: 24px; font-weight: 700;">
            Recupera tu contraseña
          </h2>
          <p style="color: #6b7280; text-align: center; margin-top: 0;">
            Solicitud de restablecimiento de contraseña
          </p>

          <p style="color: #374151; margin: 25px 0; font-size: 15px;">
            Hola <strong>${name || "usuario"}</strong>,  
            <br><br>
            Recibimos una solicitud para restablecer tu contraseña. Usa el código de verificación a continuación.  
            <br>
            <strong>Este código es válido por 15 minutos.</strong>
          </p>

          <div style="text-align: center; margin: 30px 0;">
            <span style="
              background: linear-gradient(135deg, #dbeafe, #bfdbfe);
              color: #1e3a8a;
              padding: 14px 28px;
              border-radius: 10px;
              font-size: 26px;
              font-weight: 700;
              letter-spacing: 3px;
              display: inline-block;
              box-shadow: 0 3px 10px rgba(59,130,246,0.2);
            ">
              ${token}
            </span>
          </div>

          <p style="color: #4b5563; margin-top: 20px; font-size: 14px;">
            Si tú no solicitaste este cambio, es posible que alguien esté intentando acceder a tu cuenta.
          </p>

          <!-- 🔐 Sección de seguridad -->
          <div style="background-color: #fef3c7; border-left: 4px solid #f59e0b; padding: 15px 20px; margin: 25px 0; border-radius: 8px; color: #92400e;">
            <strong>⚠️ Consejos de seguridad:</strong>
            <ul style="margin: 10px 0 0 20px; padding: 0; font-size: 14px;">
              <li>No compartas este código con nadie.</li>
              <li>Evita usar contraseñas débiles o repetidas.</li>
              <li>No abras enlaces sospechosos sobre recuperación de cuentas.</li>
              <li>Si no solicitaste este correo, cambia tu contraseña inmediatamente.</li>
            </ul>
          </div>

          <hr style="margin: 30px 0; border: none; border-top: 1px solid #e5e7eb;" />

          <!-- Footer -->
          <p style="text-align: center; font-size: 13px; color: #9ca3af;">
            ¿Necesitas ayuda?  
            <a href="mailto:${supportEmail}" style="color: #2563eb; text-decoration: none;">Contacta a soporte</a>
            <br><br>
            <span style="display: inline-block; margin-top: 5px;">
              © ${new Date().getFullYear()} ${appName}. Todos los derechos reservados.
            </span>
          </p>

        </div>
      </div>
    `,
    text: `
Hola ${name || "usuario"},

Tu código de recuperación es: ${token}

Este código expirará en 15 minutos.

Consejos de seguridad:
- No compartas este código con nadie.
- Si no solicitaste este correo, cambia tu contraseña de inmediato.
- Nunca abras enlaces sospechosos sobre recuperación de cuentas.

Si necesitas ayuda, contáctanos en: ${supportEmail}

${appName} © ${new Date().getFullYear()}
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
      <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f3f4f6; padding: 40px;">
        <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 14px; padding: 35px; border: 1px solid #e5e7eb; box-shadow: 0 4px 20px rgba(0,0,0,0.05);">
          
          <h2 style="color: #111827; text-align: center; margin-bottom: 5px; font-size: 24px; font-weight: 700;">
            Contraseña actualizada
          </h2>

          <p style="color: #4b5563; text-align: center; margin-top: 0; margin-bottom: 25px; font-size: 15px;">
            Tu contraseña ha sido modificada exitosamente.
          </p>

          <!-- Caja de advertencia -->
          <div style="background-color: #fee2e2; border-left: 4px solid #dc2626; padding: 15px 20px; margin: 25px 0; border-radius: 8px; color: #991b1b; font-size: 14px;">
            <strong>⚠️ ¿No realizaste este cambio?</strong>
            <br>
            Es posible que alguien esté intentando acceder a tu cuenta.  
            <strong>Contacta a soporte de inmediato.</strong>
          </div>

          <!-- Consejos de seguridad -->
          <div style="background-color: #fef3c7; border-left: 4px solid #f59e0b; padding: 15px 20px; margin-top: 25px; border-radius: 8px; color: #92400e;">
            <strong>🔐 Recomendaciones de seguridad:</strong>
            <ul style="margin: 10px 0 0 20px; padding: 0; font-size: 14px;">
              <li>Evita usar contraseñas repetidas en otros sitios.</li>
              <li>Activa el doble factor de autenticación si está disponible.</li>
              <li>No compartas tu contraseña con nadie.</li>
              <li>Evita acceder desde redes Wi-Fi públicas sin protección.</li>
            </ul>
          </div>

          <hr style="margin: 35px 0; border: none; border-top: 1px solid #e5e7eb;" />

          <!-- Footer -->
          <p style="text-align: center; font-size: 13px; color: #9ca3af;">
            ¿Necesitas ayuda?  
            <a href="mailto:${supportEmail}" style="color: #2563eb; text-decoration: none;">Contáctanos</a>
            <br><br>
            <span style="display: inline-block; margin-top: 5px;">
              © ${new Date().getFullYear()} ${appName}. Todos los derechos reservados.
            </span>
          </p>

        </div>
      </div>
    `,
    text: `
Tu contraseña ha sido actualizada correctamente.

⚠️ Si no realizaste este cambio, contacta inmediatamente a soporte.

Recomendaciones:
- No reutilices contraseñas.
- No compartas tu contraseña.
- Evita iniciar sesión desde redes inseguras.

Soporte: ${supportEmail}
${appName} © ${new Date().getFullYear()}
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
