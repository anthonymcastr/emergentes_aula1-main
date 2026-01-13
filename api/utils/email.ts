import nodemailer from "nodemailer"

export const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD
  }
})

export async function enviarEmail(destinatario: string, assunto: string, corpoHtml: string) {
  try {
    const info = await transporter.sendMail({
      from: `"PetPel" <${process.env.GMAIL_USER}>`,
      to: destinatario,
      subject: assunto,
      html: corpoHtml
    })

    console.log("E-mail enviado:", info.messageId)
  } catch (error) {
    console.warn("Erro ao enviar e-mail:", error)
    
  }
}
