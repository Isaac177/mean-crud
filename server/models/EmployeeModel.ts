import mongoose, { Schema, Document } from 'mongoose';

interface IEmployee extends Document {
    name: string;
    position: string;
    department: string;
    imageUrl?: string;
}

const EmployeeSchema: Schema = new Schema({
    name: { type: String, required: true },
    position: { type: String, required: true },
    department: { type: String, required: true },
    imageUrl: { type: String }
});

const Employee = mongoose.model<IEmployee>('Employee', EmployeeSchema);

export default Employee;
