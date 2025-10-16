import React from 'react';
import { Document, Page, Text, View, StyleSheet, Image } from '@react-pdf/renderer';
import { getCaseTypeData, getCourtData, getRegionData, getDepartmentData, getCaseStatusData, getSubjectData } from '@/utils/dropdownData';

const styles = StyleSheet.create({
  page: {
    padding: 30,
    fontSize: 10,
    fontFamily: 'Helvetica',
    backgroundColor: '#ffffff',
  },
  header: {
    flexDirection: 'row',
    marginBottom: 20,
    alignItems: 'center',
  },
  logo: {
    width: 50,
    height: 50,
    marginRight: 20,
  },
  headerText: {
    flex: 1,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 14,
    color: '#7f8c8d',
    marginBottom: 3,
  },
  date: {
    fontSize: 10,
    color: '#95a5a6',
  },
  section: {
    marginBottom: 15,
    padding: 10,
    backgroundColor: '#f8f9fa',
    borderRadius: 3,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#2c3e50',
  },
  filterRow: {
    flexDirection: 'row',
    marginBottom: 4,
  },
  filterLabel: {
    width: 120,
    fontWeight: 'bold',
    color: '#34495e',
  },
  filterValue: {
    flex: 1,
    color: '#2c3e50',
  },
  table: {
    marginTop: 10,
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#00331a',
    padding: 8,
    marginBottom: 1,
  },
  tableHeaderCell: {
    color: '#ffffff',
    fontWeight: 'bold',
    fontSize: 9,
    textAlign: 'center',
  },
  tableRow: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    borderBottom: '1px solid #ecf0f1',
    padding: 6,
    minHeight: 25,
  },
  tableCell: {
    fontSize: 8,
    color: '#2c3e50',
    textAlign: 'left',
    paddingHorizontal: 3,
  },
  cpNumber: {
    width: '15%',
  },
  caseTitle: {
    width: '25%',
  },
  court: {
    width: '20%',
  },
  caseType: {
    width: '15%',
  },
  dateReceived: {
    width: '15%',
  },
  status: {
    width: '10%',
  },
  footer: {
    position: 'absolute',
    bottom: 30,
    left: 30,
    right: 30,
    textAlign: 'center',
    fontSize: 8,
    color: '#95a5a6',
    borderTop: '1px solid #ecf0f1',
    paddingTop: 10,
  },
});

interface ReportData {
  totalCases: number;
  reportTitle?: string;
  filters: {
    caseType?: string; // Keep for backward compatibility
    caseTypes?: string[];
    year: string;
    months: string[];
    isDirectionCase?: boolean; // Keep for backward compatibility
    isCsCalledInPerson?: boolean | string; // Keep for backward compatibility
    reportSections?: {
      contemptApplication: boolean;
      committee: boolean;
      inquiry: boolean;
      compliance: boolean;
      callForAppearanceUrgency: boolean;
    };
  };
  cases: Array<{
    id: number;
    caseTitle: string;
    court: string;
    region: string;
    relativeDepartment: string[];
    subjectOfApplication: string;
    dateReceived: string;
    dateOfHearing: string | null;
    caseStatus: string[];
    caseRemarks: string;
    isUrgent: boolean;
    isCallToAttention: boolean;
    isCsCalledInPerson: boolean;
    cpNumber: string;
    caseType: string;
    createdAt: string;
    updatedAt: string;
  }>;
}

