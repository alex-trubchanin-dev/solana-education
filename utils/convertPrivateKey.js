import bs58 from 'bs58';
// import secret from '../secret.json' assert { type: 'json' };
import secret from '../spl_nft_manager/secret.json' assert { type: 'json' };

const privateKeyArray = secret;

// Преобразование в base58 строку
const privateKey = bs58.encode(Buffer.from(privateKeyArray));
console.log('Base58 Private Key:', privateKey);
