import nodemailer from "nodemailer";

async function createTestAccount() {
  try {
    const account = await nodemailer.createTestAccount();

    console.log("================================");
    console.log("ETHEREAL ACCOUNT CREATED");
    console.log("================================");
    console.log("User:", account.user);
    console.log("Pass:", account.pass);
    console.log("SMTP Host:", account.smtp.host);
    console.log("SMTP Port:", account.smtp.port);
  } catch (error) {
    console.error(error);
  }
}

createTestAccount();