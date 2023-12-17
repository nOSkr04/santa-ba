import User from "../models/User.js";
import MyError from "../utils/myError.js";
import asyncHandler from "express-async-handler";
import paginate from "../utils/paginate.js";
import Wallet from "../models/Wallet.js";
import sendNotification from "../utils/sendNotification.js";
import axios from "axios";
import GiftUser from "../models/GiftUser.js";
import Notification from "../models/Notification.js";
import GiftWallet from "../models/GiftWallet.js";
import AllEgg from "../models/AllEgg.js";

export const authMeUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.userId);
  if (!user) {
    throw new MyError(req.params.id, 401);
  }
  res.status(200).json({
    success: true,
    data: user,
  });
});

// register
export const register = asyncHandler(async (req, res, next) => {
  const user = await User.create(req.body);
  const token = user.getJsonWebToken();
  user.type = "VERIFY";
  user.save();

  res.status(200).json({
    success: true,
    token,
    user: user,
  });
});

export const registerPhone = asyncHandler(async (req, res) => {
  const { phone, expoPushToken } = req.body;
  if (!phone) {
    throw new MyError("Утасны дугаараа оруулна уу", 400);
  }

  const user = await User.findOne({ phone });
  if (user) {
    throw new MyError("Бүртгэлтэй утасны дугаар байна", 400);
  }
  const newUser = await User.create({
    phone,
    expoPushToken,
    type: "CHECK_PHONE_REGISTER",
  });
  const token = newUser.getJsonWebToken();

  res.status(200).json({
    success: true,
    token,
    user: newUser,
  });
});

export const registerPassword = asyncHandler(async (req, res) => {
  const { password } = req.body;

  if (!password) {
    throw new MyError("Пин кодоо оруулна уу", 400);
  }
  const user = await User.findById(req.userId);
  if (!user) {
    throw new MyError("Алдаа гарлаа", 400);
  }

  user.type = "REGISTER_SUCCESS";
  user.password = password;

  user.save();

  const token = user.getJsonWebToken();

  const cookieOption = {
    expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000000),
    httpOnly: true,
  };

  res.status(200).cookie("amazon-token", token, cookieOption).json({
    success: true,
    token,
    user: user,
  });
});

export const loginPhone = asyncHandler(async (req, res) => {
  const { phone, expoPushToken } = req.body;
  if (!phone) {
    throw new MyError("Утасны дугаараа оруулна уу", 400);
  }
  const user = await User.findOne({ phone });
  if (!user) {
    throw new MyError("Бүртгэлтэй утасны дугаар олдсонгүй", 400);
  }
  user.type = "CHECK_PHONE_LOGIN";
  user.expoPushToken = expoPushToken;
  user.save();
  const token = user.getJsonWebToken();

  const cookieOption = {
    expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000000),
    httpOnly: true,
  };

  res.status(200).cookie("amazon-token", token, cookieOption).json({
    success: true,
    token,
    user: user,
  });
});

export const loginCheckPassword = asyncHandler(async (req, res) => {
  const { password } = req.body;
  const user = await User.findById(req.userId);
  if (!user) {
    throw new MyError("Алдаа гарлаа", 400);
  }
  const ok = await user.checkPassword(password);

  if (!ok) {
    throw new MyError("Нууц үг буруу байна", 400);
  }
  user.type = "LOGIN_SUCCESS";
  user.save();
  res.status(200).json({
    success: true,
    user: user,
  });
});

// логин хийнэ
export const login = asyncHandler(async (req, res, next) => {
  const { phone, password, expoPushToken } = req.body;

  // Оролтыгоо шалгана

  if (!phone || !password) {
    throw new MyError("Имэл болон нууц үйгээ дамжуулна уу", 400);
  }

  // Тухайн хэрэглэгчийн хайна
  const user = await User.findOne({ phone }).select("+password");

  if (!user) {
    throw new MyError("Утас болон нууц үгээ зөв оруулна уу", 401);
  }

  const ok = await user.checkPassword(password);

  if (!ok) {
    throw new MyError("Утас болон нууц үгээ зөв оруулна уу", 401);
  }

  user.expoPushToken = expoPushToken;
  user.save();
  const token = user.getJsonWebToken();

  const cookieOption = {
    expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000000),
    httpOnly: true,
  };

  res.status(200).cookie("amazon-token", token, cookieOption).json({
    success: true,
    token,
    user: user,
  });
});

export const logout = asyncHandler(async (req, res, next) => {
  const cookieOption = {
    expires: new Date(Date.now() - 365 * 24 * 60 * 60 * 1000000),
    httpOnly: true,
  };

  res.status(200).cookie("amazon-token", null, cookieOption).json({
    success: true,
    data: "logged out...",
  });
});

