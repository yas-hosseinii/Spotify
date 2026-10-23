import express from 'express'
import { getAllAlbum, getAllSong, getAllSongOfAlbum, getSingleSong } from './controllers.js'

const router = express.Router()

router.get('/album/all',getAllAlbum)
router.get('/song/all',getAllSong)
router.get('/album/:id',getAllSongOfAlbum)
router.get('/song/:id',getSingleSong)




export default router