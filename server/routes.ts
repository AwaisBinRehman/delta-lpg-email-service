import express from 'express';
import nodemailer from 'nodemailer'
import hbs from 'nodemailer-express-handlebars'
import path from 'path';

const viewPath = path.resolve(__dirname, './templates/views/');

export const routes = express.Router();

routes.get('/hello', (req, res) => {
  return res.status(200).send({
    status: "200",
    message: 'Hello: ' + process.env.USER_NAME_
  })
})

routes.post('/sendMessage', (req, res) => {
  try {
    var transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.USER_NAME_,
        pass: process.env.SECRET_KEY_
      }
    });
    transporter.use('compile', hbs({
      viewEngine: {
        extname: '.handlebars',
        layoutsDir: viewPath,
        defaultLayout: false
      },
      viewPath: viewPath,
      extName: '.handlebars',
    }))
    var mailOptions = {
      from: req.body.email,
      to: process.env.SEND_TO_,
      subject: req.body.subject ? req.body.subject : 'Email From deltalpgpvtltd Contact Us From',
      template: 'index',
      context: {
        Message: req.body.message,
        SenderEmail: req.body.email,
        SenderName: req.body.name,
        SenderContact: req.body.contact
      }
    };
    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        return res.status(400).send({
          status: "400",
          message: 'An Error Occurred while sending email! \n Kindly check your email. \n If valid contact your site admin'
        })
      } else {
        return res.status(200).send({
          status: "200",
          message: 'Mail Sent!'
        })
      }
    })
  } catch (error) {
    return res.status(400).send({
      status: "400",
      message: 'An Error Occurred while sending email! \n Kindly check your email. \n If valid contact your site admin'
    })
  }
})