"use client";

import { Dropdown, Input } from "antd";
import NotificationDropdown from "./Notifications";
import UserDropdown from "./UserDropdown";
import { APICalls } from "@/api/api-calls";
import React from "react";
import { useRouter } from 'next/navigation';
import Cookies from "js-cookie";
import { toast } from 'react-toastify';

const Header = () => {
  const [searchValue, setSearchValue] = React.useState("");
  const [debouncedValue, setDebouncedValue] = React.useState("");
  const [searchResults, setSearchResults] = React.useState<any[]>([]);
  const [dropdownOpen, setDropdownOpen] = React.useState(false);
  const [userType, setUserType] = React.useState<string | undefined>(undefined);
  const router = useRouter();

  // Read cookie only on client
  React.useEffect(() => {
    setUserType(Cookies.get("userType"));
  }, []);

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
    
    // Check for special characters
    const specialCharRegex = /[!@#$%^&*()_+=\[\]{};':"\\|,.<>?~]/;
    if (specialCharRegex.test(value)) {
      toast.error("You cannot search through special characters");
      setSearchResults([]);
      setDropdownOpen(false);
      return;
    }

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
    console.log("Selected case:", caseItem);
    setDropdownOpen(true);
    // setSearchValue("");

    console.log("Selected case:", caseItem);
  };

  // Custom dropdown content
  const renderDropdown = () => {
    if (!dropdownOpen || searchResults.length === 0) return null;
    return (
      <div className="search-dropdown-list custom-search-dropdown" style={{ position: 'absolute', top: '100%', left: 0, right: 0, zIndex: 1000 }}>
        {searchResults.map((item: any, idx: number) => (
          <div
            key={item.id || idx}
            className="search-dropdown-item"
            onMouseDown={e => {
              e.preventDefault();
              setDropdownOpen(false);
              if (item?.cpNumber && userType) {
                if (userType === "ADMIN") {
                  window.location.href  = `/cases?cpNumber=${encodeURIComponent(item?.cpNumber)}`;
                } else {
                  window.location.href  = `/cases/submitted?cpNumber=${encodeURIComponent(item?.cpNumber)}`;
                }
              }
            }}
            role="button"
            tabIndex={0}
            style={{ outline: 'none' }}
            onKeyDown={e => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                setDropdownOpen(false);
                if (item?.cpNumber && userType) {
                  if (userType === "ADMIN") {
                    router.push(`/cases?cpNumber=${encodeURIComponent(item?.cpNumber)}`);
                  } else {
                    router.push(`/cases/submitted?cpNumber=${encodeURIComponent(item?.cpNumber)}`);
                  }
                }
              }
            }}
          >
            <div className="search-dropdown-title">{item.caseTitle || 'No Title'}</div>
            <div className="search-dropdown-number">Case #: {item.cpNumber || '-'}</div>
            <div className="search-dropdown-date">Date of Hearing: {item.dateOfHearing ? item.dateOfHearing : '-'}</div>
          </div>
        ))}
      </div>
    );
  };

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
              <div style={{ position: 'relative', width: '100%' }}>
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
                {renderDropdown()}
              </div>
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
