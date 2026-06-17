const axios = require('axios');

async function testLogin() {
  try {
    const res = await axios.post('http://localhost:5000/api/login', {
      username: 'manajemen',
      password: 'password123'
    });
    console.log('Login success:', res.data.username);
  } catch (err) {
    if (err.response) {
      console.error('Login failed:', err.response.data);
    } else {
      console.error('Connection failed:', err.message);
    }
  }
}

testLogin();
