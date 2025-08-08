import { Dropdown, Button, Checkbox, Divider } from "antd";
import { useEffect, useState } from "react";
import { APICalls } from "@/api/api-calls";



const NotificationDropdown = () => {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [items, setItems] = useState<any[]>([]);
  const [selectedNotifications, setSelectedNotifications] = useState<number[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  
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

  const markAsRead = async (notificationId: number) => {
    try {
      await APICalls.markNotificationAsRead(notificationId);
      // Update local state
      setNotifications(prev => 
        prev.map(notif => 
          notif.id === notificationId 
            ? { ...notif, isRead: true }
            : notif
        )
      );
      console.log("Notification marked as read:", notificationId);
    } catch (error) {
      console.error("Failed to mark notification as read:", error);
    }
  };

  const markAllAsRead = async () => {
    setLoading(true);
    try {
      await APICalls.markAllNotificationsAsRead();
      // Update local state
      setNotifications(prev => 
        prev.map(notif => ({ ...notif, isRead: true }))
      );
      setSelectedNotifications([]);
      console.log("All notifications marked as read");
    } catch (error) {
      console.error("Failed to mark all notifications as read:", error);
    } finally {
      setLoading(false);
    }
  };

  const markSelectedAsRead = async () => {
    if (selectedNotifications.length === 0) return;
    
    setLoading(true);
    try {
      await APICalls.markMultipleNotificationsAsRead(selectedNotifications);
      // Update local state
      setNotifications(prev => 
        prev.map(notif => 
          selectedNotifications.includes(notif.id)
            ? { ...notif, isRead: true }
            : notif
        )
      );
      setSelectedNotifications([]);
      console.log("Selected notifications marked as read:", selectedNotifications);
    } catch (error) {
      console.error("Failed to mark selected notifications as read:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectNotification = (notificationId: number, checked: boolean) => {
    if (checked) {
      setSelectedNotifications(prev => [...prev, notificationId]);
    } else {
      setSelectedNotifications(prev => prev.filter(id => id !== notificationId));
    }
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      const unreadIds = notifications.filter(notif => !notif.isRead).map(notif => notif.id);
      setSelectedNotifications(unreadIds);
    } else {
      setSelectedNotifications([]);
    }
  };
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
    <div 
      style={{ padding: '8px 0', minWidth: '320px' }}
      onClick={(e) => e.stopPropagation()}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '8px' }}>
        <Checkbox
          checked={selectedNotifications.includes(notif.id)}
          onChange={(e) => {
            e.stopPropagation();
            handleSelectNotification(notif.id, e.target.checked);
          }}
          style={{ marginTop: '2px' }}
        />
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
      })
      .catch(() => setNotifications([]));
  }, []);

  useEffect(() => {
    // Regenerate items when notifications change
    const notificationItems = notifications.length > 0
      ? notifications.map((notif: any) => ({
          label: createNotificationLabel(notif),
          key: notif.id,
        }))
      : [{ label: 'No notifications', key: 'none' }];

    // Add footer with controls if there are notifications
    if (notifications.length > 0) {
      const unreadCount = notifications.filter(notif => !notif.isRead).length;
      const footerItem = {
        label: (
          <div 
            style={{ padding: '8px 0', borderTop: '1px solid #f0f0f0', marginTop: '8px' }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '8px' }}>
              <Checkbox
                checked={selectedNotifications.length === unreadCount && unreadCount > 0}
                indeterminate={selectedNotifications.length > 0 && selectedNotifications.length < unreadCount}
                onChange={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  handleSelectAll(e.target.checked);
                }}
                style={{ fontSize: '12px' }}
              >
                Select All
              </Checkbox>
              <div style={{ display: 'flex', gap: '4px' }}>
                {selectedNotifications.length > 0 ? (
                  <Button
                    type="text"
                    size="small"
                    onClick={(e) => {
                      e.stopPropagation();
                      markSelectedAsRead();
                    }}
                    loading={loading}
                    style={{ 
                      fontSize: '10px',
                      padding: '4px 8px',
                      height: 'auto',
                      backgroundColor: '#52c41a',
                      color: 'white'
                    }}
                  >
                    Mark Selected as Read
                  </Button>
                ) : (
                  <Button
                    type="text"
                    size="small"
                    onClick={(e) => {
                      e.stopPropagation();
                      markAllAsRead();
                    }}
                    loading={loading}
                    style={{ 
                      fontSize: '10px',
                      padding: '4px 8px',
                      height: 'auto',
                      backgroundColor: '#1890ff',
                      color: 'white'
                    }}
                  >
                    Mark All as Read
                  </Button>
                )}
              </div>
            </div>
          </div>
        ) as any,
        key: 'footer',
      };
      notificationItems.push(footerItem);
    }

    setItems(notificationItems);
  }, [notifications, selectedNotifications, loading]);
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