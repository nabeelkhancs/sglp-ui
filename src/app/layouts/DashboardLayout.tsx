"use client";
import React, { useEffect, useState, useMemo } from "react";
import { Layout, Menu, Button, Spin, Alert } from "antd";
import Link from "next/link";
import Header from "../../components/Header";
import Cookies from "js-cookie";
import { useRouter, usePathname } from "next/navigation";
import { APICalls } from "@/api/api-calls";
import Image from "next/image";
import { useNotifications } from "@/contexts/NotificationContext";
import { ToastContainer } from "react-toastify";

const { Sider, Content } = Layout;

type Permission = {
  id: number;
  label: string;
  icon: string;
  order: number;
  actions: { name: string; id: number }[];
  link: string;
};

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  const [collapsed, setCollapsed] = useState(false);
  const [permissions, setPermissions] = useState<Permission[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dashboardNotificationsCount, setDashboardNotificationsCount] = useState<any>(null);
  const { getDashboardNotifications, refreshNotifications, initialized } = useNotifications();
  const userType = Cookies.get("userType")
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const token = Cookies.get("token");
    const userType = Cookies.get("userType");
    if (!token) {
      userType == "ADMIN" ? router.replace("/admin/login") :  router.replace("/login");
      return;
    }
    setLoading(true);
    APICalls.getPermissions()
      .then((res) => {
        setPermissions(Array.isArray(res) ? res : []);
        setError(null);
      })
      .catch(() => {
        setPermissions([]);
        setError("Failed to load permissions.");
      })
      .finally(() => setLoading(false));
  }, [router]);

  useEffect(() => {
    // Initialize notifications and fetch dashboard notifications after permissions are loaded
    const fetchNotifications = async () => {
      try {
        // Initialize notifications if not already done
        if (!initialized) {
          await refreshNotifications();
        }
        
        // Fetch dashboard notifications
        const dashboardNotificationsData = await getDashboardNotifications();
        // console.log("Dashboard Layout - Dashboard Notifications:", dashboardNotificationsData);
        setDashboardNotificationsCount(dashboardNotificationsData);
      } catch (error) {
        console.error("Dashboard Layout - Failed to fetch notifications:", error);
      }
    };

    if (!loading && permissions) {
      fetchNotifications();
    }
  }, [loading, permissions, getDashboardNotifications, refreshNotifications, initialized]);

  const getBadgeCount = (link: string) => {
    if (!dashboardNotificationsCount?.categories) return 0;
    
    // Map menu links to notification categories
    switch (link) {
      case '/cases':
        return dashboardNotificationsCount.categories.allCases?.unreadCount || 0;
      case '/cases/directions':
        return dashboardNotificationsCount.categories.direction?.unreadCount || 0;
      case '/cases/csCalledInPerson':
        return dashboardNotificationsCount.categories.csCalledInPerson?.unreadCount || 0;
      case '/cases/contemptApplication':
        return dashboardNotificationsCount.categories.contempt?.unreadCount || 0;
      case '/cases/compliance':
        return dashboardNotificationsCount.categories.underCompliance?.unreadCount || 0;
      case '/committee':
        return dashboardNotificationsCount.categories.committee?.unreadCount || 0;
      default:
        return 0;
    }
  };

  const menuItems = useMemo(
    () =>
      (permissions || []).map((item) => {
        const badgeCount = getBadgeCount(item.link);
        return {
          key: item.link,
          icon: <Image src={`/icons/${item.icon}`} alt={item.label} width={24} height={24} />,
          label: (
            <Link href={item.link} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
              <span>{item.label}</span>
              {badgeCount > 0 && (
                <span className="sidebar-menu-badge">
                  {badgeCount}
                </span>
              )}
            </Link>
          ),
        };
      }),
    [permissions, dashboardNotificationsCount]
  );

  const allowed = useMemo(() => {
    if (!permissions) return false;
    console.log("permissions, pathname", permissions, pathname);
    if (permissions.some((item) => item.link === pathname)) return true;
    if (pathname.includes("edit")) {
      return permissions.some((item) =>
        item.actions?.some((action) => action.name === "Edit")
      );
    }
    if (pathname.includes("view")) {
      return permissions.some((item) =>
        item.actions?.some((action) => action.name === "View")
      );
    }
    return false;
  }, [permissions, pathname]);

  if (loading) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <Spin size="large" />
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <Alert message={error} type="error" showIcon />
      </div>
    );
  }

  return (
    <Layout style={{ minHeight: "100vh" }} className={`operator-layout ${userType == 'OPERATOR' ? 'operator' : 'manger'}` }>
      <Header />
      <Layout>
        <Sider
          className="sidebar position-relative"
          collapsible
          collapsed={collapsed}
          trigger={null}
          width={270}
        >
          <Menu
            theme="dark"
            mode="inline"
            defaultSelectedKeys={[pathname]}
            items={menuItems}
          />
          <Button
            className="collapse-btn"
            type="text"
            icon={
              collapsed
                ? <Image src="/icons/expand-icon.svg" alt="Expand" width={24} height={24} />
                : <Image src="/icons/collapse-icon.svg" alt="Collapse" width={24} height={24} />
            }
            onClick={() => setCollapsed((prev) => !prev)}
          />
        </Sider>
        <Content className="page-main">
          {allowed ? children : (
            <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, color: '#ff4d4f', fontWeight: 600 }}>
              Either this resource is not available or you are not allowed to access this resource
            </div>
          )}
        </Content>
      </Layout>
      <ToastContainer position="top-right" autoClose={3000} />
    </Layout>
  );
};

export default DashboardLayout;