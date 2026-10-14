import crypto from 'crypto';

function generateSecret(length = 32) {
  return crypto.randomBytes(length).toString('hex');
}

console.log("Here are your newly generated secure secrets. Copy and paste these into your .env file:\n");
console.log(`JWT_SECRET=${generateSecret()}`);
console.log(`JWT_REFRESH_SECRET=${generateSecret()}`);
console.log(`AADHAR_SALT=${generateSecret()}`);