export const getUsers = asyncHandler(async (req, res, next) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const sort = req.query.sort;
  const select = req.query.select;

  ["select", "sort", "page", "limit"].forEach((el) => delete req.query[el]);

  const pagination = await paginate(page, limit, User);

  const users = await User.find(req.query, select)
    .sort(sort)
    .skip(pagination.start - 1)
    .limit(limit);

  res.status(200).json({
    success: true,
    data: users,
    pagination,
  });
});

export const getUser = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    throw new MyError(req.params.id + " ID-тэй хэрэглэгч байхгүй!", 400);
  }

  res.status(200).json({
    success: true,
    data: user,
  });
});

export const createUser = asyncHandler(async (req, res, next) => {
  const user = await User.create(req.body);
  res.status(200).json({
    success: true,
    data: user,
  });
});

export const updateUser = asyncHandler(async (req, res, next) => {
  const user = await User.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!user) {
    throw new MyError(req.params.id + " ID-тэй хэрэглэгч байхгүйээээ.", 400);
  }

  res.status(200).json({
    success: true,
    data: user,
  });
});

export const deleteUser = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.userId);
  if (!user) {
    throw new MyError(req.params.id + " ID-тэй хэрэглэгч байхгүй.", 400);
  }

  user.remove();

  res.status(200).json({
    success: true,
    data: user,
  });
});

export const invoiceTime = asyncHandler(async (req, res, next) => {
  const profile = await User.findById(req.params.id);
  await axios({
    method: "post",
    url: "https://merchant.qpay.mn/v2/auth/token",
    headers: {
      Authorization: `Basic U0VEVTowYjRrNDJsRA==`,
    },
  })
    .then((response) => {
      const token = response.data.access_token;

      axios({
        method: "post",
        url: "https://merchant.qpay.mn/v2/invoice",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        data: {
          invoice_code: "SEDU_INVOICE",
          sender_invoice_no: "12345678",
          invoice_receiver_code: `${profile.phone}`,
          invoice_description: `Santa egg ${profile.phone}`,
          amount: req.body.amount,
          callback_url: `https://neuronsolution.info/users/callbacks/${req.params.id}/${req.body.amount}`,
        },
      })
        .then(async (response) => {
          req.body.urls = response.data.urls;
          req.body.qrImage = response.data.qr_image;
          req.body.invoiceId = response.data.invoice_id;
          const wallet = await Wallet.create(req.body);
          profile.invoiceId = wallet._id;
          profile.save();
          res.status(200).json({
            success: true,
            data: wallet._id,
          });
        })
        .catch((error) => {
          console.log(error.response.data);
        });
    })
    .catch((error) => {
      console.log(error.response.data);
    });
});

export const invoiceCheck = asyncHandler(async (req, res) => {
  await axios({
    method: "post",
    url: "https://merchant.qpay.mn/v2/auth/token",
    headers: {
      Authorization: `Basic U0VEVTowYjRrNDJsRA==`,
    },
  })
    .then((response) => {
      const token = response.data.access_token;
      axios({
        method: "post",
        url: "https://merchant.qpay.mn/v2/payment/check",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        data: {
          object_type: "INVOICE",
          object_id: req.params.id,
          page_number: 1,
          page_limit: 100,
          callback_url: `https://neuronsolution.info/users/check/challbacks/${req.params.id}/${req.params.numId}`,
        },
      })
        .then(async (response) => {
          const profile = await User.findById(req.params.numId);
          const count = response.data.count;
          if (count === 0) {
            res.status(402).json({
              success: false,
            });
          } else {
            // const price = parseInt(req.params.numId, 10);
            // const eggCount = price / 100;
            // profile.eggCount = profile.eggCount + eggCount;
            // profile.save();
            // await sendNotification(
            //   profile.expoPushToken,
            //   `${eggCount} өндөг амжилттай авлаа`
            // );
            res.status(200).json({
              success: true,
              data: profile,
            });
          }
        })
        .catch((error) => {
          // console.log(error, "error");
        });
    })
    .catch((error) => {
      console.log(error);
    });
});

export const chargeTime = asyncHandler(async (req, res, next) => {
  const profile = await User.findById(req.params.id);
  const price = parseInt(req.params.numId, 10);
  const eggCount = price / 100;
  profile.eggCount = profile.eggCount + eggCount;
  await sendNotification(
    profile.expoPushToken,
    `${eggCount} өндөг амжилттай авлаа`
  );
  await Notification.create({
    title: `${eggCount} өндөг амжилттай авлаа`,
    users: profile._id,
  });
  await User.updateOne(
    { _id: profile._id },
    { $inc: { notificationCount: 1 } }
  );
  await AllEgg.create({ phone: profile.phone });
  profile.save();

  res.status(200).json({
    success: true,
    data: profile,
  });
});

