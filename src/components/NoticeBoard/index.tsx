import moment from "moment";

interface NoticeProps {
    noticeData?: {
        id?: number;
        title?: string;
        status?: string;
        dueDate?: string;
        cpNumber?: string;
        caseTitle?: string;
        dateReceived?: string;
        caseStatus?: string[];
        [key: string]: any;
    };
    onClick?: () => void;
}

const Notice: React.FC<NoticeProps> = ({ noticeData, onClick }) => {
    // Default values if no data is provided
    const defaultData = {
        title: "Matters",
        status: "CS Summoned in person",
        dueDate: "24/11/2025",
        cpNumber: "4567 of 2025",
        caseTitle: "Kamran khan vs Gos",
        dateReceived: "6/3/2025",
        caseStatus: [] as string[]
    };

    // Use provided data or defaults
    const data = noticeData || defaultData;
    
    // Function to get status text based on case status array
    const getStatusText = () => {
        // Check if noticeData has caseStatus (for real API data)
        if (noticeData?.caseStatus && Array.isArray(noticeData.caseStatus)) {
            if (noticeData.caseStatus.includes('csCalledInPerson')) {
                return "CS Summoned in person";
            }
            // You can add more status conditions here
            if (noticeData.caseStatus.includes('urgent')) {
                return "Urgent Matter";
            }
            if (noticeData.caseStatus.includes('committeConstitution')) {
                return "Committee Constitution";
            }
            if (noticeData.caseStatus.includes('compliedWith')) {
                return "Complied With";
            }
            if (noticeData.caseStatus.includes('underReview')) {
                return "Under Review";
            }
            // Default status if array exists but no specific status found
            return noticeData.status || "Pending";
        }
        // Fallback to provided status or default
        return data.status || "CS Summoned in person";
    };
    
    return (
        <div 
            className="notice py-3 px-4 bg-white" 
            onClick={onClick}
            style={{ 
                cursor: onClick ? 'pointer' : 'default',
                transition: 'transform 0.2s ease, box-shadow 0.2s ease'
            }}
            onMouseEnter={(e) => {
                if (onClick) {
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
                }
            }}
            onMouseLeave={(e) => {
                if (onClick) {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = 'none';
                }
            }}
        >
            <p className="mb-1">{data.title || "Matters"}</p>
            <p className="mb-1 fw-medium text-danger">{getStatusText()}</p>
            <p className="mb-1">In 3 Days on - {data.dueDate || "24/11/2025"}</p>
            <p className="mb-1">Cp No - {data.cpNumber || "4567 of 2025"}</p>
            <p className="mb-1">{data.caseTitle || "Kamran khan vs Gos"}</p>
            <p className="mb-1">With order date {moment(data.dateReceived).format("DD/MM/YYYY") || "6/3/2025"}</p>
        </div>
    );
}

export default Notice;