import type { CalendarEvent } from '../components/SmartCalendar';
import { LocalNotifications } from '@capacitor/local-notifications';

export async function scheduleEventNotifications(events: CalendarEvent[]) {
  // Xin quyền gửi thông báo
  const perm = await LocalNotifications.requestPermissions();
  if (perm.display !== 'granted') return;

  // Xóa các thông báo cũ
  await LocalNotifications.cancel({ notifications: [] });

  const notifications = events.map((event, index) => {
    const [hours, minutes] = event.time.split(':').map(Number);
    const eventDateTime = new Date(event.date);
    eventDateTime.setHours(hours, minutes, 0, 0);

    // Thời gian nhắc trước
    const remindTime = new Date(eventDateTime.getTime() - event.reminder * 60 * 1000);

    return {
      title: event.title,
      body: event.description || '',
      id: index + 1,
      schedule: { at: remindTime },
      sound: 'alarm_sound.mp3', // file âm thanh đặt trong android/app/src/main/res/raw/
      smallIcon: 'ic_stat_icon',
    };
  });

  await LocalNotifications.schedule({ notifications });
}
