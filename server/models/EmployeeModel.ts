import mongoose, { Schema, Document } from 'mongoose';

interface IEmployee extends Document {
    name: string;
    position: string;
    department: string;
}

const EmployeeSchema: Schema = new Schema({
    name: { type: String, required: true },
    position: { type: String, required: true },
    department: { type: String, required: true },
});

const Employee = mongoose.model<IEmployee>('Employee', EmployeeSchema);

export default Employee;
