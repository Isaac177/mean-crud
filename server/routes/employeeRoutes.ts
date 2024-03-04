import { Router } from 'express';

import parser from "../cloudinaryConfig";
import {
    createEmployee,
    deleteEmployeeById,
    getEmployeeById,
    getEmployees,
    updateEmployeeById
} from "../controllers/employeeController";
import upload from "../cloudinaryConfig";

const router = Router();

router.get('/employees', getEmployees);
router.post('/employees', createEmployee);
router.get('/employees/:employeeId', getEmployeeById);
router.put('/employees/:employeeId',upload,  updateEmployeeById);
router.delete('/employees/:employeeId', deleteEmployeeById);

export default router;