import { Router } from 'express';
import {
    createEmployee,
    deleteEmployeeById,
    getEmployeeById,
    getEmployees,
    updateEmployeeById
} from "../controllers/employeeController";

const router = Router();

router.get('/employees', getEmployees);
router.post('/employees', createEmployee);
router.get('/employees/:employeeId', getEmployeeById);
router.put('/employees/:employeeId', updateEmployeeById);
router.delete('/employees/:employeeId', deleteEmployeeById);

export default router;