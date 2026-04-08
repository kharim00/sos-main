import User from "../models/users.js";
import bcrypt from 'bcrypt'

export const seedUsers=async()=>{
    try {
        // Check if users already exist
        const existingUsers = await User.count();
        if (existingUsers > 0) {
            console.log("Users already seeded. Skipping...");
            return;
        }

        const hashPassword=await bcrypt.hash('defaultPassword123',10)
        const users = [
          {
            fullName: 'SHEMA',
            email: 'shema@gmail.com',
            phoneNUmber: '038373737373',
            gender: 'male',
            role: 'patient',
            status: 'active',
            date_of_birth: '2005-02-12',
            location: 'muhanga',
            emergency_contact: '02933838383',
            password: hashPassword,
          },
          {
            fullName: 'ILONA',
            email: 'ilona@gmail.com',
            phoneNUmber: '038345678677373',
            gender: 'female',
            role: 'patient',
            status: 'active',
            date_of_birth: '2006-02-12',
            location: 'kigali',
            emergency_contact: '02936638383',
            password: hashPassword,
          },
          {
            fullName: 'Dr. Kay Uwera',
            email: 'dr.kay@gmail.com',
            phoneNUmber: '0781234567',
            gender: 'female',
            role: 'doctor',
            status: 'active',
            date_of_birth: '1990-08-27',
            location: 'kigali',
            emergency_contact: '0787654321',
            password: hashPassword,
          },
          {
            fullName: 'Admin User',
            email: 'admin@gmail.com',
            phoneNUmber: '0780001112',
            gender: 'others',
            role: 'admin',
            status: 'active',
            date_of_birth: '1990-01-01',
            location: 'kigali',
            emergency_contact: '0780001113',
            password: hashPassword,
          },
        ];

        await User.bulkCreate(users);
        console.log("Users seeded successfully");
    } catch (error) {
        console.error("Error seeding users:", error.message);
        throw error;
    }
}