export const allVoucherGive = asyncHandler(async (req, res, next) => {
  const users = await User.find();
  await Promise.all(
    users.map(async (user) => {
      // Update isRandom to false for each gift in the user's gifts array
      await Promise.all(
        user.gifts.map(async (giftId) => {
          await Gift.findByIdAndUpdate(giftId, { $set: { isRandom: false } });
        })
      );

      // Save the updated user
      await user.save();
    })
  );
});

export const sendUserNotification = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  const result = await sendNotification(user.expoPushToken, req.body.message);

  res.status(200).json({
    success: true,
    data: result,
  });
});

export const invoiceGift = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const { amount, phone } = req.body;
  const profile = await User.findById(id);
  await axios({
    method: "post",
    url: "https://merchant.qpay.mn/v2/auth/token",
    headers: {
      Authorization: `Basic U0VEVTowYjRrNDJsRA==`,
    },
  })
    .then((response) => {
      const token = response.data.access_token;

      axios({
        method: "post",
        url: "https://merchant.qpay.mn/v2/invoice",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        data: {
          invoice_code: "SEDU_INVOICE",
          sender_invoice_no: "12345678",
          invoice_receiver_code: `${profile.phone}`,
          invoice_description: `Santa egg ${profile.phone} аас ${phone} бэлэглэв`,
          amount: amount,
          callback_url: `https://neuronsolution.info/users/callbacks/gift/${id}/${amount}/${phone}`,
        },
      })
        .then(async (response) => {
          req.body.urls = response.data.urls;
          req.body.qrImage = response.data.qr_image;
          req.body.invoiceId = response.data.invoice_id;
          req.body.isGift = true;
          const wallet = await Wallet.create(req.body);
          profile.giftInvoice = wallet._id;
          profile.save();
          res.status(200).json({
            success: true,
            data: wallet._id,
          });
        })
        .catch((error) => {
          console.log(error.response.data);
        });
    })
    .catch((error) => {
      console.log(error.response.data);
    });
});

export const invoiceGiftCheck = asyncHandler(async (req, res) => {
  const { id, numId, phone } = req.params;
  await axios({
    method: "post",
    url: "https://merchant.qpay.mn/v2/auth/token",
    headers: {
      Authorization: `Basic U0VEVTowYjRrNDJsRA==`,
    },
  })
    .then((response) => {
      const token = response.data.access_token;
      axios({
        method: "post",
        url: "https://merchant.qpay.mn/v2/payment/check",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        data: {
          object_type: "INVOICE",
          object_id: id,
          page_number: 1,
          page_limit: 100,
          callback_url: `https://neuronsolution.info/users/check/challbacks/gift/${id}/${numId}/${phone}`,
        },
      })
        .then(async (response) => {
          const profile = await User.findById(numId);
          const count = response.data.count;
          if (count === 0) {
            res.status(402).json({
              success: false,
            });
          } else {
            res.status(200).json({
              success: true,
              data: profile,
            });
          }
        })
        .catch((error) => {
          // console.log(error, "error");
        });
    })
    .catch((error) => {
      console.log(error);
    });
});

export const chargeGift = asyncHandler(async (req, res, next) => {
  const { id, numId, phone } = req.params;
  const profile = await User.findById(id);
  const user = await User.findOne({ phone: phone });
  const price = parseInt(numId, 10);
  const eggCount = price / 100;
  if (user) {
    await sendNotification(
      user.expoPushToken,
      `${profile.phone} хэрэглэгчээс танд ${eggCount} өндөг бэлэглэлээ`
    );
    user.eggCount = user.eggCount + eggCount;
    await Notification.create({
      title: `${profile.phone} хэрэглэгчээс танд ${eggCount} өндөг бэлэглэлээ`,
      users: user._id, // Link the notification to the user
    });
    await User.updateOne({ _id: user._id }, { $inc: { notificationCount: 1 } });
    user.save();
  } else {
    await GiftUser.create({ phone: phone });
    await AllEgg.create({ phone: phone });
  }

  profile.giftedUsers = [
    ...profile.giftedUsers,
    {
      user: phone,
      count: eggCount,
    },
  ];

  profile.save();

  res.status(200).json({
    success: true,
    data: profile,
  });
});
