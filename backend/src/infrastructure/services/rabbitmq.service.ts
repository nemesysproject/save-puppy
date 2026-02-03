import amqp, { Connection, Channel } from 'amqplib';

export class RabbitMQService {
    private connection: Connection | null = null;
    private channel: Channel | null = null;
    private readonly url: string;

    constructor() {
        // Default to localhost if not set in env
        this.url = `amqp://${process.env.RABBITMQ_USER}:${process.env.RABBITMQ_PASS}@localhost:5672`;
    }

    async connect(): Promise<void> {
        try {
            console.log(`Connecting to RabbitMQ at ${this.url}`);
            this.connection = await amqp.connect(this.url);
            this.channel = await this.connection.createChannel();
            console.log('✅ RabbitMQ Connected');
        } catch (error) {
            console.error('❌ RabbitMQ Connection Failed:', error);
            // Retry logic could be added here
        }
    }

    async publish(queue: string, message: any): Promise<void> {
        if (!this.channel) {
            console.warn('RabbitMQ channel not ready, message dropped:', message);
            return;
        }

        await this.channel.assertQueue(queue, { durable: true });
        this.channel.sendToQueue(queue, Buffer.from(JSON.stringify(message)));
        console.log(`📨 Message sent to ${queue}`);
    }

    async subscribe(queue: string, callback: (msg: any) => Promise<void>): Promise<void> {
        if (!this.channel) {
            await this.connect();
        }

        if (!this.channel) return;

        await this.channel.assertQueue(queue, { durable: true });

        this.channel.consume(queue, async (msg) => {
            if (msg) {
                try {
                    const content = JSON.parse(msg.content.toString());
                    await callback(content);
                    this.channel?.ack(msg);
                } catch (error) {
                    console.error('Error processing message:', error);
                    // Decide whether to nack or just log. For query update, maybe logging is enough for now.
                    // this.channel?.nack(msg);
                }
            }
        });
        console.log(`🎧 Subscribed to ${queue}`);
    }
}
