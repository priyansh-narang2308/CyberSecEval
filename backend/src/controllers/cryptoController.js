import { getPublicKey } from '../utils/cryptoUtils.js';

// @route   GET /api/crypto/public-key
// @access  Public
export const getRSAPublicKey = (req, res) => {
    try {
        const publicKey = getPublicKey();
        res.status(200).json({ 
            publicKey,
            format: 'PEM',
            type: 'RSA-2048' 
        });
    } catch (error) {
        console.error('Error fetching public key:', error);
        res.status(500).json({ message: 'Error retrieving public key' });
    }
};
