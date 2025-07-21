"use client";
import React, { useEffect, useState, useMemo } from "react";
import { Layout, Menu, Button, Spin, Alert } from "antd";
import Link from "next/link";
import Header from "../../components/Header";
import Cookies from "js-cookie";
import { useRouter, usePathname } from "next/navigation";
import { APICalls } from "@/api/api-calls";
import Image from "next/image";

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

  const menuItems = useMemo(
    () =>
      (permissions || []).map((item) => ({
        key: item.link,
        icon: <Image src={`/icons/${item.icon}`} alt={item.label} width={24} height={24} />,
        label: <Link href={item.link}>{item.label}</Link>,
      })),
    [permissions]
  );

  const allowed = useMemo(() => {
    if (!permissions) return false;
    console.log("Permissions:", permissions);
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
    </Layout>
  );
};

export default DashboardLayout;