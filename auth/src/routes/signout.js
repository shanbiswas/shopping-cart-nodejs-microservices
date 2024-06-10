import express from 'express';
import Token from '../models/token';

const router = express.Router();

router.post('/api/users/signout', async(req, res) => {
  try {
    const token = await Token.findOne({ token: req.token })
    if (!token) {
        return http.fail({
            message: 'Not found', 
            res
        })
    }
    await token.remove();

    // Publish event to all services

    res.send('Logged out successfuly');
} catch (e) {
    res.send(e.message);
}
});

export {router as signoutRouter};