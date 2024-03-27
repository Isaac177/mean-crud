import bcrypt from 'bcrypt';


const saltRounds = 10;

export let hashPassword = async (password: string): Promise<string> => {
    return await bcrypt.hash(password, saltRounds);
}

export const comparePassword = async (password: string, hash: string): Promise<boolean> => {
    return await bcrypt.compare(password, hash);
}
