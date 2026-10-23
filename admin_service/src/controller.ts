import 'dotenv/config'
import type { Request } from "express";
import { v2 as cloudinary } from 'cloudinary'
import TryCatch from "./TryCatch.js";
import getBuffer from "./config/dataUri.js";
import { sql } from "./config/db.js";

const cloudName = process.env.Cloud_Name;
const apiKey = process.env.Cloud_Api_Key;
const apiSecret = process.env.Cloud_Api_Secret;

if (!cloudName || !apiKey || !apiSecret) {
    throw new Error("Cloudinary environment variables are missing");
}

cloudinary.config({
    cloud_name: cloudName,
    api_key: apiKey,
    api_secret: apiSecret,
});
interface AuthenticateRequesrt extends Request {
    user?: {
        _id: string;
        role: string
    }
}



export const addAlbume = TryCatch(async (req: AuthenticateRequesrt, res) => {
    if (req.user?.role !== 'admin') {
        res.status(403).json({ message: 'شما دسترسی ادمین ندارید' })
        return
    }

    const { title, description } = req.body
    const file = req.file

    if (!file) {
        res.status(400).json({ message: 'فایلی برای آپلود ارسال نشده است' })
        return
    }

    const fileBuffer = getBuffer(file)

    if (!fileBuffer) {
        res.status(500).json({ message: 'Failed to generate file buffer' })
        return
    }

    const cloud = await cloudinary.uploader.upload(fileBuffer, {
        folder: 'albums'
    })

    const result = await sql`
        INSERT INTO albums (title, description, thumbnail)
        VALUES (${title}, ${description}, ${cloud.secure_url})
        RETURNING *
    `

    res.json({
        message: 'آلبوم با موفقیت ساخته شد',
        album: result[0]
    })
})




export const addSong = TryCatch(async (req: AuthenticateRequesrt, res) => {
    if (req.user?.role !== 'admin') {
        res.status(403).json({ message: 'شما دسترسی ادمین ندارید' })
        return
    }

    const { title, description, album } = req.body

    const isAlbum = await sql`SELECT * FROM albums WHERE id = ${album}`

    if (isAlbum.length === 0) {
        res.status(404).json({ message: 'آلبومی با این شناسه یافت نشد' })
        return
    }

    const file = req.file

    if (!file) {
        res.status(400).json({ message: 'فایلی برای آپلود ارسال نشده است' })
        return
    }

    const fileBuffer = getBuffer(file)

    if (!fileBuffer) {
        res.status(500).json({ message: 'Failed to generate file buffer' })
        return
    }

    const cloud = await cloudinary.uploader.upload(fileBuffer, {
        folder: 'songs',
        resource_type: 'video'
    })

    const result = await sql`
        INSERT INTO songs (title, description, audio, album_id)
        VALUES (${title}, ${description}, ${cloud.secure_url}, ${album})
        RETURNING *
    `

    res.json({
        message: 'آهنگ با موفقیت اضافه شد',
        song: result[0]
    })
})





export const addThumbnail = TryCatch(async (req: AuthenticateRequesrt, res) => {
    if (req.user?.role !== 'admin') {
        res.status(403).json({ message: 'شما دسترسی ادمین ندارید' })
        return
    }

    const song = await sql`SELECT * FROM songs WHERE id = ${req.params.id as string}`

    if (song.length === 0) {
        res.status(404).json({
            message: 'آهنگی با این شناسه یافت نشد'
        })
        return
    }

    const file = req.file

    if (!file) {
        res.status(400).json({ message: 'فایلی برای آپلود ارسال نشده است' })
        return
    }

    const fileBuffer = getBuffer(file)

    if (!fileBuffer) {
        res.status(500).json({ message: 'Failed to generate file buffer' })
        return
    }

    const cloud = await cloudinary.uploader.upload(fileBuffer)

    const result = await sql`
     UPDATE songs 
     SET thumbnail = ${cloud.secure_url}
     WHERE id = ${req.params.id as string}
     RETURNING *
     `
    res.json({
        message: 'کاور با موفقیت اضافه شد',
        song: result[0]
    })

})





export const deleteAlbume = TryCatch(async (req: AuthenticateRequesrt, res) => {
    if (req.user?.role !== 'admin') {
        res.status(403).json({ message: 'شما دسترسی ادمین ندارید' })
        return
    }

    const { id } = req.params

    const isAlbume = await sql`SELECT * FROM albums WHERE id =${id as string}`

    if (isAlbume.length === 0) {
        res.status(403).json({ message: 'آلبومی بااین شناسه یافت نشد' })
        return
    }

    await sql`DELETE FROM songs WHERE album_id = ${id as string}`

    await sql`DELETE FROM albums WHERE id = ${id as string}`

    res.json({
        message: 'آلبوم با موفقیت حذف شد',
    })

})





export const deleteSong = TryCatch(async (req: AuthenticateRequesrt, res) => {
    if (req.user?.role !== 'admin') {
        res.status(403).json({ message: 'شما دسترسی ادمین ندارید' })
        return
    }

    const { id } = req.params

    const song = await sql`SELECT * FROM songs WHERE id =${id as string}`

    if (song.length === 0) {
        res.status(403).json({ message: 'آهنگی بااین شناسه یافت نشد' })
        return
    }

    await sql`DELETE FROM songs WHERE id = ${id as string}`

    res.json({
        message: 'آهنگ با موفقیت حذف شد',
    })

})