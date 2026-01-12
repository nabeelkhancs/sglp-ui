// components/AnalyticsChart.tsx
"use client";
import Cookies from "js-cookie";

import { Card, Select, Dropdown, Menu } from "antd";
import { Doughnut, Pie } from "react-chartjs-2";
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
    "Total Cases",
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
  { label: "High Court", url: "/cases/highcourt"},          // highcourt
  { label: "Supreme Court", url: "/cases/supremecourt"},       // supremecourt
  { label: "District Courts", url: "/cases/districtcourts"},     // districtcourts
  { label: "Other Courts", url: "/cases/othercourts"},       // othercourts
];
const othersChartUrls = [
  { label: "High Court", url: "/cases/submitted?court=highcourt"},        // highcourt
  { label: "Supreme Court", url:  "/cases/submitted?court=supremecourt"},
  { label: "District Courts", url: "/cases/submitted?court=districtcourts"},
  { label: "Other Courts", url: "/cases/submitted?court=othercourts"},
];

const userType = Cookies.get("userType");


const chartUrls = userType === 'ADMIN' ? adminChartUrls : othersChartUrls;

const options: ChartOptions<"doughnut"> = {
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

interface AnalyticsChart2Props {
  chartData?: any;
  urls?: string[];
}

const AnalyticsChart2: React.FC<AnalyticsChart2Props> = ({ chartData, urls }) => {
  const router = useRouter();

  const options: ChartOptions<"doughnut"> = {
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
        <h5 className="mb-0 fw-semibold">Courts Cases</h5>
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
        <Doughnut data={chartData || defaultChartData} options={options} />
      </div>
    </div>
  );
};

export default AnalyticsChart2;
