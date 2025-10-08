"use client";

import { Dropdown, Input } from "antd";
import NotificationDropdown from "./Notifications";
import UserDropdown from "./UserDropdown";
import { APICalls } from "@/api/api-calls";
import React from "react";
import { useRouter } from 'next/navigation';
import Cookies from "js-cookie";

const Header = () => {
  const [searchValue, setSearchValue] = React.useState("");
  const [debouncedValue, setDebouncedValue] = React.useState("");
  const [searchResults, setSearchResults] = React.useState<any[]>([]);
  const [dropdownOpen, setDropdownOpen] = React.useState(false);
  const router = useRouter();
  const userType = Cookies.get("userType");

  // Debounce typing
  React.useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(searchValue), 400);
    return () => clearTimeout(handler);
  }, [searchValue]);

  // Trigger search when debounce changes
  React.useEffect(() => {
    if (debouncedValue.trim()) {
      handleSearch(debouncedValue);
    } else {
      setSearchResults([]);
      setDropdownOpen(false);
    }
  }, [debouncedValue]);

  const handleSearch = async (value: string) => {
    if (!value.trim()) return;
    try {
      const result = await APICalls.searchCases(value);
      if (Array.isArray(result) && result.length > 0) {
        console.log("Search results:", result);
        setSearchResults(result);
        setDropdownOpen(true);
      } else {
        setSearchResults([]);
        setDropdownOpen(false);
      }
    } catch (err) {
      console.error("Search error:", err);
      setSearchResults([]);
      setDropdownOpen(false);
    }
  };

  const handleDropdownSelect = (caseItem: any) => {
    setDropdownOpen(false);
    setSearchValue("");

    console.log("Selected case:", caseItem);
  };

  // Custom dropdown content
  const items = [
    {
      label: (
        <div className="search-dropdown-list">
          {searchResults.map((item: any, idx: number) => (
            <div
              key={item.id || idx}
              className="search-dropdown-item"
              onClick={() => {
                setDropdownOpen(true);
                if (item?.cpNumber) {
                  userType == "ADMIN" ? router.push(`/cases?cpNumber=${encodeURIComponent(item.cpNumber)}`) : router.push(`/cases/submitted?cpNumber=${encodeURIComponent(item.cpNumber)}`);
                }
              }}
              role="button"
              tabIndex={0}
              style={{ outline: 'none' }}
              onKeyPress={e => {
                if (e.key === 'Enter') {
                  setDropdownOpen(true);
                  if (item?.cpNumber) {
                    userType == "ADMIN" ? router.push(`/cases?cpNumber=${encodeURIComponent(item.cpNumber)}`) : router.push(`/cases/submitted?cpNumber=${encodeURIComponent(item.cpNumber)}`);
                  }
                }
              }}
            >
              <div className="search-dropdown-title">{item.caseTitle || 'No Title'}</div>
              <div className="search-dropdown-number">Case #: {item.caseNumber || '-'}</div>
              <div className="search-dropdown-date">Date of Hearing: {item.dateOfHearing ? item.dateOfHearing : '-'}</div>
            </div>
          ))}
        </div>
      ),
      key: "search-results",
    },
  ];

  return (
    <header className="header bg-white">
      <div className="p-3">
        <div className="row justify-content-between">
          <div className="col-md-3">
            <img src="/images/site-logo.svg" alt="Site logo" />
          </div>
          <div className="col-md-6">
            <div
              className="d-flex gap-4 align-items-center justify-content-end pe-5"
              style={{ position: "relative" }}
            >
              <Dropdown
                menu={{ items }}
                trigger={["click"]}
                placement="bottomLeft"
                open={dropdownOpen && items.length > 0}
                onOpenChange={(visible) => setDropdownOpen(visible)}
                overlayClassName="search-dropdown"
              >
                <Input
                  placeholder="Search..."
                  value={searchValue}
                  onChange={(e) => setSearchValue(e.target.value)}
                  className="header-search-input"
                  suffix={
                    <img
                      src="/icons/search-icon.svg"
                      style={{ cursor: "pointer" }}
                    />
                  }
                  onFocus={() =>
                    searchResults.length > 0 && setDropdownOpen(true)
                  }
                  onBlur={() => setTimeout(() => setDropdownOpen(false), 200)}
                />
              </Dropdown>
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
};

export default Header;
