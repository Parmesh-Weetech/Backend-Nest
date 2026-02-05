export function getTestDbName() {
    return `myapp_unit_test_${process.env.JEST_WORKER_ID || '0'}`;
}
