import { Dropdown, Button, Checkbox, Divider } from "antd";
import { useEffect, useState } from "react";
import { useNotifications } from "@/contexts/NotificationContext";



const NotificationDropdown = () => {
  const { 
    notifications, 
    loading, 
    initialized,
    hasMore,
    totalCount,
    currentPage,
    markAsRead, 
    markAllAsRead, 
    markMultipleAsRead,
    refreshNotifications,
    loadMoreNotifications,
    unreadCount
  } = useNotifications();
  
  const [items, setItems] = useState<any[]>([]);
  const [selectedNotifications, setSelectedNotifications] = useState<number[]>([]);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  useEffect(() => {
    if (!initialized) {
      refreshNotifications();
    }
  }, [initialized, refreshNotifications]);

  const handleDropdownVisibleChange = async (visible: boolean) => {
    setDropdownOpen(visible);
    if (visible && !initialized) {
      await refreshNotifications();
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
    // Show loading state if not initialized or currently loading first page
    if (!initialized && loading) {
      setItems([{ 
        label: (
          <div style={{ padding: '16px', textAlign: 'center' }}>
            Loading notifications...
          </div>
        ), 
        key: 'loading' 
      }]);
      return;
    }

    // If no notifications
    if (notifications.length === 0) {
      setItems([{ 
        label: (
          <div style={{ padding: '16px', textAlign: 'center', color: '#999' }}>
            No notifications
          </div>
        ), 
        key: 'none' 
      }]);
      return;
    }

    // Create scrollable container with notifications, show more button, and footer controls
    const scrollableContent = (
      <div style={{ width: '100%' }}>
        {/* Scrollable notifications area */}
        <div 
          style={{ 
            maxHeight: '300px', 
            overflowY: 'auto',
            padding: '4px 8px'
          }}
        >
          {notifications.map((notif: any) => (
            <div key={notif.id} style={{ marginBottom: '8px' }}>
              {createNotificationLabel(notif)}
            </div>
          ))}
        </div>

        {/* Show More section - outside scrollable area */}
        {notifications.length < totalCount && (
          <div 
            style={{ 
              padding: '8px 12px', 
              textAlign: 'right',
              borderTop: '1px solid #f0f0f0',
              backgroundColor: '#fafafa'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <span
              onClick={(e) => {
                e.stopPropagation();
                if (!loading) {
                  loadMoreNotifications();
                }
              }}
              style={{ 
                fontSize: '12px',
                color: loading ? '#999' : '#1890ff',
                cursor: loading ? 'default' : 'pointer',
                textDecoration: 'none',
                transition: 'text-decoration 0.2s ease'
              }}
              onMouseEnter={(e) => {
                if (!loading) {
                  (e.target as HTMLElement).style.textDecoration = 'underline';
                }
              }}
              onMouseLeave={(e) => {
                (e.target as HTMLElement).style.textDecoration = 'none';
              }}
            >
              {loading ? 'Loading...' : `Show More (${notifications.length}/${totalCount})`}
            </span>
          </div>
        )}

        {/* All notifications loaded indicator */}
        {notifications.length >= totalCount && (
          <div style={{ 
            padding: '8px 12px', 
            textAlign: 'center', 
            color: '#999',
            fontSize: '11px',
            borderTop: '1px solid #f0f0f0',
            backgroundColor: '#fafafa'
          }}>
            All notifications loaded ({totalCount})
          </div>
        )}

        {/* Footer controls - outside scrollable area */}
        <div 
          style={{ 
            padding: '12px', 
            borderTop: '2px solid #e8e8e8', 
            backgroundColor: '#f8f9fa'
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '8px' }}>
            <Checkbox
              checked={selectedNotifications.length === notifications.filter(notif => !notif.isRead).length && notifications.filter(notif => !notif.isRead).length > 0}
              indeterminate={selectedNotifications.length > 0 && selectedNotifications.length < notifications.filter(notif => !notif.isRead).length}
              onChange={(e) => {
                e.preventDefault();
                e.stopPropagation();
                handleSelectAll(e.target.checked);
              }}
              style={{ fontSize: '12px' }}
            >
              Select All Unread
            </Checkbox>
            <div style={{ display: 'flex', gap: '8px' }}>
              {selectedNotifications.length > 0 ? (
                <Button
                  type="primary"
                  size="small"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleMarkSelectedAsRead();
                  }}
                  loading={loading}
                  style={{ 
                    fontSize: '11px',
                    padding: '4px 12px',
                    height: 'auto'
                  }}
                >
                  Mark Selected as Read ({selectedNotifications.length})
                </Button>
              ) : (
                <Button
                  type="default"
                  size="small"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleMarkAllAsRead();
                  }}
                  loading={loading}
                  style={{ 
                    fontSize: '11px',
                    padding: '4px 12px',
                    height: 'auto'
                  }}
                >
                  Mark All as Read
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    );

    setItems([{
      label: scrollableContent,
      key: 'notifications-container',
    }]);
  }, [notifications, selectedNotifications, loading, initialized, totalCount, loadMoreNotifications]);
  return (
    <Dropdown 
      menu={{ items }} 
      trigger={['click']} 
      placement="bottomLeft"
      onOpenChange={handleDropdownVisibleChange}
      open={dropdownOpen}
      overlayClassName="notification-dropdown"
    >
      <a onClick={e => e.preventDefault()} style={{ position: 'relative', display: 'inline-block' }}>
        <span>
          <img src="/icons/notification-icon.svg" alt="" />
          {unreadCount > 0 && (
            <span className="notification-icon-badge">
              {unreadCount > 99 ? '99+' : unreadCount}
            </span>
          )}
        </span>
      </a>
    </Dropdown>
  );
}

export default NotificationDropdown;