import express from 'express';
import {getAllProjects} from '../controllers/projects.controller.js';
const router = express.Router();

router.get('/',getAllProjects)

export default router;