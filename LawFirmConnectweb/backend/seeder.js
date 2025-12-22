const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcrypt');
const User = require('./src/models/User');
const Case = require('./src/models/Case');
const Booking = require('./src/models/Booking');
const Message = require('./src/models/Message');

dotenv.config();

mongoose.connect(process.env.MONGO_URI);

const seedData = async () => {
    try {
        await User.deleteMany();
        await Case.deleteMany();
        await Booking.deleteMany();
        await Message.deleteMany();

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash('password123', salt);

        // Create Lawyer
        const lawyer = await User.create({
            firstName: 'Marcus',
            lastName: 'Thorne',
            email: 'lawyer@example.com',
            phone: '555-0101',
            password: 'password123', // manually setting it, but pre-save might re-hash if not careful? No, we used create which triggers save. 
            // Wait, if I pass a hashed password to create, and pre-save hashes it AGAIN?
            // Yes, userSchema pre-save checks isModified.
            // So better to pass plain text.
            role: 'lawyer',
            status: 'VERIFIED'
        });

        // Create Client (Demo User)
        const client = await User.create({
            firstName: 'Sarah',
            lastName: 'Jenkins',
            email: 'client@example.com',
            phone: '555-0202',
            password: 'password123',
            role: 'client',
            status: 'VERIFIED'
        });

        // Create Cases
        await Case.create([
            {
                title: 'Estate Planning - Jenkins Family',
                description: 'Drafting of Last Will and Testament and Trust formation.',
                status: 'Open',
                clientId: client._id,
                lawyerId: lawyer._id
            },
            {
                title: 'Property Dispute - 124 Oak St',
                description: 'Boundary dispute with neighbor pending mediation.',
                status: 'In Progress',
                clientId: client._id,
                lawyerId: lawyer._id
            }
        ]);

        // Create Bookings
        const nextWeek = new Date();
        nextWeek.setDate(nextWeek.getDate() + 7);
        nextWeek.setHours(10, 0, 0, 0);

        await Booking.create({
            lawyerId: lawyer._id,
            clientId: client._id,
            date: nextWeek,
            status: 'Confirmed',
            notes: 'Review Draft Documents'
        });

        // Create Messages
        await Message.create({
            senderId: lawyer._id,
            receiverId: client._id,
            content: 'Hello Sarah, I have uploaded the initial drafts. Please review them.',
            read: false
        });

        console.log('Data Seeded Successfully');
        console.log('Client Credentials: client@example.com / password123');
        process.exit();
    } catch (error) {
        console.error('Error seeding data:', error);
        process.exit(1);
    }
};

seedData();
