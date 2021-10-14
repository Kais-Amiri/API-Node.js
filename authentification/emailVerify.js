const nodemailer = require("nodemailer");

const emailVerify = async (url, email, token) => {
  let transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.Email,
      pass: process.env.Password,
    },
  });

  let mailOptions = {
    from: process.env.Email,
    to: `${email}`,
    subject: "Email verification",
    // html body
    html: `<p>Pleade click  on this link to verify you account :
    <h3><a href="${url}${token}">Account verification</a></h3></p>`,
  };
  await transporter.sendMail(mailOptions, function (err, data) {
    err
      ? console.log("Error in sending email : ", err)
      : console.log("Email sending successfully !");
  });
};

module.exports = emailVerify;
