describe('Parallel test check', () => {
    it('prints worker ID', async () => {
        console.log(`Running test in worker: ${process.env.JEST_WORKER_ID}`);
        await new Promise(res => setTimeout(res, 2000)); // simulate long test
    });
});
