describe('App Tests', () => {
    it('long running test', async () => {
        console.log(`App test START - worker ${process.env.JEST_WORKER_ID}`);
        await new Promise((resolve) => setTimeout(resolve, 2000)); // 5 sec delay
        console.log(`App test END - worker ${process.env.JEST_WORKER_ID}`);
    });
});
