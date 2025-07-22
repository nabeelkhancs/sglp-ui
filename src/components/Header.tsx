import { Dropdown, Input, Space } from "antd";
import NotificationDropdown from "./Notifications";
import UserDropdown from "./UserDropdown";

const Header = () => {

    return (
        <header className="header bg-white">
            <div className="p-3">
                <div className="row justify-content-between">
                    <div className="col-md-3">
                        <img src="/images/site-logo.svg" alt="Site logo" />
                    </div>
                    <div className="col-md-6">
                        <div className="d-flex gap-4 align-items-center justify-content-end pe-5">
                            {/* <Input placeholder="Advance Search" variant="filled" suffix={<img src="/icons/search-icon.svg" />} /> */}
                            <div className="notification-dropdown">
                                <NotificationDropdown />
                            </div>
                            <div className="user-dropdown">
                                <UserDropdown />
                            </div>

                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
}

export default Header;