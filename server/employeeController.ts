
import { Request, Response } from "express";

import Employee from "./EmployeeModel";

export const createEmployee = async (req: Request, res: Response) => {
    try {
        const { name, position, department } = req.body;
        const employee = new Employee({ name, position, department });
        await employee.save();

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
        const employees = await Employee.find();
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
        const employee = await Employee.findById(employeeId);
        if (!employee) {
            return res.status(404).json({
                message: `Employee with id ${employeeId} not found`
            });
        }
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
        const employee = await Employee.findByIdAndUpdate(employeeId, { name, position, department }, { new: true });
        if (!employee) {
            return res.status(404).json({
                message: `Employee with id ${employeeId} not found`
            });
        }
        res.status(200).json({
            message: 'Employee updated successfully',
            employee
        });
    } catch (error: any) {
        console.error('Failed to update employee:', error);
        res.status(500).json({
            message: 'Internal Server Error',
            error: error.message
        });
    }
};

// Delete employee by id

export const deleteEmployeeById = async (req: Request, res: Response) => {
    try {
        const employeeId = req.params.employeeId;
        const employee = await Employee.findByIdAndDelete(employeeId);
        if (!employee) {
            return res.status(404).json({
                message: `Employee with id ${employeeId} not found`
            });
        }
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