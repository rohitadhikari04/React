import User from '../models/User.js';

const DEFAULT_USERS = [
  'Rahul','Kamal','Sanak','Aisha','Neha','Vikram','Priya','Aman','Sneha','Rohit'
];

export async function ensureSeedUsers() {
  const count = await User.countDocuments();
  if (count === 0) {
    await User.insertMany(DEFAULT_USERS.map(name => ({ name })));
    console.log('Seeded default users');
  }
}
