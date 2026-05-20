import userModel from "../models/userModel.js";
import jwt from "jsonwebtoken"
import bcrypt from "bcrypt"
import validator from "validator"
import nodemailer from "nodemailer"

const generateOtp = () => Math.floor(100000 + Math.random() * 900000).toString()

const isEmailDevMode = () => process.env.EMAIL_DEV_MODE === "true"

const logOtpToConsole = (email, otp) => {
  console.warn("⚠️ OTP logged to console (email not sent via SMTP)")
  console.log("📧 Recipient:", email)
  console.log("🔐 OTP Code:", otp)
  console.log("⏰ Expires in 10 minutes")
}

const isSmtpAuthError = (error) =>
  error?.code === "EAUTH" || /535|BadCredentials|not accepted/i.test(error?.message || "")

const createEmailTransporter = () => {
  const auth = {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  }
  const isGmail =
    process.env.EMAIL_HOST === "smtp.gmail.com" ||
    process.env.EMAIL_USER?.endsWith("@gmail.com")

  if (isGmail) {
    return nodemailer.createTransport({ service: "gmail", auth })
  }

  return nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: Number(process.env.EMAIL_PORT) || 587,
    secure: Number(process.env.EMAIL_PORT) === 465,
    auth,
  })
}

const getEmailFrom = () => {
  const from = process.env.EMAIL_FROM?.trim()
  // Use full "Name <email>" string from .env when set (Gmail display name)
  if (from?.includes("<") && from.includes(">")) {
    return from
  }
  return {
    name: process.env.EMAIL_FROM_NAME || "Feastly",
    address: from || process.env.EMAIL_USER,
  }
}

const buildOtpEmailHtml = (otp) => {
  const brand = process.env.EMAIL_FROM_NAME || "Feastly"
  return `
    <!DOCTYPE html>
    <html>
      <body style="margin:0;padding:0;background:#f5f5f5;font-family:Arial,sans-serif;">
        <table width="100%" cellpadding="0" cellspacing="0" style="background:#f5f5f5;padding:32px 16px;">
          <tr>
            <td align="center">
              <table width="100%" cellpadding="0" cellspacing="0" style="max-width:520px;background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08);">
                <tr>
                  <td style="background:linear-gradient(135deg,#ff6b35,#f7931e);padding:28px 32px;text-align:center;">
                    <h1 style="margin:0;color:#ffffff;font-size:32px;font-weight:800;letter-spacing:-1px;">${brand} 🍴</h1>
                  </td>
                </tr>
                <tr>
                  <td style="padding:32px;">
                    <h2 style="margin:0 0 12px;color:#333;font-size:20px;">Password Reset</h2>
                    <p style="margin:0 0 24px;color:#666;font-size:15px;line-height:1.6;">
                      Use the code below to reset your password. It expires in 10 minutes.
                    </p>
                    <div style="background:#fff4f2;border:2px dashed #ff6b35;border-radius:8px;padding:20px;text-align:center;margin-bottom:24px;">
                      <span style="font-size:32px;font-weight:700;letter-spacing:8px;color:#ff6b35;">${otp}</span>
                    </div>
                    <p style="margin:0;color:#999;font-size:13px;">
                      If you did not request this, you can safely ignore this email.
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </body>
    </html>
  `
}

const sendOtpEmail = async (email, otp) => {
  if (isEmailDevMode() || !process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    logOtpToConsole(email, otp)
    return
  }

  const from = getEmailFrom()
  const brand =
    (typeof from === "string"
      ? from.match(/^"?([^"<]+)"?\s*</)?.[1]
      : from.name) || "Feastly"
  const htmlContent = buildOtpEmailHtml(otp)

  try {
    const transporter = createEmailTransporter()
    await transporter.sendMail({
      from,
      to: email,
      subject: `${brand} - Password Reset OTP`,
      text: `${brand}: Your password reset OTP is ${otp}. It expires in 10 minutes.`,
      html: htmlContent,
    })
    console.log("✅ OTP email sent successfully to:", email)
  } catch (error) {
    if (isSmtpAuthError(error) && process.env.NODE_ENV !== "production") {
      console.warn(
        "⚠️ Gmail login failed — using console OTP. Generate a new App Password at https://myaccount.google.com/apppasswords or set EMAIL_DEV_MODE=true"
      )
      logOtpToConsole(email, otp)
      return
    }
    console.error("❌ Email sending error:", error.message)
    throw new Error(`Failed to send OTP email: ${error.message}`)
  }
}

