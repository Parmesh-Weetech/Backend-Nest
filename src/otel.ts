// otel.ts
import 'dotenv/config';

import { NodeSDK } from '@opentelemetry/sdk-node';
import { getNodeAutoInstrumentations } from '@opentelemetry/auto-instrumentations-node';
import { resourceFromAttributes } from '@opentelemetry/resources';
import { SemanticResourceAttributes } from '@opentelemetry/semantic-conventions';
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-http';
import { OTLPMetricExporter } from '@opentelemetry/exporter-metrics-otlp-http';
import { PeriodicExportingMetricReader } from '@opentelemetry/sdk-metrics';
import { OTLPLogExporter } from '@opentelemetry/exporter-logs-otlp-http';
import {
    LoggerProvider,
    BatchLogRecordProcessor,
} from '@opentelemetry/sdk-logs';
import { propagation } from '@opentelemetry/api';
import { W3CTraceContextPropagator } from '@opentelemetry/core';
import { logs } from '@opentelemetry/api-logs';

propagation.setGlobalPropagator(
    new W3CTraceContextPropagator()
);

const traceExporter = new OTLPTraceExporter({
    url: process.env.OTEL_EXPORTER_OTLP_TRACES_ENDPOINT,
});

const metricReader = new PeriodicExportingMetricReader({
    exporter: new OTLPMetricExporter({
        url: process.env.OTEL_EXPORTER_OTLP_METRICS_ENDPOINT,
    }),
    exportIntervalMillis: process.env.NODE_ENV === 'production' ? 60000 : 10000,
});

const logsExporter = new OTLPLogExporter({
    url: process.env.OTEL_EXPORTER_OTLP_LOGS_ENDPOINT
})

const loggerProvider = new LoggerProvider({
    processors: [new BatchLogRecordProcessor(logsExporter)]
});

logs.setGlobalLoggerProvider(loggerProvider);

export const sdk = new NodeSDK({
    resource: resourceFromAttributes({
        [SemanticResourceAttributes.SERVICE_NAME]:
            process.env.OTEL_SERVICE_NAME ?? 'nestjs-backend',

        [SemanticResourceAttributes.SERVICE_VERSION]: '1.0.0',

        [SemanticResourceAttributes.DEPLOYMENT_ENVIRONMENT]:
            process.env.NODE_ENV ?? 'development',
    }),

    traceExporter,
    metricReader,
    instrumentations: [
        getNodeAutoInstrumentations({
            '@opentelemetry/instrumentation-fs': {
                enabled: false, // noise reduction
            },
            '@opentelemetry/instrumentation-dns': { enabled: false },
        }),
    ],
});

sdk.start();

process.on('SIGTERM', async () => {
    await sdk.shutdown();
});

process.on('SIGINT', async () => {
    await sdk.shutdown();
});