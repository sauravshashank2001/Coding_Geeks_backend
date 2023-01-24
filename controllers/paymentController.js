import { catchAsyncError } from "../middlewares/catchAsyncError.js";
import { User } from "../models/User.js";
import ErrorHandler from "../utils/errorHandler.js";







// export const getPublishableKey = async(req, res) => {
//   res.status(200).json({
//     publishableKey: process.env.STRIPE_PUBLISHABLE_KEY,
//   });
// };

// export const paymentIntenet = async (req,res,next) => {
//     const myPayment = await stripe.paymentIntents.create({
//         amount: 299,
//         currency: "inr",
//         metadata: {
//             company : "coursebundler",
//         },
//     });
//     res.status(200).json({
//         success: true,
//         client_secret: myPayment.client_secret
//     });
// };



export const buySubscription = catchAsyncError(async (req, res, next) => {
  console.log("in buy")
  const user = await User.findById(req.user._id);
  if (user.role === "admin")
    return next(new ErrorHandler("Admin can't buy subscription", 400));

  user.subscription.status = "active";

  await user.save();

  res.status(201).json({
    success: true,
    message: "subscribed successfully"
  });
});
