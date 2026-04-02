const Admin = require('./models/Admin');

const createInitialAdmin = async () => {
  try {
    const exists = await Admin.adminExists();
    
    if (!exists) {
      await Admin.create({
        username: 'admin',
        password: 'admin123'
      });
      console.log('✅ Admin account created successfully!');
      console.log('📝 Username: admin');
      console.log('🔑 Password: admin123');
    } else {
      console.log('ℹ️ Admin account already exists');
    }
  } catch (error) {
    console.error('Error creating admin:', error.message);
  }
};