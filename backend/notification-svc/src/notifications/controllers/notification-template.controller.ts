import { Body, Controller, Delete, Get, Param, Post, Query } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { NotificationTemplateService } from '../services/notification-template.service';
import { CreateTemplateDto } from '../dto/create-template.dto';
import { NotificationType } from '../enums/notification.enum';

@ApiTags('Templates de Notificação')
@Controller('notification-templates')
export class NotificationTemplateController {
  constructor(
    private readonly templateService: NotificationTemplateService,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Cria ou atualiza um template de notificação' })
  @ApiResponse({
    status: 201,
    description: 'Template criado/atualizado com sucesso',
  })
  async createTemplate(@Body() data: CreateTemplateDto) {
    await this.templateService.createTemplate(data);
    return {
      status: 'success',
      message: 'Template criado/atualizado com sucesso',
    };
  }

  @Get()
  @ApiOperation({ summary: 'Lista todos os templates de notificação' })
  @ApiResponse({
    status: 200,
    description: 'Templates listados com sucesso',
  })
  async listTemplates(@Query('language') language?: string) {
    const templates = await this.templateService.listTemplates(language);
    return {
      status: 'success',
      data: templates,
    };
  }

  @Get(':type')
  @ApiOperation({ summary: 'Obtém um template específico por tipo' })
  @ApiResponse({
    status: 200,
    description: 'Template encontrado com sucesso',
  })
  async getTemplate(
    @Param('type') type: NotificationType,
    @Query('language') language?: string,
  ) {
    const [template] = await this.templateService.getTemplate(type, language);
    return {
      status: 'success',
      data: template || null,
    };
  }

  @Delete(':type')
  @ApiOperation({ summary: 'Remove um template de notificação' })
  @ApiResponse({
    status: 200,
    description: 'Template removido com sucesso',
  })
  async deleteTemplate(
    @Param('type') type: NotificationType,
    @Query('language') language?: string,
  ) {
    await this.templateService.deleteTemplate(type, language);
    return {
      status: 'success',
      message: 'Template removido com sucesso',
    };
  }

  @Post(':type/render')
  @ApiOperation({ summary: 'Renderiza um template com variáveis' })
  @ApiResponse({
    status: 200,
    description: 'Template renderizado com sucesso',
  })
  async renderTemplate(
    @Param('type') type: NotificationType,
    @Body() variables: Record<string, string | number | boolean>,
    @Query('language') language?: string,
  ) {
    const rendered = await this.templateService.renderTemplate(
      type,
      variables,
      language,
    );
    return {
      status: 'success',
      data: rendered,
    };
  }
} 