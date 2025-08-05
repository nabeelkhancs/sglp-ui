import { Dropdown, Button } from "antd";
import { useEffect, useState } from "react";
import { APICalls } from "@/api/api-calls";



const NotificationDropdown = () => {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [items, setItems] = useState<any[]>([]);
  
  // const markAsRead = (notificationId: number) => {
  //   setNotifications(prev => 
  //     prev.map(notif => 
  //       notif.id === notificationId 
  //         ? { ...notif, isRead: true }
  //         : notif
  //     )
  //   );
  //   // Update items
  //   const updatedItems = items.map(item => {
  //     if (item.key === notificationId) {
  //       const notif = notifications.find(n => n.id === notificationId);
  //       if (notif) {
  //         return {
  //           ...item,
  //           label: createNotificationLabel({ ...notif, isRead: true })
  //         };
  //       }
  //     }
  //     return item;
  //   });
  //   setItems(updatedItems);
  // };

  const markAsRead = async (notificationId: number) => { console.log("Marking notification as read:", notificationId);}
  const getNotificationTitle = (notif: any) => {
    switch (notif.type) {
      case 'CREATE_CASE':
        return `New Case Created: ${notif.auditLog?.cpNumber || 'Unknown Case'}`;
      case 'UPDATE_CASE':
        return `Case Updated: ${notif.auditLog?.cpNumber || 'Unknown Case'}`;
      case 'CREATE_COMMITTEE':
        return `New Committee Created`;
      case 'UPDATE_COMMITTEE':
        return `Committee Updated`;
      default:
        return notif.type || 'Notification';
    }
  };

  const getNotificationDescription = (notif: any) => {
    const userName = notif.auditLog?.user?.name || 'Unknown User';
    
    switch (notif.type) {
      case 'CREATE_CASE':
        return `Case ${notif.auditLog?.cpNumber} has been created by ${userName}`;
      case 'UPDATE_CASE':
        return `Case ${notif.auditLog?.cpNumber} has been updated by ${userName}`;
      case 'CREATE_COMMITTEE':
        return `New committee has been created by ${userName}`;
      case 'UPDATE_COMMITTEE':
        return `Committee has been updated by ${userName}`;
      default:
        return 'New notification';
    }
  };

  const createNotificationLabel = (notif: any) => (
    <div style={{ padding: '8px 0', minWidth: '300px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '8px' }}>
        <div style={{ flex: 1 }}>
          <div style={{ fontWeight: 'bold', marginBottom: '4px', color: notif.isRead ? '#666' : '#000' }}>
            {getNotificationTitle(notif)}
          </div>
          <div style={{ fontSize: '12px', color: '#666', marginBottom: '4px' }}>
            {getNotificationDescription(notif)}
          </div>
          <div style={{ fontSize: '11px', color: '#999' }}>
            {new Date(notif.createdAt).toLocaleDateString()}
          </div>
        </div>
        {!notif.isRead && (
          <Button
            type="text"
            size="small"
            onClick={(e) => {
              e.stopPropagation();
              markAsRead(notif.id);
            }}
            style={{ 
              padding: '4px 8px', 
              height: 'auto', 
              minWidth: 'auto',
              fontSize: '10px',
              borderRadius: '4px',
              backgroundColor: '#f0f0f0',
              border: '1px solid #d9d9d9'
            }}
            title="Mark as read"
          >
            Mark as read
          </Button>
        )}
      </div>
    </div>
  );

  useEffect(() => {
    APICalls.getNotifications()
      .then((data) => {
        const records = data?.records || [];
        setNotifications(records);
        console.log("Notifications:", data);
        const res = records.length > 0
          ? records.map((notif: any) => ({
            label: createNotificationLabel(notif),
            key: notif.id,
          }))
          : [{ label: 'No notifications', key: 'none' }];
        setItems(res);
      })
      .catch(() => setNotifications([]));
  }, []);
  return (
    <Dropdown menu={{ items }} trigger={['click']} placement="bottomLeft">
      <a onClick={e => e.preventDefault()}>
        <span>
          <img src="/icons/notification-icon.svg" alt="" />
        </span>
      </a>
    </Dropdown>
  );
}

export default NotificationDropdown;