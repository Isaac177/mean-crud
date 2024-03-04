
import { Request, Response } from "express";
import NodeCache from "node-cache";
import Employee from "../models/EmployeeModel";

const cache = new NodeCache();


export const createEmployee = async (req: Request, res: Response) => {
    try {
        const { name, position, department } = req.body;
        const employee = new Employee({ name, position, department });
        await employee.save();

        cache.del('employees');

        res.status(201).json({
            message: 'Employee created successfully',
            employee
        });
    } catch (error: any) {
        console.error('Failed to create employee:', error);
        res.status(500).json({
            message: 'Internal Server Error',
            error: error.message
        });
    }
};

// Get all employees


export const getEmployees = async (req: Request, res: Response) => {
    try {
        const cacheKey = 'employees';
        const cachedEmployees = cache.get(cacheKey);

        if (cachedEmployees) {
            console.log('Data retrieved from cache');
            return res.status(200).json({
                employees: cachedEmployees
            });
        }

        const employees = await Employee.find();
        cache.set(cacheKey, employees);
        console.log('Data fetched from database');

        res.status(200).json({
            employees
        });
    } catch (error: any) {
        console.error('Failed to retrieve employees:', error);
        res.status(500).json({
            message: 'Internal Server Error',
            error: error.message
        });
    }
};

// Get employee by id

export const getEmployeeById = async (req: Request, res: Response) => {
    try {
        const employeeId = req.params.employeeId;
        const cacheKey = `employee-${employeeId}`;
        const cachedEmployee = cache.get(cacheKey);

        if (cachedEmployee) {
            return res.status(200).json(cachedEmployee);
        }

        const employee = await Employee.findById(employeeId);
        if (!employee) {
            return res.status(404).json({
                message: `Employee with id ${employeeId} not found`
            });
        }

        cache.set(cacheKey, employee);
        res.status(200).json(employee);
    } catch (error: any) {
        console.error('Failed to retrieve employee:', error);
        res.status(500).json({
            message: 'Internal Server Error',
            error: error.message
        });
    }
};

// Update employee by id

export const updateEmployeeById = async (req: Request, res: Response) => {
    try {
        const employeeId = req.params.employeeId;
        const { name, position, department } = req.body;

        let imageUrl;

        if (req.file && req.file.path) {
            imageUrl = req.file.path;
        }
            console.log('Image URL:', imageUrl)

        const employee = await Employee.findByIdAndUpdate(
            employeeId,
            { name, position, department, imageUrl },
            { new: true }
        );

        if (!employee) {
            return res.status(404).json({
                message: `Employee with id ${employeeId} not found`,
            });
        }

        cache.del('employees');
        cache.del(`employee-${employeeId}`);

        res.status(200).json({
            message: 'Employee updated successfully',
            employee,
        });
    } catch (error: any) {
        console.error('Failed to update employee:', error);
        res.status(500).json({
            message: 'Internal Server Error',
            error: error.message,
        });
    }
};

// Delete employee by id

export const deleteEmployeeById = async (req: Request, res: Response): Promise<any> => {
    try {
        const employeeId = req.params.employeeId;
        const employee = await Employee.findByIdAndDelete(employeeId);
        if (!employee) {
            return res.status(404).json({
                message: `Employee with id ${employeeId} not found`
            });
        }

        cache.del('employees');
        cache.del(`employee-${employeeId}`);

        res.status(200).json({
            message: 'Employee deleted successfully',
            employee
        });
    } catch (error: any) {
        console.error('Failed to delete employee:', error);
        res.status(500).json({
            message: 'Internal Server Error',
            error: error.message
        });
    }
};