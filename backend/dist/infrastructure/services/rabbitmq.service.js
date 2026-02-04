"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RabbitMQService = void 0;
//import amqp, { Connection as AmqpConnection, Channel } from 'amqplib';
const amqplib_1 = __importDefault(require("amqplib"));
class RabbitMQService {
    constructor() {
        this.connection = null;
        this.channel = null;
        // Default to localhost if not set in env
        const host = process.env.RABBITMQ_HOST || 'rabbitmq';
        const port = process.env.RABBITMQ_PORT || '5672';
        if (!process.env.RABBITMQ_HOST) {
            console.warn('⚠️  RABBITMQ_HOST not set. Defaulting to "rabbitmq". If running locally, ensure this environment variable is set to "localhost".');
        }
        this.url = `amqp://${process.env.RABBITMQ_USER}:${process.env.RABBITMQ_PASS}@${host}:${port}`;
    }
    async connect() {
        let retries = 5;
        while (retries) {
            try {
                // Mask password in logs for security
                const maskedUrl = this.url.replace(/:([^:@]+)@/, ':*****@');
                console.log(`Connecting to RabbitMQ at ${maskedUrl}`);
                this.connection = await amqplib_1.default.connect(this.url);
                this.channel = await this.connection.createChannel();
                console.log('✅ RabbitMQ Connected');
                return;
            }
            catch (error) {
                console.error(`❌ RabbitMQ Connection Failed. Retries left: ${retries - 1}`, error);
                retries -= 1;
                if (retries === 0) {
                    throw new Error('Could not connect to RabbitMQ after multiple attempts');
                }
                await new Promise(res => setTimeout(res, 5000));
            }
        }
    }
    async publish(queue, message) {
        if (!this.channel) {
            console.warn('RabbitMQ channel not ready, message dropped:', message);
            return;
        }
        await this.channel.assertQueue(queue, { durable: true });
        this.channel.sendToQueue(queue, Buffer.from(JSON.stringify(message)));
        console.log(`📨 Message sent to ${queue}`);
    }
    async subscribe(queue, callback) {
        if (!this.channel) {
            await this.connect();
        }
        if (!this.channel)
            return;
        await this.channel.assertQueue(queue, { durable: true });
        this.channel.consume(queue, async (msg) => {
            if (msg) {
                try {
                    const content = JSON.parse(msg.content.toString());
                    await callback(content);
                    this.channel?.ack(msg);
                }
                catch (error) {
                    console.error('Error processing message:', error);
                    // Decide whether to nack or just log. For query update, maybe logging is enough for now.
                    // this.channel?.nack(msg);
                }
            }
        });
        console.log(`🎧 Subscribed to ${queue}`);
    }
}
exports.RabbitMQService = RabbitMQService;
