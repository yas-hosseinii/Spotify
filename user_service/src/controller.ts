import TryCatch from "./TryCatch.js";
import type { AuthenticatedRequest } from "./middleware.js";
import { User } from "./models.js";
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'




export const registerUser = TryCatch(async (req, res) => {
    const { name, email, password } = req.body

    let user = await User.findOne({ email })

    if (user) {
        res.status(400).json({ message: 'کاربری با این مشخصات قبلا ثبت نام کرده است' })
        return
    }




    const hashPassword = await bcrypt.hash(password, 10)

    user = await User.create({
        name, email, password: hashPassword
    })

    const JWT_SEC = process.env.JWT_SEC as string

    const token = jwt.sign({ _id: user._id }, JWT_SEC, {
        expiresIn: '7d'
    })

    res.status(201).json({
        message: 'ثبت نام با موفقیت انجام شد',
        user: {
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role
        },
        token
    })

})




export const loginUser = TryCatch(async (req, res) => {
    const { name, email, password } = req.body

     let user = await User.findOne({ email })

    if (!user) {
        res.status(400).json({ message: 'کاربری یافت نشد' })
        return
    }

    const isMatch = await bcrypt.compare(password,user.password)

    if(!isMatch){
         res.status(404).json({ message: 'اطلاعات ورود صحیح نمی باشد' })
        return
    }

    const JWT_SEC = process.env.JWT_SEC as string

    const token = jwt.sign({ _id: user._id }, JWT_SEC, {
        expiresIn: '7d'
    })

      res.status(200).json({
        message: 'ورود شما با موفقیت انجام شد',
        user: {
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role
        },
        token
    })

})





export const myProfile = TryCatch(async (req:AuthenticatedRequest, res) => {
    const user = req.user

    res.json(user)
})