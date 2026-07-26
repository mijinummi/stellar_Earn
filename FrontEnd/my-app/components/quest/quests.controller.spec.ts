import { Test, TestingModule } from '@nestjs/testing';
import { QuestsController } from './quests.controller';
import { QuestsService } from './quests.service';
import { BadRequestException } from '@nestjs/common';

describe('QuestsController — Route Parameter Validation', () => {
  let controller: QuestsController;
  let service: jest.Mocked<QuestsService>;

  beforeEach(async () => {
    const mockService = {
      create: jest.fn(),
      findAll: jest.fn(),
      findOne: jest.fn(),
      update: jest.fn(),
      remove: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [QuestsController],
      providers: [
        {
          provide: QuestsService,
          useValue: mockService,
        },
      ],
    }).compile();

    controller = module.get<QuestsController>(QuestsController);
    service = module.get(QuestsService);
  });

  const validUuid = '123e4567-e89b-12d3-a456-426614174000';

  describe('findOne', () => {
    it('delegates to QuestsService when a valid UUID is provided', async () => {
      service.findOne.mockResolvedValue({ id: validUuid, title: 'Sample Quest' } as any);

      const result = await controller.findOne(validUuid);

      expect(result).toEqual({ id: validUuid, title: 'Sample Quest' });
      expect(service.findOne).toHaveBeenCalledWith(validUuid);
    });
  });

  describe('update', () => {
    it('delegates to QuestsService when a valid UUID is provided', async () => {
      const updateDto = { title: 'Updated Title' };
      service.update.mockResolvedValue({ id: validUuid, ...updateDto } as any);

      const result = await controller.update(validUuid, updateDto);

      expect(result).toEqual({ id: validUuid, ...updateDto });
      expect(service.update).toHaveBeenCalledWith(validUuid, updateDto);
    });
  });

  describe('remove', () => {
    it('delegates to QuestsService when a valid UUID is provided', async () => {
      service.remove.mockResolvedValue({ success: true } as any);

      const result = await controller.remove(validUuid);

      expect(result).toEqual({ success: true });
      expect(service.remove).toHaveBeenCalledWith(validUuid);
    });
  });
});