// login user
const loginUser = async (req,res) => {
    const{email, password} = req.body
    try{
        const user = await userModel.findOne({email})

        if (!user) {
            return res.json({success:false, message:"User does not exist"})
        }

        const isMatched = await bcrypt.compare(password,user.password)

        if (!isMatched) {
            return res.json({success:false, message:"Invalid credentials"})
        }

        const token = createToken(user._id)
        res.json({success:true, token, userName: user.name, userEmail: user.email, isAdmin: user.isAdmin || false})

    } catch(error){
        console.log(error)
        res.json({success:false, message:'Error'})
    }
}

const createToken = (id) => {
    return jwt.sign({id},process.env.JWT_SECRET)
}

// register user 
const registerUser = async (req,res) => {
    const {name,password,email} = req.body
    try{
        // checking if user already exists
        const exists = await userModel.findOne({email})
        if (exists) {
            return res.json({success:false,message:"User already exists"})
        }

        // validating email format & strong password
        if (!validator.isEmail(email)) {
            return res.json({success:false,message:"Please enter a valid email"})
        }

        if (password.length<8) {
            return res.json({success:false,message:"Please enter a strong password"})
        }

        // hashing user password
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password,salt)

        const newUser = new userModel({
            name:name,
            email:email,
            password: hashedPassword
        })

        const user = await newUser.save()
        const token = createToken(user._id)
        res.json({success:true, token, userName: user.name, userEmail: user.email, isAdmin: user.isAdmin || false})
    }catch(error){
        console.log(error)
        res.json({success:false, message:"Error"})
    }
}

// get user profile
const getUserProfile = async (req,res) => {
    try {
        const token = req.headers.authorization?.split(" ")[1];
        if (!token) {
            return res.json({success: false, message: "Not authorized"});
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await userModel.findById(decoded.id).select("-password");

        if (!user) {
            return res.json({success: false, message: "User not found"});
        }

        res.json({success: true, data: user});
    } catch (error) {
        console.log(error);
        res.json({success: false, message: "Error"});
    }
}

const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body
        const user = await userModel.findOne({ email })
        if (!user) {
            return res.json({ success: false, message: "No account is registered with this email" })
        }

        const otp = generateOtp()
        const hashedOtp = await bcrypt.hash(otp, 10)

        user.resetOtp = hashedOtp
        user.resetOtpExpiry = Date.now() + 10 * 60 * 1000
        await user.save()

        try {
            await sendOtpEmail(email, otp)
        } catch (emailError) {
            console.error("Error sending OTP email:", emailError.message)
            // Still allow the process to continue, but inform the user
            return res.json({ success: false, message: "Failed to send OTP email. Please check your email configuration." })
        }

        res.json({ success: true, message: "OTP sent to your email" })
    } catch (error) {
        console.log(error)
        res.json({ success: false, message: "Error sending OTP" })
    }
}

const resetPassword = async (req, res) => {
    try {
        const { email, otp, newPassword } = req.body
        const user = await userModel.findOne({ email })

        if (!user || !user.resetOtp || !user.resetOtpExpiry) {
            return res.json({ success: false, message: "Invalid or expired OTP" })
        }

        if (user.resetOtpExpiry < Date.now()) {
            return res.json({ success: false, message: "OTP expired" })
        }

        const isValidOtp = await bcrypt.compare(otp, user.resetOtp)
        if (!isValidOtp) {
            return res.json({ success: false, message: "Invalid OTP" })
        }

        if (!newPassword || newPassword.length < 8) {
            return res.json({ success: false, message: "Password must be at least 8 characters" })
        }

        user.password = await bcrypt.hash(newPassword, 10)
        user.resetOtp = undefined
        user.resetOtpExpiry = undefined
        await user.save()

        res.json({ success: true, message: "Password reset successful" })
    } catch (error) {
        console.log(error)
        res.json({ success: false, message: "Error resetting password" })
    }
}

export {loginUser, registerUser, forgotPassword, resetPassword, getUserProfile}
