const { createLogger, format, transports } = require('winston');
const { combine, timestamp, label, printf } = format;

type logType = 'info' | 'error'

const customFormat = printf(({ level, message, label, timestamp } : { level: logType, message: string, label: string, timestamp: string } ) => {
    return `${timestamp} : [${label}] : ${level}: ${message}`;
})

const logger = createLogger({
    level: 'info',

    format: combine(
        label({ label: 'my-app' }),
        timestamp({ format: 'YYYY-MM-DD HH:mm:ss'}),
        customFormat
    ),

    transports: [
        new transports.Console(),
        new transports.File({ filename: 'error.log', level: 'error' }),
        new transports.File({ filename: 'combined.log' })]
})

export default logger;