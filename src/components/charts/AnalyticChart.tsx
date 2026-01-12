// components/AnalyticsChart.tsx
"use client";
import Cookies from "js-cookie";

import { Card, Select, Dropdown, Menu } from "antd";
import { Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  ChartOptions,
} from "chart.js";
import { MoreOutlined } from "@ant-design/icons";
import React from "react";
import { useRouter } from "next/navigation";

ChartJS.register(ArcElement, Tooltip, Legend);

const defaultChartData = {
  labels: [
    "Directions",
    "Call for Appearance",
    "Committee",
    "Contempt",
    "Status of Compliance",
  ],
  datasets: [
    {
      label: "Case Count",
      data: [150, 49, 48, 34, 26, 13],
      backgroundColor: [
        "#2f74ff",
        "#ff5b5b",
        "#f9b233",
        "#3ba55d",
        "#b77cf1",
        "#40c4c1",
      ],
      borderColor: "#fff",
      borderWidth: 2,
    },
  ],
};

// Define URLs for each chart segment
const adminChartUrls = [
  { label: "Directions", url: "/cases?type=directions" },
  { label: "Call for Appearance", url: "/cases?type=appearance" },
  { label: "Committee", url: "/committee" },
  { label: "Contempt", url: "/cases?type=contempt" },
  { label: "Status of Compliance", url: "/cases?type=compliance" },
];
const othersChartUrls = [
  { label: "Directions", url: "/cases/submitted?type=directions" },
  { label: "Call for Appearance", url: "/cases/submitted?type=appearance" },
  { label: "Committee", url: "/committee" },
  { label: "Contempt", url: "/cases/submitted?type=contempt" },
  { label: "Status of Compliance", url: "/cases/submitted?type=compliance" },
];

const userType = Cookies.get("userType");

const chartUrls = userType === 'ADMIN' ? adminChartUrls : othersChartUrls;

const options: ChartOptions<"pie"> = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: "right",
      labels: {
        usePointStyle: true,
        pointStyle: "circle",
        boxWidth: 12,
        padding: 15,
      },
    },
  },
};


const items = [
  {
    key: '1',
    label: 'Edit',
  },
  {
    key: '2',
    label: 'Delete',
  },
  {
    key: '3',
    label: 'View',
  },
];

interface AnalyticsChartProps {
  chartData?: any;
  urls?: string[];
}

const AnalyticsChart: React.FC<AnalyticsChartProps> = ({ chartData, urls }) => {
  const router = useRouter();

  const options: ChartOptions<"pie"> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "right",
        labels: {
          usePointStyle: true,
          pointStyle: "circle",
          boxWidth: 12,
          padding: 15,
        },
      },
    },
    onClick: (event, elements, chart) => {
      if (elements.length > 0) {
        const index = elements[0].index;
        const clickedLabel = chart.data.labels?.[index] as string;
        const urlsToUse = urls || chartUrls;
        
        const urlItem = urlsToUse.find((item: any) => 
          typeof item === 'string' ? false : item.label === clickedLabel
        );
        
        if (urlItem) {
          const url = typeof urlItem === 'string' ? urlItem : urlItem.url;
          router.push(url);
        }
      }
    },
  };

  return (
    <div className="content-wrapper">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h5 className="mb-0 fw-semibold">Urgency Status</h5>
        <div className="d-flex gap-3" style={{opacity: 0}}>
          <Select defaultValue="2025" style={{ width: 100 }} suffixIcon={<img src='/icons/chevron-down.svg' />}>
            <Select.Option value="2024">2024</Select.Option>
            <Select.Option value="2025">2025</Select.Option>
          </Select>
          <Dropdown
            menu={{ items }}
            trigger={['click']}
            placement="bottomRight"
          >
            <MoreOutlined style={{ fontSize: 20, cursor: 'pointer' }} />
          </Dropdown>
        </div>
      </div>
      <div className="" style={{ height: '230px', cursor: 'pointer' }}>
        <Pie data={chartData || defaultChartData} options={options} />
      </div>
    </div>
  );
};

export default AnalyticsChart;
