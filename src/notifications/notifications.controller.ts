import { Controller, Param, Patch, Post, Req, UseGuards } from '@nestjs/common';
import { HttpAuthGuard } from 'src/auth/guard/auth.guard';
import { NotificationsService } from './notifications.service';

@Controller('notifications')
@UseGuards(HttpAuthGuard)
export class NotificationsController {
    constructor(private readonly notificationService : NotificationsService){}
    @Patch(':id')
    async messageReaded(@Param('id') conversationId : string, @Req() request : Request){
        const userId = request['user'].userId;
        return this.notificationService.updateNotiMess(conversationId,userId);
    }
    
}
