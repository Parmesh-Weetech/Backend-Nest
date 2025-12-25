## Folder structure that is recommended by industry
src/
├── app.module.ts
├── main.ts

├── config/
│   ├── database.config.ts
│   ├── app.config.ts
│   └── index.ts

├── common/
│   ├── decorators/
│   ├── guards/
│   ├── interceptors/
│   ├── filters/
│   ├── pipes/
│   ├── constants/
│   └── utils/

├── modules/
│   ├── auth/
│   │   ├── dto/
│   │   ├── strategies/
│   │   ├── auth.controller.ts
│   │   ├── auth.service.ts
│   │   └── auth.module.ts
│   │
│   ├── users/
│   │   ├── dto/
│   │   ├── entities/        ← TypeORM only
│   │   ├── schemas/         ← Mongoose only
│   │   ├── users.controller.ts
│   │   ├── users.service.ts
│   │   └── users.module.ts
│   │
│   └── products/
│       ├── dto/
│       ├── entities/
│       ├── products.controller.ts
│       ├── products.service.ts
│       └── products.module.ts
│
├── database/
│   ├── migrations/          ← SQL only
│   ├── seeds/
│   └── data-source.ts
│
├── health/
│   └── health.module.ts
│
└── shared/
    ├── logger/
    └── mail/
