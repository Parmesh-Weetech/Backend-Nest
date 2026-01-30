// create-notification.dto.ts
export class CreateNotificationDto {
    senderId: string;
    receiverId: string;
    message: string;

    date: string;     // "2026-01-30"
    time: string;     // "17:30"
    timezone: string; // "Asia/Kolkata"
}
