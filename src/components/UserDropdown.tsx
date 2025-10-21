import { Avatar, Dropdown, message } from "antd";
import { UserOutlined } from '@ant-design/icons';
import { useRouter } from "next/navigation";
import Cookies from 'js-cookie';
import HTTPMethods from "@/api";
import { logout as logoutEndpoint } from "@/api/communications";

const UserDropdown = () => {
    const userType = Cookies.get('userType');
    const userName = Cookies.get('userName') || "";
    const router = useRouter();
    const logout = async () => {
        try {
            await HTTPMethods.post(logoutEndpoint);
        } catch (e) {
            // Optionally show error
            message.error("Logout failed");
        }
        Cookies.remove('token');
        userType == "ADMIN" ? router.push('/admin/login') : router.push('/login');
    };
    const items = [
        {
            label: (
                <div className="user-dropdown-item">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 12C14.7614 12 17 9.76142 17 7C17 4.23858 14.7614 2 12 2C9.23858 2 7 4.23858 7 7C7 9.76142 9.23858 12 12 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M20.59 22C20.59 18.13 16.74 15 12 15C7.26 15 3.41 18.13 3.41 22" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    <span>Profile</span>
                </div>
            ),
            key: '0',
        },
        {
            label: (
                <div className="user-dropdown-item user-dropdown-logout" onClick={logout}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M9 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M16 17L21 12L16 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M21 12H9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    <span>Logout</span>
                </div>
            ),
            key: '1',
        },
    ];
    return (
        <Dropdown 
            menu={{ items }} 
            trigger={['click']} 
            placement="bottomRight"
            overlayClassName="user-dropdown-overlay"
        >
            <div className="user-wrapper d-flex align-items-center" style={{ cursor: 'pointer' }}>
                <Avatar shape="square" icon={<UserOutlined />} />
                <span className="user-name">{userName || 'User'}</span>
                <span className="user-trigger">
                    <img src="/icons/Dropdown.svg" alt="" />
                </span>
            </div>
        </Dropdown>
    );
}

export default UserDropdown;