import express from 'express'
import { createNewProject, getUserCredits, getUserProjectById, getUserProjects, purchaseCredits, toggleProjectPublishStatus } from '../controllers/userController.js'
import { protect } from '../middlewares/auth.js'

const userRouter=express.Router()

userRouter.get('/credits',protect,getUserCredits)
userRouter.post('/project',protect,createNewProject)  
userRouter.get('/project/:projectId',protect,getUserProjectById)
userRouter.get('/projects',protect,getUserProjects)
userRouter.patch('/publish-toggle/:projectId',protect,toggleProjectPublishStatus)
userRouter.post('/purchase',protect,purchaseCredits)

export default userRouter