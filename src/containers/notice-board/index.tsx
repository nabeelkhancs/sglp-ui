"use client";
import Notice from "@/components/NoticeBoard";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import { APICalls } from '@/api/api-calls';
import { Spin, Alert } from 'antd';

const NoticeBoardContainer = () => {
    const router = useRouter();
    const userType = Cookies.get("userType");
    const [noticeBoardData, setNoticeBoardData] = useState<any[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    // Fetch notice board entries
    useEffect(() => {
        const fetchNoticeBoardEntries = async () => {
            try {
                setLoading(true);
                console.log('Fetching notice board entries...');
                const data = await APICalls.getNoticeBoardEntries();
                console.log('Notice board entries fetched:', data);
                setNoticeBoardData(data);
                setError(null);
            } catch (error) {
                console.error('Failed to fetch notice board entries:', error);
                setError('Failed to load notice board entries.');
                setNoticeBoardData([]);
            } finally {
                setLoading(false);
            }
        };

        fetchNoticeBoardEntries();
    }, []);

    // Handle notice click navigation
    const handleNoticeClick = (notice: any) => {
        if (notice.cpNumber) {
            // URL encode the cpNumber
            const encodedCpNumber = encodeURIComponent(notice.cpNumber);
            
            console.log('Notice clicked:', notice);
            console.log('CP Number:', notice.cpNumber);
            console.log('User Type:', userType);
            
            // Redirect based on user type
            if (userType === "ADMIN") {
                router.push(`/cases?cpNumber=${encodedCpNumber}`);
            } else {
                router.push(`/cases/submitted?cpNumber=${encodedCpNumber}`);
            }
        } else {
            console.warn('Notice clicked but no cpNumber found:', notice);
        }
    };

    // Loading state
    if (loading) {
        return (
            <div className="notice-board">
                <div className="page-title mb-3">
                    <h1 className="mb-0">Notice Board</h1>
                </div>
                <div className="content" style={{ minHeight: "60vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <Spin size="large" />
                </div>
            </div>
        );
    }

    // Error state
    if (error) {
        return (
            <div className="notice-board">
                <div className="page-title mb-3">
                    <h1 className="mb-0">Notice Board</h1>
                </div>
                <div className="content" style={{ minHeight: "60vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <Alert message={error} type="error" showIcon />
                </div>
            </div>
        );
    }

    return (
        <div className="notice-board">
            <div className="page-title mb-3">
                <h1 className="mb-0">Notice Board</h1>
            </div>
            <div className="content">
                <div className="row g-3">
                    {noticeBoardData && noticeBoardData.length > 0 ? (
                        noticeBoardData.map((notice: any, index: number) => (
                            <div className="col-md-3" key={notice.id || index}>
                                <Notice 
                                    noticeData={notice} 
                                    onClick={() => handleNoticeClick(notice)}
                                />
                            </div>
                        ))
                    ) : (
                        <div className="col-12">
                            <div style={{ textAlign: 'center', padding: '60px 20px' }}>
                                <h4 style={{ color: '#999', marginBottom: '10px' }}>No Notice Board Entries</h4>
                                <p style={{ color: '#666' }}>There are currently no notices to display.</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default NoticeBoardContainer;