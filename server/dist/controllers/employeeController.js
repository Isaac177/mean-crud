"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteEmployeeById = exports.updateEmployeeById = exports.getEmployeeById = exports.getEmployees = exports.createEmployee = void 0;
const EmployeeModel_1 = __importDefault(require("../models/EmployeeModel"));
const createEmployee = async (req, res) => {
    try {
        const { name, position, department } = req.body;
        const employee = new EmployeeModel_1.default({ name, position, department });
        await employee.save();
        res.status(201).json({
            message: 'Employee created successfully',
            employee
        });
    }
    catch (error) {
        console.error('Failed to create employee:', error);
        res.status(500).json({
            message: 'Internal Server Error',
            error: error.message
        });
    }
};
exports.createEmployee = createEmployee;
// Get all employees
const getEmployees = async (req, res) => {
    try {
        const employees = await EmployeeModel_1.default.find();
        res.status(200).json({
            employees
        });
    }
    catch (error) {
        console.error('Failed to retrieve employees:', error);
        res.status(500).json({
            message: 'Internal Server Error',
            error: error.message
        });
    }
};
exports.getEmployees = getEmployees;
// Get employee by id
const getEmployeeById = async (req, res) => {
    try {
        const employeeId = req.params.employeeId;
        const employee = await EmployeeModel_1.default.findById(employeeId);
        if (!employee) {
            return res.status(404).json({
                message: `Employee with id ${employeeId} not found`
            });
        }
        res.status(200).json(employee);
    }
    catch (error) {
        console.error('Failed to retrieve employee:', error);
        res.status(500).json({
            message: 'Internal Server Error',
            error: error.message
        });
    }
};
exports.getEmployeeById = getEmployeeById;
// Update employee by id
const updateEmployeeById = async (req, res) => {
    try {
        const employeeId = req.params.employeeId;
        const { name, position, department } = req.body;
        const employee = await EmployeeModel_1.default.findByIdAndUpdate(employeeId, { name, position, department }, { new: true });
        if (!employee) {
            return res.status(404).json({
                message: `Employee with id ${employeeId} not found`
            });
        }
        res.status(200).json({
            message: 'Employee updated successfully',
            employee
        });
    }
    catch (error) {
        console.error('Failed to update employee:', error);
        res.status(500).json({
            message: 'Internal Server Error',
            error: error.message
        });
    }
};
exports.updateEmployeeById = updateEmployeeById;
// Delete employee by id
const deleteEmployeeById = async (req, res) => {
    try {
        const employeeId = req.params.employeeId;
        const employee = await EmployeeModel_1.default.findByIdAndDelete(employeeId);
        if (!employee) {
            return res.status(404).json({
                message: `Employee with id ${employeeId} not found`
            });
        }
        res.status(200).json({
            message: 'Employee deleted successfully',
            employee
        });
    }
    catch (error) {
        console.error('Failed to delete employee:', error);
        res.status(500).json({
            message: 'Internal Server Error',
            error: error.message
        });
    }
};
exports.deleteEmployeeById = deleteEmployeeById;
