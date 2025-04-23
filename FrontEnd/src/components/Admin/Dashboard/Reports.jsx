import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  FaCalendarAlt, FaDownload, FaFilter, FaFileExcel, FaFilePdf 
} from 'react-icons/fa';
import { Menu, Transition } from '@headlessui/react';
import { getReports, exportReport } from '../../../services/Admin/AdminApi';
import TrendChart from '../../../components/Admin/Dashboard/TrendChart';
import { toast } from 'react-toastify';

function Reports() {
  const [timeRange, setTimeRange] = useState('month');
  const [reportType, setReportType] = useState('bookings');
  const [reportData, setReportData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isExporting, setIsExporting] = useState(false);

  useEffect(() => {
    const fetchReportData = async () => {
      setIsLoading(true);
      try {
        const data = await getReports(timeRange, reportType);
        setReportData(data);
      } catch (error) {
        console.error('Error fetching report data:', error);
        toast.error('Failed to load report data');
      } finally {
        setIsLoading(false);
      }
    };
    fetchReportData();
  }, [timeRange, reportType]);

  const handleExport = async (format) => {
    setIsExporting(true);
    try {
      await exportReport(timeRange, reportType, format);
      toast.success(`Report exported successfully as ${format.toUpperCase()}`);
    } catch (error) {
      console.error('Export failed:', error);
      toast.error(error.message || 'Failed to export report');
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="p-8">
      {/* Header with Export Dropdown */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Reports & Analytics</h1>
          <p className="text-gray-600">Generate and analyze detailed reports</p>
        </div>
        
        <Menu as="div" className="relative inline-block text-left">
          <div>
            <Menu.Button 
              className="inline-flex justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none disabled:opacity-50"
              disabled={isExporting}
            >
              {isExporting ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Exporting...
                </>
              ) : (
                <>
                  <FaDownload className="w-4 h-4 mr-2" />
                  Export Report
                </>
              )}
            </Menu.Button>
          </div>
          
          <Transition
            enter="transition ease-out duration-100"
            enterFrom="transform opacity-0 scale-95"
            enterTo="transform opacity-100 scale-100"
            leave="transition ease-in duration-75"
            leaveFrom="transform opacity-100 scale-100"
            leaveTo="transform opacity-0 scale-95"
          >
            <Menu.Items className="absolute right-0 mt-2 w-56 origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-10">
              <div className="px-1 py-1">
                <Menu.Item>
                  {({ active }) => (
                    <button
                      onClick={() => handleExport('xlsx')}
                      className={`${
                        active ? 'bg-blue-500 text-white' : 'text-gray-900'
                      } group flex w-full items-center rounded-md px-2 py-2 text-sm`}
                      disabled={isExporting}
                    >
                      <FaFileExcel className="w-4 h-4 mr-2" />
                      Export as Excel
                    </button>
                  )}
                </Menu.Item>
                <Menu.Item>
                  {({ active }) => (
                    <button
                      onClick={() => handleExport('pdf')}
                      className={`${
                        active ? 'bg-blue-500 text-white' : 'text-gray-900'
                      } group flex w-full items-center rounded-md px-2 py-2 text-sm`}
                      disabled={isExporting}
                    >
                      <FaFilePdf className="w-4 h-4 mr-2" />
                      Export as PDF
                    </button>
                  )}
                </Menu.Item>
              </div>
            </Menu.Items>
          </Transition>
        </Menu>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Time Range</label>
            <div className="flex items-center space-x-2">
              <FaCalendarAlt className="text-gray-400" />
              <select
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value)}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                disabled={isLoading}
              >
                <option value="month">Last Month</option>
                <option value="6months">Last 6 Months</option>
                <option value="year">Last Year</option>
                <option value="custom">Custom Range</option>
              </select>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Report Type</label>
            <div className="flex items-center space-x-2">
              <FaFilter className="text-gray-400" />
              <select
                value={reportType}
                onChange={(e) => setReportType(e.target.value)}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                disabled={isLoading}
              >
                <option value="bookings">Bookings Analysis</option>
                <option value="revenue">Revenue Analysis</option>
                <option value="users">User Growth</option>
                <option value="properties">Property Listings</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Report Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Summary Stats */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h3 className="text-lg font-semibold mb-6">Summary Statistics</h3>
          {isLoading ? (
            <div className="grid grid-cols-2 gap-4">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="bg-gray-50 rounded-lg p-4 animate-pulse">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-6 bg-gray-200 rounded w-1/2"></div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4">
              {reportData?.summaryStats?.map((stat, index) => (
                <div key={index} className="bg-gray-50 rounded-lg p-4">
                  <p className="text-sm text-gray-600">{stat.label}</p>
                  <p className="text-xl font-bold text-gray-900">{stat.value}</p>
                  <p className={`text-sm ${
                    stat.change.startsWith('+') ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {stat.change}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Trend Chart */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h3 className="text-lg font-semibold mb-6">Trends</h3>
          {isLoading ? (
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : (
            <TrendChart 
              chartData={reportData?.chartData || []} 
              reportType={reportType} 
            />
          )}
        </div>

        {/* Detailed Analysis */}
        <div className="bg-white rounded-xl shadow-sm p-6 lg:col-span-2">
          <h3 className="text-lg font-semibold mb-6">Detailed Analysis</h3>
          <div className="overflow-x-auto">
            {isLoading ? (
              <div className="animate-pulse">
                <div className="h-6 bg-gray-200 rounded w-1/4 mb-4"></div>
                <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="h-12 bg-gray-100 rounded w-full mb-2"></div>
                ))}
              </div>
            ) : (
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    {reportData?.tableHeaders?.map((header, index) => (
                      <th
                        key={index}
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        {header}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {reportData?.tableData?.map((row, rowIndex) => (
                    <tr key={rowIndex}>
                      {Object.values(row).map((cell, cellIndex) => (
                        <td
                          key={cellIndex}
                          className="px-6 py-4 whitespace-nowrap text-sm text-gray-900"
                        >
                          {cell}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Reports;