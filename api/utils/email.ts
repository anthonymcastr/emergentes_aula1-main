// utils/email.ts
import nodemailer from "nodemailer"

export const transporter = nodemailer.createTransport({
  host: process.env.MAILTRAP_HOST,
  port: Number(process.env.MAILTRAP_PORT),
  auth: {
    user: process.env.MAILTRAP_USER,
    pass: process.env.MAILTRAP_PASS
  }
})

export async function enviarEmail(destinatario: string, assunto: string, corpoHtml: string) {
  const info = await transporter.sendMail({
    from: `"PetPel" <${process.env.MAILTRAP_FROM}>`,
    to: destinatario,
    subject: assunto,
    html: corpoHtml
  })

  console.log("E-mail enviado:", info.messageId)
}
