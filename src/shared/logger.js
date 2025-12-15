import { Client } from '@elastic/elasticsearch';
import path from 'path';
import winston, { format } from 'winston';
import DailyRotateFile from 'winston-daily-rotate-file';
import { ElasticsearchTransport } from 'winston-elasticsearch';

const { combine, timestamp, label, prettyPrint, printf } = format;

// Custom log format
const myFormat = printf(({ level, message, label, timestamp }) => {
  return `${timestamp} [${label}] ${level}: ${message}`;
});

// Elasticsearch Client
const esClient = new Client({
  // node: 'http://elasticsearch:9200',
  node: 'http://localhost:9200',
  compatibility: true,
});

// Check connection
esClient
  .ping({}, { requestTimeout: 1000 })
  .then(() => console.log('✅ Connected to Elasticsearch'))
  .catch(err => console.error('❌ Cannot connect to Elasticsearch:', err));

const esTransport = new ElasticsearchTransport({
  level: 'info',
  // clientOpts: { node: 'http://elasticsearch:9200' },
  clientOpts: { node: 'http://localhost:9200' },
  indexPrefix: 'inso-code-logs',
  indexSuffixPattern: 'YYYY-MM-DD',
});

esTransport.on('error', error => {
  console.error('❌ Elasticsearch Transport Error:', error);
});

// Base log format
const baseFormat = combine(
  label({ label: 'INSO Code Service' }),
  timestamp(), // always produces ISO timestamp
  myFormat,
  prettyPrint(),
);

// Success logger
export const logger = winston.createLogger({
  level: 'info',
  format: baseFormat,
  transports: [
    new winston.transports.Console(),

    new DailyRotateFile({
      filename: path.join(
        process.cwd(),
        'logs',
        'successes',
        'RH-%DATE%-success.log',
      ),
      datePattern: 'YYYY-MM-DD-HH',
      zippedArchive: true,
      maxSize: '20m',
      maxFiles: '14d',
    }),

    esTransport,
  ],
});

// Error logger
export const errorlogger = winston.createLogger({
  level: 'error',
  format: baseFormat,
  transports: [
    new winston.transports.Console(),

    new DailyRotateFile({
      filename: path.join(
        process.cwd(),
        'logs',
        'errors',
        'RH-%DATE%-error.log',
      ),
      datePattern: 'YYYY-MM-DD-HH',
      zippedArchive: true,
      maxSize: '20m',
      maxFiles: '14d',
    }),

    esTransport,
  ],
});
