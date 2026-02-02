#
- request
- server
    - controller
    - service
    - enqueue job { delay }
    - return { job: pending }
- processor
    - listen for jobs
    - process jobs
    - repository
    - db operation
    NOTE: processors should be idempotent where possible