const ReportPDF: React.FC<{ data: ReportData }> = ({ data }) => {
  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      });
    } catch {
      return 'N/A';
    }
  };

  const formatCourtName = (court: string) => {
    if (!court) return 'N/A';
    try {
      const courtOptions = getCourtData();
      const foundOption = courtOptions.find(opt => opt.value === court);
      return foundOption ? foundOption.label : court
        .replace(/([A-Z])/g, ' $1')
        .replace(/^./, str => str.toUpperCase())
        .trim();
    } catch {
      return court
        .replace(/([A-Z])/g, ' $1')
        .replace(/^./, str => str.toUpperCase())
        .trim();
    }
  };

  const formatCaseType = (caseType: string) => {
    if (!caseType) return 'N/A';
    try {
      const caseTypeOptions = getCaseTypeData();
      const foundOption = caseTypeOptions.find(opt => opt.value === caseType);
      return foundOption ? foundOption.label : caseType
        .replace(/([A-Z])/g, ' $1')
        .replace(/^./, str => str.toUpperCase())
        .trim();
    } catch {
      return caseType
        .replace(/([A-Z])/g, ' $1')
        .replace(/^./, str => str.toUpperCase())
        .trim();
    }
  };

  const formatRegionName = (region: string) => {
    if (!region) return 'N/A';
    try {
      const regionOptions = getRegionData();
      const foundOption = regionOptions.find(opt => opt.value === region);
      return foundOption ? foundOption.label : region;
    } catch {
      return region;
    }
  };

  const formatDepartmentNames = (departments: string[]) => {
    if (!departments || departments.length === 0) return 'N/A';
    try {
      const departmentOptions = getDepartmentData();
      const formattedDepartments = departments.map(dept => {
        const foundOption = departmentOptions.find(opt => opt.value === dept);
        return foundOption ? foundOption.label : dept;
      });
      return formattedDepartments.join(', ');
    } catch {
      return departments.join(', ');
    }
  };

  const formatSubjectOfApplication = (subject: string) => {
    if (!subject) return 'N/A';
    try {
      const subjectOptions = getSubjectData();
      const foundOption = subjectOptions.find(opt => opt.value === subject);
      return foundOption ? foundOption.label : subject;
    } catch {
      return subject;
    }
  };

  const formatCaseStatus = (statuses: string[]) => {
    if (!statuses || statuses.length === 0) return 'N/A';
    try {
      const statusOptions = getCaseStatusData();
      const formattedStatuses = statuses.map(status => {
        const foundOption = statusOptions.find(opt => opt.value === status);
        return foundOption ? foundOption.label : status;
      });
      return formattedStatuses.join(', ');
    } catch {
      return statuses.join(', ');
    }
  };

  const formatCaseTypes = (caseTypes: string[]) => {
    if (!caseTypes || caseTypes.length === 0) return 'All Types';
    try {
      const caseTypeOptions = getCaseTypeData();
      const formattedTypes = caseTypes.map(type => {
        const foundOption = caseTypeOptions.find(opt => opt.value === type);
        return foundOption ? foundOption.label : type;
      });
      return formattedTypes.join(', ');
    } catch {
      return caseTypes.join(', ');
    }
  };

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <Image src="/logo-green.png" style={styles.logo} />
          <View style={styles.headerText}>
            <Text style={styles.title}>SGA&CD Legal Wing</Text>
            <Text style={styles.subtitle}>Government of Sindh</Text>
            <Text style={styles.date}>Generated on: {new Date().toLocaleDateString()}</Text>
          </View>
        </View>

        {/* Report Summary */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Report Summary</Text>
          <View style={styles.filterRow}>
            <Text style={styles.filterLabel}>Report Title:</Text>
            <Text style={styles.filterValue}>{data.reportTitle || 'Legal Case Management Report'}</Text>
          </View>
          <View style={styles.filterRow}>
            <Text style={styles.filterLabel}>Case Types:</Text>
            <Text style={styles.filterValue}>
              {data.filters.caseTypes && data.filters.caseTypes.length > 0 
                ? formatCaseTypes(data.filters.caseTypes) 
                : formatCaseType(data.filters.caseType || 'All Types')}
            </Text>
          </View>
          <View style={styles.filterRow}>
            <Text style={styles.filterLabel}>Period Covered:</Text>
            <Text style={styles.filterValue}>
              {data.filters.months.length > 0 ? data.filters.months.join(', ') : 'All Months'}
            </Text>
          </View>
          <View style={styles.filterRow}>
            <Text style={styles.filterLabel}>Year:</Text>
            <Text style={styles.filterValue}>{data.filters.year}</Text>
          </View>
          <View style={styles.filterRow}>
            <Text style={styles.filterLabel}>Total Cases:</Text>
            <Text style={styles.filterValue}>{data.totalCases}</Text>
          </View>
          {data.filters.reportSections && (
            <View style={styles.filterRow}>
              <Text style={styles.filterLabel}>Report Sections:</Text>
              <Text style={styles.filterValue}>
                {Object.entries(data.filters.reportSections)
                  .filter(([_, enabled]) => enabled)
                  .map(([key, _]) => {
                    switch(key) {
                      case 'contemptApplication': return 'Contempt Application';
                      case 'committee': return 'Committee';
                      case 'inquiry': return 'Inquiry';
                      case 'compliance': return 'Compliance';
                      case 'callForAppearanceUrgency': return 'Call for Appearance and Urgency Cases';
                      case 'directions': return 'Directions';
                      default: return key;
                    }
                  })
                  .join(', ') || 'None Selected'}
              </Text>
            </View>
          )}
          {(data.filters.isDirectionCase !== undefined || data.filters.isCsCalledInPerson !== undefined) && (
            <View>
              {data.filters.isDirectionCase !== undefined && (
                <View style={styles.filterRow}>
                  <Text style={styles.filterLabel}>Direction Cases:</Text>
                  <Text style={styles.filterValue}>{data.filters.isDirectionCase ? 'Yes' : 'No'}</Text>
                </View>
              )}
              {data.filters.isCsCalledInPerson !== undefined && (
                <View style={styles.filterRow}>
                  <Text style={styles.filterLabel}>CS Called in Person:</Text>
                  <Text style={styles.filterValue}>
                    {typeof data.filters.isCsCalledInPerson === 'boolean' 
                      ? (data.filters.isCsCalledInPerson ? 'Yes' : 'No')
                      : data.filters.isCsCalledInPerson}
                  </Text>
                </View>
              )}
            </View>
          )}
        </View>

        {/* Cases Table */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Case Details</Text>
          <View style={styles.table}>
            {/* Table Header */}
            <View style={styles.tableHeader}>
              <Text style={[styles.tableHeaderCell, styles.cpNumber]}>Case Number</Text>
              <Text style={[styles.tableHeaderCell, styles.caseTitle]}>Case Title</Text>
              <Text style={[styles.tableHeaderCell, styles.court]}>Court</Text>
              <Text style={[styles.tableHeaderCell, styles.caseType]}>Type</Text>
              <Text style={[styles.tableHeaderCell, styles.dateReceived]}>Date Received</Text>
              <Text style={[styles.tableHeaderCell, styles.status]}>Status</Text>
            </View>

            {/* Table Rows */}
            {data.cases.map((caseItem, index) => (
              <View key={caseItem.id} style={styles.tableRow}>
                <Text style={[styles.tableCell, styles.cpNumber]}>
                  {caseItem.cpNumber}
                </Text>
                <Text style={[styles.tableCell, styles.caseTitle]}>
                  {caseItem.caseTitle || 'N/A'}
                </Text>
                <Text style={[styles.tableCell, styles.court]}>
                  {formatCourtName(caseItem.court)}
                </Text>
                <Text style={[styles.tableCell, styles.caseType]}>
                  {formatCaseType(caseItem.caseType)}
                </Text>
                <Text style={[styles.tableCell, styles.dateReceived]}>
                  {formatDate(caseItem.dateReceived)}
                </Text>
                <Text style={[styles.tableCell, styles.status]}>
                  {caseItem.caseStatus.length > 0 ? formatCaseStatus(caseItem.caseStatus) : 'Pending'}
                </Text>
              </View>
            ))}
          </View>
        </View>

        {/* Footer */}
        <Text style={styles.footer}>
          This report was generated automatically by the Case Management System - Government of Sindh
        </Text>
      </Page>
    </Document>
  );
};

export default ReportPDF;
