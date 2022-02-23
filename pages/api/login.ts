import { NextApiRequest, NextApiResponse } from 'next';

// * Given a wallet address and signed message, verifies that wallet is proper signer and returns JWT

export default function(req: NextApiRequest, res: NextApiResponse) {
    
    res.status(200).send('Hello World!')
};