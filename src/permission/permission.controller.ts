import { Controller, Get, Param, Put, Delete, Body, UseGuards } from '@nestjs/common';
import { PermissionService } from './permission.service';
import { UpdatePermissionDTO } from './dtos/update-permission.dto';
import { Permission } from './entities/permission.entity';
import { AuthGuard } from 'src/common/guards/auth.guard';

@Controller('permissions')
@UseGuards(AuthGuard)
export class PermissionController {
    constructor(private readonly permissionService: PermissionService) { }

    @Get()
    findAll(): Promise<Permission[]> {
        return this.permissionService.findAll();
    }

    @Get(':id')
    findOne(@Param('id') id: string): Promise<Permission> {
        return this.permissionService.findOne(id);
    }

    @Put(':id')
    update(@Param('id') id: string, @Body() dto: UpdatePermissionDTO): Promise<Permission> {
        return this.permissionService.update(id, dto);
    }

    @Delete(':id')
    delete(@Param('id') id: string) {
        return this.permissionService.delete(id);
    }
}
