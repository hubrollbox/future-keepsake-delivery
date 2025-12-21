
import React from "react";
import { formatDistanceToNow } from "date-fns";
import { pt } from "date-fns/locale";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { useNotifications } from "@/hooks/useNotifications";
import { CheckCheck } from "lucide-react";

interface NotificationListProps {
  onClose: () => void;
}

const NotificationList: React.FC<NotificationListProps> = ({ onClose }) => {
  const { notifications, unreadCount, markAsRead, markAllAsRead, loading } = useNotifications();

  const handleNotificationClick = (notificationId: string, isRead: boolean) => {
    if (!isRead) {
      markAsRead(notificationId);
    }
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "delivery":
        return "📦";
      case "payment":
        return "💳";
      case "message":
        return "💌";
      case "system":
        return "⚙️";
      default:
        return "ℹ️";
    }
  };

    if (loading) {
    return (
      <div className="p-4 text-center">
        <p className="text-keepla-gray">A carregar notificações...</p>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="flex items-center justify-between p-4 border-b">
      <h3 className="font-semibold text-keepla-gray-800">Notificações</h3>
        {unreadCount > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={markAllAsRead}
            className="text-xs"
          >
            <CheckCheck className="h-3 w-3 mr-1" />
            Marcar todas como lidas
          </Button>
        )}
      </div>

      <ScrollArea className="h-80">
        {notifications.length === 0 ? (
          <div className="p-4 text-center">
            <p className="text-misty-gray">Nenhuma notificação</p>
          </div>
        ) : (
          <div className="p-2">
            {notifications.map((notification, index) => (
              <div key={notification.id}>
                <div
                  className={`p-3 hover:bg-keepla-gray/50 cursor-pointer rounded-lg transition-colors ${
                    !notification.read_at ? 'bg-keepla-gray/10' : ''
                  }`}
                  onClick={() => handleNotificationClick(notification.id, !!notification.read_at)}
                >
                  <div className="flex items-start space-x-3">
                    <span className="text-lg flex-shrink-0">
                      {getNotificationIcon(notification.type)}
                    </span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <p className="font-medium text-keepla-gray-800 text-sm truncate">
                          {notification.title}
                        </p>
                        {!notification.read_at && (
                          <div className="w-2 h-2 bg-keepla-red rounded-full flex-shrink-0 ml-2" />
                        )}
                      </div>
                      <p className="text-keepla-gray text-xs mt-1 line-clamp-2">
                        {notification.content}
                      </p>
                      <p className="text-keepla-gray text-xs mt-1">
                        {notification.created_at && formatDistanceToNow(
                          new Date(notification.created_at),
                          { addSuffix: true, locale: pt }
                        )}
                      </p>
                    </div>
                  </div>
                </div>
                {index < notifications.length - 1 && <Separator className="my-1" />}
              </div>
            ))}
          </div>
        )}
      </ScrollArea>

      <div className="p-3 border-t">
        <Button
          variant="ghost"
          size="sm"
          onClick={onClose}
          className="w-full text-xs"
        >
          Fechar
        </Button>
      </div>
    </div>
  );
};

export default NotificationList;
