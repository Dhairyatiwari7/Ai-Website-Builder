import express from 'express'
import { deleteProject, getProjectById, getProjectPreview, getPublishedProjects, makeRevision, rollbackToPreviousVersion, saveProjectCode } from '../controllers/projectController.js'
import { protect } from '../middlewares/auth.js'

const projectRouter=express.Router()

projectRouter.post('/revision/:projectId',protect,makeRevision)
projectRouter.get('/rollback/:projectId/:versionId',protect,rollbackToPreviousVersion)
projectRouter.put('/save/:projectId',protect,saveProjectCode)
projectRouter.delete('/:projectId',protect,deleteProject)
projectRouter.get('/preview/:projectId',protect,getProjectPreview)
projectRouter.get('/published',getPublishedProjects)
projectRouter.get('/published/:projectId',getProjectById)



export default projectRouter