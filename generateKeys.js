const rsa = require('node-rsa');
const fs = require('fs');

const generatePair = () => {
    const key = new rsa().generateKeyPair();
    const publicKey = key.exportKey('public');
    const privateKey = key.exportKey('private');

    fs.writeFileSync(`./security/public.pem`, publicKey, 'utf8');
    fs.writeFileSync(`./security/private.pem`, privateKey, 'utf8');
}

generatePair();