import { User } from '@/models/user';
import config from '@/config';
import mongoose from 'mongoose';

seedDatabase();

async function seedDatabase() {
  console.log('> Seeding database...');

  const client = await mongoose.connect(config.databaseUrl, {
    bufferCommands: false
  });
  await seedDevelopmentUsers();
  await client.disconnect();

  console.log('\n> Database seeded!');
}

async function seedDevelopmentUsers() {
  await insertUser(
    'Admin',
    'admin',
    'admin@admin.com',
    '$2a$04$v0hvAu/y6pJ17LzeCfcKG.rDStO9x5ficm2HTLZIfeDBG8oR/uQXi',
    ['create:session', 'read:session']
  );
  await insertUser(
    'User',
    'user',
    'user@user.com',
    '$2a$04$v0hvAu/y6pJ17LzeCfcKG.rDStO9x5ficm2HTLZIfeDBG8oR/uQXi',
    ['create:session', 'read:session']
  );

  console.log('------------------------------');
  console.log('> You can now Login to Bloob using the following credentials:');
  console.log('> "admin@admin.com" + "password"');
  console.log('> "user@user.com" + "password"');
  console.log('------------------------------');

  async function insertUser(
    name: string,
    username: string,
    email: string,
    passwordHash: string,
    features: Array<string>
  ) {
    const query = new User({
      name,
      username,
      email,
      password: passwordHash,
      features
    });

    await query.save();
  }
}
