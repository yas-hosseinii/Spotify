import { sql } from './config/db.js'
import TryCatch from './TryCatch.js'



export const getAllAlbum = TryCatch(async (req, res) => {
    let albums;

    albums = await sql`SELECT * FROM albums`

    res.json(albums)
})

export const getAllSong = TryCatch(async (req, res) => {
    let songs;

    songs = await sql`SELECT * FROM songs`

    res.json(songs)
})

export const getAllSongOfAlbum = TryCatch(async (req, res) => {
    const { id } = req.params

    let album, songs

    album = await sql`SELECT * FROM albums WHERE id=${id as string}`
    if (album.length === 0) {
        res.status(404).json({
            message: 'آلبومی با این شناسه یافت نشد'
        })
        return
    }

    songs = await sql`SELECT * FROM songs WHERE album_id=${id as string}`
    const response = { songs, album: album[0] }
    res.json(response)
})

export const getSingleSong = TryCatch(async (req, res) => {
    const song = await sql`SELECT * FROM songs WHERE id = ${req.params.id as string}`

    res.json(song[0])
})





