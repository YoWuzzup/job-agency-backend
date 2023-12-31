"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const config_1 = require("@nestjs/config");
const cookieParser = require("cookie-parser");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    const configService = app.get(config_1.ConfigService);
    const PORT = configService.get('PORT') || 5000;
    app.use(cookieParser());
    app.enableCors({
        origin: `${process.env.FRONTEND_URL}`,
        credentials: true,
    });
    await app.listen(PORT, () => console.log(`The server is running on PORT: ${PORT}`));
}
bootstrap();
//# sourceMappingURL=main.js.map