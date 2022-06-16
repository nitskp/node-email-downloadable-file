import express from "express";
import ejs from "ejs";
import nodemailer from "nodemailer";
import path from "path";
import fs from "fs";

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.get("/", (req, res) => {
  res.render("contactForm");
});

app.post("/", (req, res) => {
  const { message, name, email } = req.body;
  const emailContent = `
    <h3>Contact Info</h3>
    <ul>
        <li>Name: ${name}</li>
        <li>Email: ${email}</li>
        <li>Message: ${message} </li>
    </ul>
    <h3>Message finished</h3>
  `;
  // need to see using gmail or other email providers
  async function main() {
    let testAccount = await nodemailer.createTestAccount();

    let transporter = nodemailer.createTransport({
      host: "smtp.ethereal.email",
      port: 587,
      secure: false,
      auth: {
        user: testAccount.user,
        pass: testAccount.pass,
      },
    });

    let info = await transporter.sendMail({
      from: `"Nitin Pandey" <${testAccount.user}>`,
      to: "nitnkpandey4@gmail.com, nitinkumarpandey2013@gmail.com",
      subject: "Mail through mail",
      html: emailContent,
    });

    console.log("Message sent: %s", info.messageId);

    console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
  }

  main().catch((error) => {
    res.json({
      error: error,
    });
  });

  res.send("email successfull");
});

app.get("/download", (req, res) => {
  // const file = fs.createWriteStream(path.join(__dirname, "data", "data.txt"));
  res.download(path.join(__dirname, "data", "data.txt"));
  console.log("File downloaded");
});

const PORT = 3000;

app.listen(PORT, () => console.log(`Server connected on ${PORT}`));
