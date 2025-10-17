'use client';
import { Badge, Calendar } from 'antd';
import type { BadgeProps, CalendarProps } from 'antd';
import type { Dayjs } from 'dayjs';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import { APICalls } from '@/api/api-calls';
import dayjs from 'dayjs';

interface ListDataItem {
  type: BadgeProps['status'];
  content: string;
}

const getListData = (value: Dayjs): ListDataItem[] => {
  let listData: ListDataItem[] = [];
  switch (value.date()) {
    case 8:
      listData = [
        { type: 'warning', content: 'This is warning event.' },
        { type: 'success', content: 'This is usual event.' },
      ];
      break;
    case 10:
      listData = [
        { type: 'warning', content: 'This is warning event.' },
        { type: 'success', content: 'This is usual event.' },
        { type: 'error', content: 'This is error event.' },
      ];
      break;
    case 15:
      listData = [
        { type: 'warning', content: 'This is warning event' },
        { type: 'success', content: 'This is very long usual event......' },
        { type: 'error', content: 'This is error event 1.' },
        { type: 'error', content: 'This is error event 2.' },
        { type: 'error', content: 'This is error event 3.' },
        { type: 'error', content: 'This is error event 4.' },
      ];
      break;
    default:
  }
  return listData || [];
};

const getMonthData = (value: Dayjs) => {
  if (value.month() === 8) {
    return 1394;
  }
  return undefined;
};

const ManagerCalendar = () => {
  const router = useRouter();
  const userType = Cookies.get("userType");
  const [currentMonth, setCurrentMonth] = useState<Dayjs>(dayjs());
  const [calendarCases, setCalendarCases] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const fetchCalendarCases = async () => {
      try {
        setLoading(true);
        
        const startDate = currentMonth.startOf('month').format('YYYY-MM-DD');
        const endDate = currentMonth.endOf('month').format('YYYY-MM-DD');
        
        console.log('Fetching calendar cases for:', { startDate, endDate });
        const cases = await APICalls.getCalendarCases(startDate, endDate);
        console.log('Calendar cases fetched:', cases);
        setCalendarCases(cases);
      } catch (error) {
        console.error('Failed to fetch calendar cases:', error);
        setCalendarCases([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCalendarCases();
  }, [currentMonth]);

  const handlePanelChange = (value: Dayjs) => {
    console.log('Calendar panel changed to:', value.format('YYYY-MM'));
    setCurrentMonth(value);
  };

  // Handle case click navigation
  const handleCaseClick = (caseItem: any) => {
    if (caseItem.cpNumber) {
      // URL encode the cpNumber
      const encodedCpNumber = encodeURIComponent(caseItem.cpNumber);
      
      console.log('Case clicked:', caseItem);
      console.log('CP Number:', caseItem.cpNumber);
      console.log('User Type:', userType);
      
      // Redirect based on user type
      if (userType === "ADMIN") {
        router.push(`/cases?cpNumber=${encodedCpNumber}`);
      } else {
        router.push(`/cases/submitted?cpNumber=${encodedCpNumber}`);
      }
    } else {
      console.warn('Case clicked but no cpNumber found:', caseItem);
    }
  };

  const monthCellRender = (value: Dayjs) => {
    const num = getMonthData(value);
    return num ? (
      <div className="notes-month">
        <section>{num}</section>
        <span>Backlog number</span>
      </div>
    ) : null;
  };

  const dateCellRender = (value: Dayjs) => {
    const casesForDate = calendarCases.filter((caseItem: any) => {
      if (caseItem.dateOfHearing) {
        const hearingDate = dayjs(caseItem.dateOfHearing);
        return hearingDate.isSame(value, 'day');
      }
      return false;
    });

    const getCaseColorClass = (caseItem: any) => {
      if (Array.isArray(caseItem.caseStatus)) {
        if (caseItem.caseStatus.includes('urgent') || caseItem.caseStatus.includes('callToAttention')) {
          return 'case-item-urgent';
        }
        else if (caseItem.caseStatus.includes('committeConstitution') || caseItem.caseStatus.includes('underReview')) {
          return 'case-item-committee';
        }
        else if (caseItem.caseStatus.includes('compliedWith')) {
          return 'case-item-completed';
        }
        else if (caseItem.caseStatus.includes('compliance')) {
          return 'case-item-compliance';
        }
      }
      return 'case-item-default';
    };

    return (
      <div className="events-container">
        {casesForDate.map((caseItem: any, index: number) => (
          <div
            key={`${caseItem.id}-${index}`}
            className={`case-item ${getCaseColorClass(caseItem)}`}
            title={caseItem.caseTitle || `Case ${caseItem.id}`}
            onClick={() => handleCaseClick(caseItem)}
          >
            {caseItem.caseTitle || `Case ${caseItem.id}`}
          </div>
        ))}
      </div>
    );
  };

  const cellRender: CalendarProps<Dayjs>['cellRender'] = (current, info) => {
    if (info.type === 'date') return dateCellRender(current);
    if (info.type === 'month') return monthCellRender(current);
    return info.originNode;
  };

  return (
    <div className="div calendar-page">
      <div className="page-title mb-3">
        <h1 className="mb-0">Calendar</h1>
      </div>
      <div className="content bg-white">
        <Calendar 
          cellRender={cellRender}
          onPanelChange={handlePanelChange}
        />
        </div>
    </div>
  );
};

export default ManagerCalendar;