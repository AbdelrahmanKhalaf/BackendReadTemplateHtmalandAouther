import { NextFunction, Response, Router, Request } from "express";
import mailgun from "mailgun-js";
import multer from "multer";
import config from "../config/config"
import {
  User,
  validateUser,
  Iusers,
  validateUserEmail,
  validateUserPassword,
  validateUserUpdate,
} from "../models/user.model";
import jwt from "jsonwebtoken";
import _ from "lodash";
import { AuthenticationMiddleware } from "../middleware/auth";
import { AuthuthrationMiddleware } from "../middleware/admin";
import { geocoder } from '../helpers/geocoder'
import becrypt from "bcryptjs"
const mg = mailgun({ apiKey: config.apiKey, domain: config.DOMAIN });
const storage = multer.diskStorage({
  destination: function (req, res, cb) {
    cb(null, "uploads");
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + "_" + Date.now() + ".png");
  },
});
const fileFilter = function fileFilter(
  req: any,
  file: { mimetype: string },
  cb: (arg0: null, arg1: boolean) => void
) {
  if (file.mimetype === "image/jpeg" || file.mimetype === "image/png") {
    cb(null, true);
  } else {
    cb(null, false);
  }
};
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
});
const type = upload.single("avatar");
const router: Router = Router();
router.post(
  "/singup",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const {
        email,
        password,
        phone,
        name,
        address,
        confirmPassword,
        location
      }: Iusers = await req.body;

      const { error }: any = validateUser(req.body);
      if (error) return res.status(404).send(error.details[0].message);

      let user = await User.findOne({ email: email });
      if (user)
        return res.status(400).send({
          error_en: "that user already  registered",
          error_ar: "هذا المستخدم مسجل بالفعل",
        });
      let nameUser = await User.findOne({ name: name });
      if (nameUser)
        return res.status(400).send({
          error_en: "that name already exist",
          error_ar: "هذا الاسم موجود بالفعل",
        });
      const vildeLowercase: any = /(?=.*?[a-z])/;
      const vildeCaptalercase: any = /(?=.*?[A-Z])/;
      if (!vildeCaptalercase.test(password))
        return res.status(400).send({
          error_en: "It must contain at least 1 uppercase alphabetic character",
          error_ar: " كلمة السر يجب أن يحتوي على حرف أبجدي واحد كبير على الأقل ",
        });
      if (!vildeLowercase.test(password))
        return res.status(400).send({
          error_en: "It must contain at least one lowercase alphabet",
          error_ar: " كلمةالسر يجب أن يحتوي على حرف أبجدي صغير واحد على الأقل",
        });
      if (password !== confirmPassword)
        return res.status(400).send({
          error_en: "Password does not match",
          error_ar: " كلمة السر غير متطابقة",
        });
      let loc = await geocoder.geocode(address);
      const salt = await becrypt.genSalt(10);
      const hashPassword = await becrypt.hash(password, salt);
      const hashConfriPassword = await becrypt.hash(confirmPassword, salt);
      const users: any = new User({
        email: email,
        password: hashPassword,
        phone: phone,
        name: name,
        confirmPassword: hashConfriPassword,
        address: address,
        location: {
          coordinates: [loc[0].longitude, loc[0].latitude],
          formattedAddress: loc[0].formattedAddress,
          street: loc[0].streetName,
          city: loc[0].city,
          state: loc[0].stateCode,
          zipcode: loc[0].zipcode,
          country: loc[0].countryCode,
        }
      });
      const token = jwt.sign({ email: email }, config.secretToken, {
      });
      return users.save((err: any) => {
        if (err) {
          res.status(400).send({
            error_en: "please enter vaild data",
            error_ar: "الرجاء إدخال بيانات صحيحة",
            error: err,
          });
        } else {
          const data: any = {
            from: "abdelrahmansamysamy9@gmail.com",
            to: email,
            subject: "Accont Actvition Link",
            html: `
                      <h2>please click on given link to activate your account</h2>
                      <a>http://localhost:4000/user/activate-email/${token}</a>
      
              `,
          };
          mg.messages().send(data, (err, body) => {
            if (err) {
              res.send({ error: err.message });
            } else {
              res.status(200).send({
                message_ar:
                  "تم إرسال البريد الإلكتروني ، يرجى تفعيل حسابك ، والتحقق من صندوق بريدك الإلكتروني",
                message_en:
                  "Email has been sent , kindly activate your account , chack your email inbox",
                user: users,
                success: true
              });
            }
          });
        }
      });

    } catch (err) {
      next(err)
    }
  }
);
router.get(
  "/admin/user/:id",
  [AuthenticationMiddleware, AuthuthrationMiddleware],
  async (req: Request, res: Response, next: NextFunction) => {
    const user = await User.find({ name: req.params.id }).select("-password");
    return res.status(200).send(user);
  }
);

