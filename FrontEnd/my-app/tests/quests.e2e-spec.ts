import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../src/app.module';
import { QuestsService } from '../src/quests/quests.service';

describe('QuestsController (e2e) — ParseUUIDPipe Validation', () => {
  let app: INestApplication;
  let questsService = { findOne: jest.fn(), update: jest.fn(), remove: jest.fn() };

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(QuestsService)
      .useValue(questsService)
      .compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ transform: true }));
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('GET /quests/:id fails fast with 400 when id is not a UUID', async () => {
    const response = await request(app.getHttpServer())
      .get('/quests/invalid-non-uuid-id')
      .expect(400);

    expect(response.body.message).toContain('Validation failed (uuid is expected)');
    expect(questsService.findOne).not.toHaveBeenCalled();
  });

  it('PATCH /quests/:id fails fast with 400 when id is not a UUID', async () => {
    await request(app.getHttpServer())
      .patch('/quests/12345')
      .send({ title: 'New Title' })
      .expect(400);

    expect(questsService.update).not.toHaveBeenCalled();
  });

  it('DELETE /quests/:id fails fast with 400 when id is not a UUID', async () => {
    await request(app.getHttpServer())
      .delete('/quests/not-a-uuid')
      .expect(400);

    expect(questsService.remove).not.toHaveBeenCalled();
  });
});