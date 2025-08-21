import { Dropdown, Button, Checkbox, Divider } from "antd";
import { useEffect, useState } from "react";
import { useNotifications } from "@/contexts/NotificationContext";



const NotificationDropdown = () => {
  const { 
    notifications, 
    loading, 
    initialized,
    hasMore,
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

  // Initialize notifications when component mounts or when dropdown is opened
  useEffect(() => {
    if (!initialized) {
      refreshNotifications();
    }
  }, [initialized, refreshNotifications]);

  // Refresh notifications when dropdown is opened for the first time
  const handleDropdownVisibleChange = async (visible: boolean) => {
    setDropdownOpen(visible);
    if (visible && !initialized) {
      await refreshNotifications();
    }
  };

  // Attach scroll event listener to dropdown menu when it opens
  useEffect(() => {
    if (dropdownOpen) {
      const addScrollListener = () => {
        const dropdownMenu = document.querySelector('.notification-dropdown .ant-dropdown-menu');
        if (dropdownMenu) {
          const handleScroll = (e: Event) => {
            const element = e.target as HTMLDivElement;
            const { scrollTop, scrollHeight, clientHeight } = element;
            
            // Load more when scrolled to 80% of the content
            if (scrollTop + clientHeight >= scrollHeight * 0.8 && hasMore && !loading) {
              loadMoreNotifications();
            }
          };
          
          dropdownMenu.addEventListener('scroll', handleScroll);
          return () => dropdownMenu.removeEventListener('scroll', handleScroll);
        }
      };

      // Small delay to ensure dropdown is rendered
      const timeoutId = setTimeout(addScrollListener, 100);
      return () => clearTimeout(timeoutId);
    }
  }, [dropdownOpen, hasMore, loading, loadMoreNotifications]);

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
      setItems([{ label: 'Loading notifications...', key: 'loading' }]);
      return;
    }

    // Create scrollable container for notifications
    const notificationItems = notifications.length > 0
      ? notifications.map((notif: any) => ({
          label: createNotificationLabel(notif),
          key: notif.id,
        }))
      : [{ label: 'No notifications', key: 'none' }];

    // Add loading indicator for pagination
    if (loading && notifications.length > 0) {
      notificationItems.push({
        label: (
          <div style={{ 
            padding: '8px 0', 
            textAlign: 'center', 
            color: '#666',
            fontSize: '12px'
          }}>
            Loading more...
          </div>
        ) as any,
        key: 'loading-more',
      });
    }

    // Add "No more notifications" indicator
    if (!hasMore && notifications.length > 0 && currentPage > 1) {
      notificationItems.push({
        label: (
          <div style={{ 
            padding: '8px 0', 
            textAlign: 'center', 
            color: '#999',
            fontSize: '11px',
            borderTop: '1px solid #f0f0f0'
          }}>
            No more notifications
          </div>
        ) as any,
        key: 'no-more',
      });
    }

    // Add footer with controls if there are notifications
    if (notifications.length > 0) {
      const unreadNotificationsCount = notifications.filter(notif => !notif.isRead).length;
      const footerItem = {
        label: (
          <div 
            style={{ padding: '8px 0', borderTop: '1px solid #f0f0f0', marginTop: '8px' }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '8px' }}>
              <Checkbox
                checked={selectedNotifications.length === unreadNotificationsCount && unreadNotificationsCount > 0}
                indeterminate={selectedNotifications.length > 0 && selectedNotifications.length < unreadNotificationsCount}
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
  }, [notifications, selectedNotifications, loading, initialized, hasMore, currentPage]);
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