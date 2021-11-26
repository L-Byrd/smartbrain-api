import redis from 'redis';

//setup redis client
const redisClient = redis.createClient(process.env.REDIS_URI);

export default redisClient;