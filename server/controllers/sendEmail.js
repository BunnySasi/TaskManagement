import nodemailer from "nodemailer";

export const sendEmail = async function (x, y) {
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    auth: {
      user: process.env.SMTP_EMAIL,
      pass: process.env.SMTP_PASSWORD
    }
  });

  console.log(x.Task_Id);

  const message = {
    from: `${process.env.SMTP_FROM_NAME} <${process.env.SMTP_FROM_EMAIL}>`,
    to: "noreply@jobbee.com",
    subject: "Confirmation to close off task",
    // text: "Task" + " " + x.Task_Id + " " + "has been promoted from doing to done state by" + " " + x.Task_Owner + "."
    text: "Task Id" + " " + x + " " + "has been promoted from doing to done state by" + " " + y + "."
  };

  transporter.sendMail(message, function (error, info) {
    if (error) {
      console.log(error);
    } else {
      console.log("Email sent: " + info.response);
    }
  });
};
