const crypto = require('crypto');

try {
  const randomBytes = crypto.randomBytes(256);
  const base64String = randomBytes.toString('base64');
  console.log(base64String);
} catch (error) {
  console.error('Error generating random bytes:', error);
}
