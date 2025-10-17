import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import User from '../models/User.js';

dotenv.config();

const users = [
    {
        name: "Sarah Chen",
        email: "admin@negombo.lk",
        password: "admin123",
        role: "admin",
        phone: "+94771234567",
        address: "Municipal Office, Main Street, Negombo",
        cityId: "negombo-001",
        isActive: true
    },
    {
        name: "Mike Perera",
        email: "mike.p@negombo.lk",
        password: "dispatch123",
        role: "dispatcher",
        phone: "+94772345678",
        address: "123 Beach Road, Negombo",
        cityId: "negombo-001",
        isActive: true
    },
    {
        name: "John Silva",
        email: "john.s@negombo.lk",
        password: "collect123",
        role: "collector",
        phone: "+94774567890",
        address: "78 Church Road, Negombo",
        cityId: "negombo-001",
        isActive: true
    },
    {
        name: "Emma Perera",
        email: "emma.p@gmail.com",
        password: "house123",
        role: "householder",
        phone: "+94779012345",
        address: "45 Beach Road, Zone B, Negombo",
        cityId: "negombo-001",
        isActive: true
    }
];

const seedUsers = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB');

        // Delete existing users
        await User.deleteMany({});
        console.log('Deleted existing users');

        // Hash passwords and create users
        const hashedUsers = await Promise.all(users.map(async (user) => {
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(user.password, salt);
            return { ...user, password: hashedPassword };
        }));

        // Insert users
        await User.insertMany(hashedUsers);
        console.log('Users seeded successfully');

        mongoose.connection.close();
    } catch (error) {
        console.error('Error seeding users:', error);
        process.exit(1);
    }
};

seedUsers();