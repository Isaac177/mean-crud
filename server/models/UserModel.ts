import mongoose, { Schema, Document } from 'mongoose';

interface IUser extends Document {
    username: string;
    email: string;
    password: string;
    role: string;
    otp: string;
    otpExpire: Date;
};

const UserSchema: Schema = new Schema({
    username: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    role: { type: String, required: false },
    otp: { type: String, required: false },
    otpExpire: { type: Date, required: false },
});

const User = mongoose.model<IUser>('User', UserSchema);

export default User;