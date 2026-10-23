import express from 'express'
import uploadFile, { isAuth } from './middleware.js'
import { addAlbume, addSong, addThumbnail, deleteAlbume, deleteSong } from './controller.js'

const router = express.Router()




router.post('/album/new',isAuth,uploadFile,addAlbume)
router.post('/song/new', isAuth, uploadFile, addSong)
router.post('/song/:id',isAuth,uploadFile,addThumbnail)
router.delete('/albume/:id',isAuth,deleteAlbume)
router.delete('/song/:id',isAuth,deleteSong)

export default router