router.put(
  "/admin/changeInf/:id",
  [AuthenticationMiddleware, AuthuthrationMiddleware],
  async (req: Request, res: Response, next: NextFunction) => {
    const { error }: any = validateUserUpdate(req.body);
    if (error) return res.status(404).send(error.details[0].message);
    const { phone, name, blocked } = req.body;
    const user = await User.updateOne(
      {
        name: req.params.id,
      },
      {
        $set: {
          name: name,
          phone: phone,
          blocked: blocked,
        },
      }
    );
    res.status(200).send(user);
    return;
  }
);
router.put(
  "/me/complate",
  [AuthenticationMiddleware],
  async (req: Request, res: Response, next: NextFunction) => {
    const { error }: any = validateUserUpdate(req.body);
    if (error) return res.status(404).send(error.details[0].message);
    const { age, gender, address } = req.body;
    const user = await User.updateOne(
      {
        _id: res.locals.user._id,
      },
      {
        $set: {
          age: age,
          gender: gender,
          address: address
        },
      }
    );
    if (!user)
      return res.status(400).send({
        error_en: "the user is not exited",
        error_ar: " المستخدم غير موجد  ",
      });
    const me = await User.find({ _id: res.locals.user._id })
    res.status(200).send({ user: me[0], success: true });
    return;
  }
);
router.put(
  "/me/update",
  [AuthenticationMiddleware],
  async (req: Request, res: Response, next: NextFunction) => {
    const { error }: any = validateUserUpdate(req.body);
    if (error) return res.status(404).send(error.details[0].message);
    const { phone, name, password, age, gender } = req.body;
    const validPassword = await becrypt.compare(password, res.locals.user.password)
    if (!validPassword)
      return res.status(400).send({
        error_en: "invalid password",
        error_ar: "كلمة السر خاطئة",
      });
    let validName: any = await User.find({
      name: name,
      _id: { $ne: res.locals.user._id }
    });
    if (!validName)

      return res.status(400).send({
        error_en: "alredy name is exited",
        error_ar: "الاسم موجد بي الفعل",
      });
    console.log(gender);

    const user = await User.updateOne(
      {
        _id: res.locals.user._id,
      },
      {
        $set: {
          name: name,
          phone: phone,
          age: age,
          gender: gender
        },
      }
    );
    if (!user)
      return res.status(400).send({
        error_en: "the user is not exited",
        error_ar: " المستخدم غير موجد  ",
      });
    res.status(200).send(user);
    return;
  }
);
router.put(
  "/me/avatar",
  [AuthenticationMiddleware, type],
  async (req: Request, res: Response, next: NextFunction) => {
    const avatar: any = await User.findById({ _id: res.locals.user._id });
    if (!avatar)
      return res
        .status(404)
        .send("The User Can't Found with the img Can You trying again");
    avatar.set({
      avatar: req.file.path,
    });
    res.status(200).send({ avatar: avatar });
    return avatar.save();
  }
);
router.put(
  "/me/changEmail/",
  [AuthenticationMiddleware],
  async (req: Request, res: Response, next: NextFunction) => {
    const { error }: any = validateUserEmail(req.body);
    if (error) return res.status(404).send(error.details[0].message);
    const { password, email } = req.body;
    let validEmail: any = await User.findOne({ email: email });
    if (validEmail)
      return res.status(400).send({
        error_en: "already the email is existed",
        error_ar: "الاميل موجد بي  الفعل",
      });
    const validPassword = await becrypt.compare(password, res.locals.user.password)
    if (!validPassword)
      return res.status(400).send({
        error_en: "invalid password",
        error_ar: "كلمة السر خاطئة",
      });
    const user = await User.updateOne(
      {
        _id: res.locals.user._id,
      },
      {
        $set: {
          email: email,
          verify: false,
          resetLink: "",
        },
      }
    );

    return res.status(200).send({
      message_en: " Your email has been changed ",
      message_ar: "تم تغيير الاميل الخاص بك ",
    });
  }
);
router.get("/me", AuthenticationMiddleware,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user: any = await User.find({ _id: res.locals.user._id }).select('-password -confirmPassword')
      if (!user)
        return res.status(400).send({
          error_en: " the user is not found ",
          error_ar: "المستخدم غير موجد",
        });
      res.send({ user: user });
    } catch (err) {
      return next(err)
    }

  }
);
router.get(
  "/users", [AuthenticationMiddleware, AuthuthrationMiddleware],
  async (req: Request, res: Response) => {
    const users: any = await User.find({ isAdmin: false })
    res.send(users);
  }
);
router.put("/forget-password/", async (req: Request, res: Response) => {
  let token: any;
  const { email } = req.body;
  const validEmail: any = await User.find({ email: email });
  if (validEmail[0] === ([] && undefined)) {
    return res.status(400).send({
      error_en: "User with this email does not exists.",
      error_ar: "المستخدم بهذا البريد الإلكتروني غير موجود.",
    });
  }
  if (validEmail[0] != ([] && undefined)) {
    token = jwt.sign({ _id: validEmail[0]._id }, config.secretPassword, {
      expiresIn: "30m",
    });
    await User.update({ email: validEmail[0].email }, {
      $set: { resetLink: token }
    })
    const data = {
      from: "abdelrahmansamysamy9@gmail.com",
      to: email,
      subject: "Accont Forget Password Link",
      html: `
              <h2>please click on given link to reset your password</h2>
              <a href="http:localhost:4200/auth/rest-password/${token}">Activate your Email</a>
  
      `,
    };
    mg.messages().send(data, async (err, body) => {
      if (err) {
        console.log(err);

        res.send({ error: err.message });
      }
    });
  }

  return res.status(200).send({
    message_en:
      "Email has been sent , kindly  follow the instruction , chack your inbox  ",
    message_ar:
      "تم إرسال البريد الإلكتروني ، يرجى اتباع التعليمات ، والتحقق من صندوق الوارد الخاص بك ",
  });
});
router.put("/reset-password/:resetLink", async (req, res) => {
  const { resetLink } = req.params;
  const { newPass } = req.body;
  const vildeLowercase: any = /(?=.*?[a-z])/;
  const vildeCaptalercase: any = /(?=.*?[A-Z])/;
  if (!vildeCaptalercase.test(newPass))
    return res.status(400).send({
      error_en: "It must contain at least 1 uppercase alphabetic character",
      error_ar: " كلمة السر يجب أن يحتوي على حرف أبجدي واحد كبير على الأقل ",
    });
  if (!vildeLowercase.test(newPass))
    return res.status(400).send({
      error_en: "It must contain at least one lowercase alphabet",
      error_ar: " كلمةالسر يجب أن يحتوي على حرف أبجدي صغير واحد على الأقل",
    });
  const validTocken: any = jwt.verify(resetLink, config.secretPassword, (err, dec) => {
    if (err)
      return res.status(401).send({
        error_en: "incorrect token or it is expierd.",
        error_ar: "رابط غير صحيح أو انتهت صلاحيته.",
      });
    return dec
  })

  if (!newPass) return res.status(400).send({ error_en: 'pleass enter new  password!! ' })

  if (!resetLink && !validTocken)
    return res.status(401).send({
      error_en: "incorrect token or it is expierd.",
      error_ar: "رابط غير صحيح أو انتهت صلاحيته.",
    });
  const resetLinkV: any = await User.find({ _id: validTocken._id });
  if (!resetLinkV)
    res.status(400).send({
      error_en: "This Link Is Invalid",
      error_ar: "هذا الرابط غير صالح",
    });
  const validPassword = await becrypt.compare(newPass, resetLinkV[0].password)
  console.log(resetLinkV[0].password);

  console.log(validPassword);

  if (validPassword)
    return res.status(400).send({
      error_en:
        "please change your password do not change your password like your old password.",
      error_ar:
        "الرجاء تغيير كلمة المرور الخاصة بك لا تغير كلمة المرور الخاصة بك مثل كلمة المرور القديمة.",
    });
  const salt = await becrypt.genSalt(10);
  console.log(newPass);

  const hashNewPass = await becrypt.hash(newPass, salt)
  const update = await User.updateOne(
    { resetLink: resetLink },
    {
      $set: {
        password: hashNewPass,
        confirmPassword: hashNewPass,
      },
    }
  );
  console.log(update);


  const data = {
    from: "lenamarwan575@gmail.com",
    to: resetLinkV[0].email,
    subject: "Accont change password",
    html: `
   <h2>Your password has been changed , You know it ?</h2> `,
  };
  mg.messages().send(data, async (err, body) => {
    if (err) {
      res.send({ error: err.message });
    }
  });
  return res.status(200).send({
    message_en: " Your password has been changed ",
    message_ar: " تم تغيير كلمة السر الخاصة بك ",
  });
});
router.put(
  "/me/change-password",
  AuthenticationMiddleware,
  async (req: Request, res: Response) => {
    try {
      const { password, newPass } = req.body;
      const { error }: any = validateUserPassword(req.body);
      if (error) return res.status(404).send(error.details[0].message);
      const vildeLowercase: any = /(?=.*?[a-z])/;
      const vildeCaptalercase: any = /(?=.*?[A-Z])/;
      if (!vildeCaptalercase.test(newPass))
        return res.status(400).send({
          error_en: "It must contain at least 1 uppercase alphabetic character",
          error_ar: " كلمة السر يجب أن يحتوي على حرف أبجدي واحد كبير على الأقل ",
        });
      if (!vildeLowercase.test(newPass))
        return res.status(400).send({
          error_en: "It must contain at least one lowercase alphabet",
          error_ar: " كلمةالسر يجب أن يحتوي على حرف أبجدي صغير واحد على الأقل",
        });

      const validOldPassword = await becrypt.compare(password, res.locals.user.password)
      const validNewPassword = await becrypt.compare(newPass, res.locals.user.password)

      if (!validOldPassword)
        return res.status(400).send({
          error_en: `The old password is wrong. Try again and verify that the old password is correct`,
          error_ar: `كلمة المرور القديمة خاطئة. حاول مرة أخرى وتحقق من صحة كلمة المرور القديمة`,
        });
      if (validNewPassword)
        return res.status(400).send({
          error_en:
            "please change your password do not change your password like your old password.",
          error_ar:
            "الرجاء تغيير كلمة المرور الخاصة بك لا تغير كلمة المرور الخاصة بك مثل كلمة المرور القديمة.",
        });
      const salt = await becrypt.genSalt(10);
      const hashNewPass = await becrypt.hash(newPass, salt)
      const hashNewConfirmPassword = await becrypt.hash(newPass, salt)
      await User.updateOne(
        { _id: res.locals.user._id },
        {
          $set: {
            password: hashNewPass,
            confirmPassword: hashNewConfirmPassword,
          },
        }
      );
      return res.status(200).send({
        message_en: " Your password has been changed ",
        message_ar: "تم تغيير كلمة السر الخاصة بك ",
      });
    } catch (err) {
      throw err;
    }
  }
);
router.post(
  "/resendMessage",
  AuthenticationMiddleware,
  async (req: Request, res: Response) => {
    try {
      const { email } = req.body;
      console.log(email);

      const { error }: any = validateUserEmail(req.body);

      if (error) return res.status(404).send(error.details[0].message);
      const user = await User.findOne({ email: email });
      if (!user)
        return res.status(400).send({
          error_en: `That email INVALID`,
          error_ar: `هذا البريد الإلكتروني غير صالح`,
        });
      const token = jwt.sign({ email: email, _id: user._id }, config.secretToken, {
        expiresIn: "20m",
      });
      if (token) {
        const data = {
          from: "abdelrahmansamysamy9@gmail.com",
          to: email,
          subject: "Accont Actvition Link",
          html: `
                      <h2>please click on given link to activate you account</h2>
                      <a>http://localhost:4000/user/activate-email/${token}</a>
      
              `,
        };
        mg.messages().send(data, (err, body) => {
          if (err) {
            res.send({ error: err.message });
          } else {
            res.send({
              message_en:
                "The link was resubmitted, the link will be invalid 20 minutes from now",
              message_ar:
                "تم إعادة إرسال الرابط ، سيكون الرابط غير صالح بعد 20 دقيقة من الآن",
            });
          }
        });
      } else {
        res.status(400).send({
          error_en: "something is rwong!!!",
          error_ar: "هناك شئ غير صحيح !!!",
        });
      }
      return;
    } catch (err) {
      return res
        .status(400)
        .send({ message_en: "invlid TOKEN", message_ar: "رمز غير صالح" });
    }
  }
);
router.get("/activate/:token", async (req: Request, res: Response) => {
  const { token } = req.params;
  if (token) {
    console.log(token);

    jwt.verify(token, config.secretToken, function (err, decoded: any) {

      if (err) {
        res.status(404).send({ error: err.message });
      }
      return User.findOne({ email: decoded.email }, (err, user) => {
        if (err || !user) {

          return res.status(400).send({
            error_en: "User with this email does not exists.",
            error_ar: "المستخدم بهذا البريد الإلكتروني غير موجود.",
          });
        }
        const obj = {
          verify: true,
        };
        user = _.extend(user, obj);
        return user.save((err, resullt) => {
          if (err) {
            return res.status(400).send({
              error_en: "Link activate the email by mistake ",
              error_ar: "لينك تفعيل الايميل خطا",
            });
          } else {
            return res.status(200).send({
              message_en: " Your Email has been Activated ",
              message_ar: " تم تفعيل بريدك الإلكتروني",
            });
          }
        });
      });
    });
  } else {
    return res.send({ error: "something went wrong!!!" });
  }
  return;
});
router.post("/feedback", async (req: Request, res: Response) => {
  const { email, subject, des, name } = req.body;
  const data = {
    from: "lenamarwan575@gmail.com",
    to: email,
    subject: subject,
    html: `        
     <h1>subject:${subject}</h1>
     <h2>name:${name}</h2>
   <h3>Description:${des}</h3>`,
  };
  mg.messages().send(data, async (err, body) => {
    if (err) {
      res.send({ error: err.message });
    }
  });
  return res.send({
    message_en: "Your message has been sent thanks",
    message_ar: "تم إرسال رسالتك شكرا",
  });
});
router.put('/walt', [AuthenticationMiddleware], async (req: Request, res: Response) => {
  try {
    const { walt } = req.body
    const IdUser = res.locals.user._id
    const user: any = await User.find({ _id: IdUser })
    console.log(user);
    console.log(IdUser);

    const waltAdd = Number(user[0].walt) + Number(walt)
    const update = await User.updateOne({ _id: IdUser }, {
      $set: {
        walt: waltAdd
      }
    })
    console.log(update);

    res.status(200).send({ message: ` done add to walt ${walt} ` })
  } catch (err) {
    console.log(err);

  }
})
router.put('/buyWalt', [AuthenticationMiddleware], async (req: Request, res: Response) => {
  try {
    const { price } = req.body
    const IdUser = res.locals.user._id
    const user: any = await User.find({ _id: IdUser })
    console.log(user);
    console.log(IdUser);
    console.log(price);
    
    if(price < user[0].walt){
      const waltAdd = (Number(user[0].walt) - Number(price))
      console.log(waltAdd);
      
      const update = await User.updateOne({ _id: IdUser }, {
        $set: {
          walt: waltAdd
        }
      })
      console.log(update);

    }else{
      console.log('your price in your walt not enogh');
      
    }
    

    res.status(200).send({ message: ` done buy the order ` })
  } catch (err) {
    console.log(err);

  }
})
// router.post("/google", async (req: Request, res: Response) => {
//   passport.authenticate("google", {
//     scope: [
//       "https://www.googleapis.com/auth/plus.login",
//       "https://www.googleapis.com/auth/plus.profile.email.read",
//     ],
//   });
// });
// router.post("/google/callback", async (req: Request, res: Response) => {});
export default router;
