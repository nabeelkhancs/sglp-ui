import { Avatar, Dropdown, message } from "antd";
import { UserOutlined } from '@ant-design/icons';
import { useRouter } from "next/navigation";
import Cookies from 'js-cookie';
import HTTPMethods from "@/api";
import { logout as logoutEndpoint } from "@/api/communications";

const UserDropdown = () => {
    const userType = Cookies.get('userType');
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
                <button type="button" className="dropdown-item-btn" style={{ background: 'none', border: 'none', padding: 0, color: 'inherit', cursor: 'pointer' }}>
                    Profile
                </button>
            ),
            key: '0',
        },
        {
            label: (
                <button type="button" onClick={logout} className="dropdown-item-btn" style={{ background: 'none', border: 'none', padding: 0, color: 'inherit', cursor: 'pointer' }}>
                    Logout
                </button>
            ),
            key: '1',
        },
    ];
    return (
        <div className="user-wrapper d-flex align-items-center">
            <Avatar shape="square" icon={<UserOutlined />} />
            <span>User</span>
            <Dropdown menu={{ items }} trigger={['click']} placement="bottomLeft">
                <a className="user-trigger" onClick={e => e.preventDefault()}>
                    <img src="/icons/Dropdown.svg" alt="" />
                </a>
            </Dropdown>
        </div>
    );
}

export default UserDropdown;