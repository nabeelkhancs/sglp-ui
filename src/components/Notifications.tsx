import { Dropdown, Button, Checkbox, Divider } from "antd";
import { useEffect, useState } from "react";
import { useNotifications } from "@/contexts/NotificationContext";



const NotificationDropdown = () => {
  const { 
    notifications, 
    loading, 
    markAsRead, 
    markAllAsRead, 
    markMultipleAsRead,
    refreshNotifications 
  } = useNotifications();
  
  const [items, setItems] = useState<any[]>([]);
  const [selectedNotifications, setSelectedNotifications] = useState<number[]>([]);

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

  const handleMarkSelectedAsRead = async () => {
    if (selectedNotifications.length === 0) return;
    await markMultipleAsRead(selectedNotifications);
    setSelectedNotifications([]);
  };

  const handleMarkAllAsRead = async () => {
    await markAllAsRead();
    setSelectedNotifications([]);
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
                      handleMarkSelectedAsRead();
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
                      handleMarkAllAsRead();
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