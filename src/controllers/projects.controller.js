import { getAllProjectsData } from '../data/projects.data.js';

export const getAllProjects = (req, res) => {
    res.json(getAllProjectsData());
};