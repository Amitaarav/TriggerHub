import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
    host: process.env.SMTP_ENDPOINT,
    port:587,
    secure: false,
    auth: {
        user: process.env.SMTP_USERNAME,
        pass: process.env.SMTP_PASSWORD,
    },
});
export const sendEmail = async(to: string, body: string) => {
    console.log(`Sending out email to ${to} with body ${body}`)
    await transporter.sendMail({
        from:"",
        sender:"",
        to,
        subject: "Hello from TriggerHub",
        text: body
    })
}
// amazon ses
// Nodemailer