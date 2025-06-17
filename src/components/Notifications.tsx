import { Dropdown } from "antd";


const NotificationDropdown = () => {
    const items = [
        {
            label: (
                <a href="#" target="_blank" rel="noopener noreferrer">
                    Notification 1
                </a>
            ),
            key: '0',
        },
        {
            label: (
                <a href="#" target="_blank" rel="noopener noreferrer">
                    Notification 2
                </a>
            ),
            key: '1',
        },
    ];
    return (
        <Dropdown menu={{ items }} trigger={['click']} placement="bottomLeft">
            <a onClick={e => e.preventDefault()}>
                <span>
                    <img src="/src/assets/icons/notification-icon.svg" alt="" />
                </span>
            </a>
        </Dropdown>
    );
}

export default NotificationDropdown;