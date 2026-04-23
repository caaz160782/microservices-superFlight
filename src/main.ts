import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { AllExceptionFilter } from './common/filters/http-exception.filter';
import { TimeOutInterceptor } from './common/interceptors/timeout.interceptor';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalFilters(new AllExceptionFilter());
  app.useGlobalInterceptors(new TimeOutInterceptor());

  // 🔥 Configuración Swagger
  const config = new DocumentBuilder()
    .setTitle('API  SUPER FLIGHT MICRO')
    .setDescription('Documentación de la API DE VUELOS')
    .setVersion('2.0')
    .build();

  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('/api/docs', app, document, {
    swaggerOptions: { filter: true },
  });
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
