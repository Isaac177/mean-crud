"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteEmployeeById = exports.updateEmployeeById = exports.getEmployeeById = exports.getEmployees = exports.createEmployee = void 0;
const EmployeeModel_1 = __importDefault(require("./EmployeeModel"));
const createEmployee = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, position, department } = req.body;
        const employee = new EmployeeModel_1.default({ name, position, department });
        yield employee.save();
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
});
exports.createEmployee = createEmployee;
// Get all employees
const getEmployees = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const employees = yield EmployeeModel_1.default.find();
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
});
exports.getEmployees = getEmployees;
// Get employee by id
const getEmployeeById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const employeeId = req.params.employeeId;
        const employee = yield EmployeeModel_1.default.findById(employeeId);
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
});
exports.getEmployeeById = getEmployeeById;
// Update employee by id
const updateEmployeeById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const employeeId = req.params.employeeId;
        const { name, position, department } = req.body;
        const employee = yield EmployeeModel_1.default.findByIdAndUpdate(employeeId, { name, position, department }, { new: true });
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
});
exports.updateEmployeeById = updateEmployeeById;
// Delete employee by id
const deleteEmployeeById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const employeeId = req.params.employeeId;
        const employee = yield EmployeeModel_1.default.findByIdAndDelete(employeeId);
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
});
exports.deleteEmployeeById = deleteEmployeeById;
