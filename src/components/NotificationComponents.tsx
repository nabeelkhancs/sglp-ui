import { useNotifications } from '@/contexts/NotificationContext';

// Example component for Dashboard page
export const DashboardNotifications = () => {
  const { notifications, unreadCount, markAsRead } = useNotifications();
  
  // Get recent notifications (last 5)
  const recentNotifications = notifications.slice(0, 5);
  
  return (
    <div className="dashboard-notifications">
      <h3>Recent Notifications ({unreadCount} unread)</h3>
      {recentNotifications.map((notification) => (
        <div 
          key={notification.id} 
          className={`notification-item ${!notification.isRead ? 'unread' : ''}`}
          onClick={() => !notification.isRead && markAsRead(notification.id)}
        >
          <div className="notification-content">
            <strong>
              {notification.type === 'CREATE_CASE' && `New Case: ${notification.auditLog?.cpNumber}`}
              {notification.type === 'UPDATE_CASE' && `Case Updated: ${notification.auditLog?.cpNumber}`}
              {notification.type === 'CREATE_COMMITTEE' && 'New Committee Created'}
              {notification.type === 'UPDATE_COMMITTEE' && 'Committee Updated'}
            </strong>
            <small>{new Date(notification.createdAt).toLocaleDateString()}</small>
          </div>
        </div>
      ))}
    </div>
  );
};

// Example component for Case Detail page
export const CaseNotifications = ({ caseNumber }: { caseNumber: string }) => {
  const { notifications, markAsRead } = useNotifications();
  
  // Filter notifications related to this specific case
  const caseNotifications = notifications.filter(
    notif => notif.auditLog?.cpNumber === caseNumber
  );
  
  return (
    <div className="case-notifications">
      <h4>Case Activity</h4>
      {caseNotifications.map((notification) => (
        <div 
          key={notification.id} 
          className={`notification-item ${!notification.isRead ? 'unread' : ''}`}
          onClick={() => !notification.isRead && markAsRead(notification.id)}
        >
          <div className="notification-content">
            <span>{notification.auditLog?.user?.name || 'Unknown User'}</span>
            <span>
              {notification.type === 'CREATE_CASE' && ' created this case'}
              {notification.type === 'UPDATE_CASE' && ' updated this case'}
            </span>
            <small>{new Date(notification.createdAt).toLocaleDateString()}</small>
          </div>
        </div>
      ))}
    </div>
  );
};

export default { DashboardNotifications, CaseNotifications };
