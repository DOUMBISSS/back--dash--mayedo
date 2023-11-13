var nodemailer = require('nodemailer');

var transporter = nodemailer.createTransport({
  host:'mac12.winihost.com',
  port: 993,
  auth: {
    user: 'sci@mayedo.ci',
    pass: 'mayedo@7788'
  }
});

var mailOptions = {
  from: 'sci@mayedo.ci',
  to: 'myfriend@yahoo.com',
  subject: '',
  text: ''
};

transporter.sendMail(mailOptions, function(error, info){
  if (error) {
    console.log(error);
  } else {
    console.log('Email sent: ' + info.response);
  }
});