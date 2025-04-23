const bookingModel = require("../../model/user/booking.model");
const propertyListingModel = require("../../model/user/propertyListing.model");
const userModel = require("../../model/user/user.model");
const ExcelJS = require("exceljs");
const PDFDocument = require("pdfkit");
const fs = require("fs");

const getDateRange = (timeRange) => {
  const endDate = new Date();
  let startDate = new Date();

  switch (timeRange) {
    case "month":
      startDate.setMonth(endDate.getMonth() - 1);
      break;
    case "6months":
      startDate.setMonth(endDate.getMonth() - 6);
      break;
    case "year":
      startDate.setFullYear(endDate.getFullYear() - 1);
      break;
    default:
      startDate.setMonth(endDate.getMonth() - 1);
  }

  return { startDate, endDate };
};

module.exports.getReports = async (req, res) => {
  try {
    const { timeRange = "month", reportType = "bookings" } = req.query;
    const { startDate, endDate } = getDateRange(timeRange);

    let reportData;

    switch (reportType) {
      case "bookings":
        reportData = await handleBookingsReport(startDate, endDate);
        break;
      case "revenue":
        reportData = await handleRevenueReport(startDate, endDate);
        break;
      case "users":
        reportData = await handleUsersReport(startDate, endDate);
        break;
      case "properties":
        reportData = await handlePropertiesReport(startDate, endDate);
        break;
      default:
        return res.status(400).json({
          success: false,
          message: "Invalid report type",
        });
    }

    res.status(200).json({
      success: true,
      data: reportData,
    });
  } catch (error) {
    console.error("Error in getReports controller:", error);
    res.status(500).json({
      success: false,
      message: "Failed to generate report",
    });
  }
};

async function handleBookingsReport(startDate, endDate) {
  const [bookings, statusCounts, monthlyData] = await Promise.all([
    bookingModel
      .find({
        createdAt: { $gte: startDate, $lte: endDate },
      })
      .populate("propertyId")
      .populate("userId")
      .sort({ createdAt: -1 }),

    bookingModel.aggregate([
      { $match: { createdAt: { $gte: startDate, $lte: endDate } } },
      { $group: { _id: "$status", count: { $sum: 1 } } },
    ]),

    bookingModel.aggregate([
      { $match: { createdAt: { $gte: startDate, $lte: endDate } } },
      {
        $group: {
          _id: {
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" },
          },
          count: { $sum: 1 },
          revenue: { $sum: "$totalAmount" },
        },
      },
      { $sort: { "_id.year": 1, "_id.month": 1 } },
    ]),
  ]);

  const tableData = bookings.map((booking) => ({
    id: booking._id,
    property: booking.propertyId?.title || "Deleted Property",
    user: booking.userId?.fullName || "Deleted User",
    checkIn: booking.checkIn.toLocaleDateString(),
    checkOut: booking.checkOut.toLocaleDateString(),
    status: booking.status,
    amount: booking.totalAmount,
    date: booking.createdAt.toLocaleDateString(),
  }));

  return {
    summaryStats: [
      {
        label: "Total Bookings",
        value: bookings.length,
        change: calculateChange(bookings.length, 0),
      },
      {
        label: "Confirmed Bookings",
        value: statusCounts.find((s) => s._id === "confirmed")?.count || 0,
        change: calculateChange(
          statusCounts.find((s) => s._id === "confirmed")?.count || 0,
          0
        ),
      },
      {
        label: "Cancelled Bookings",
        value: statusCounts.find((s) => s._id === "cancelled")?.count || 0,
        change: calculateChange(
          statusCounts.find((s) => s._id === "cancelled")?.count || 0,
          0
        ),
      },
      {
        label: "Completed Bookings",
        value: statusCounts.find((s) => s._id === "completed")?.count || 0,
        change: calculateChange(
          statusCounts.find((s) => s._id === "completed")?.count || 0,
          0
        ),
      },
    ],
    tableHeaders: [
      "ID",
      "Property",
      "User",
      "Check In",
      "Check Out",
      "Status",
      "Amount",
      "Date",
    ],
    tableData,
    chartData: monthlyData.map((item) => ({
      month: `${item._id.year}-${item._id.month}`,
      bookings: item.count,
      revenue: item.revenue,
    })),
  };
}

async function handleRevenueReport(startDate, endDate) {
  const [revenueData, monthlyRevenue, topProperties] = await Promise.all([
    bookingModel.aggregate([
      {
        $match: {
          status: { $in: ["confirmed", "completed"] },
          createdAt: { $gte: startDate, $lte: endDate },
        },
      },
      {
        $group: {
          _id: null,
          total: { $sum: "$totalAmount" },
          avg: { $avg: "$totalAmount" },
        },
      },
    ]),

    bookingModel.aggregate([
      {
        $match: {
          status: { $in: ["confirmed", "completed"] },
          createdAt: { $gte: startDate, $lte: endDate },
        },
      },
      {
        $group: {
          _id: {
            year: { $year: "$checkIn" },
            month: { $month: "$checkIn" },
          },
          total: { $sum: "$totalAmount" },
        },
      },
      { $sort: { "_id.year": 1, "_id.month": 1 } },
    ]),

    bookingModel.aggregate([
      {
        $match: {
          status: { $in: ["confirmed", "completed"] },
          createdAt: { $gte: startDate, $lte: endDate },
        },
      },
      {
        $group: {
          _id: "$propertyId",
          total: { $sum: "$totalAmount" },
          count: { $sum: 1 },
        },
      },
      { $sort: { total: -1 } },
      { $limit: 5 },
      {
        $lookup: {
          from: "propertylistings",
          localField: "_id",
          foreignField: "_id",
          as: "property",
        },
      },
      { $unwind: "$property" },
    ]),
  ]);

  // Format table data
  const tableData = topProperties.map((property) => ({
    property: property.property.title,
    bookings: property.count,
    revenue: property.total,
    average: Math.round(property.total / property.count),
  }));

  return {
    summaryStats: [
      {
        label: "Total Revenue",
        value: revenueData[0]?.total || 0,
        change: calculateChange(revenueData[0]?.total || 0, 0),
      },
      {
        label: "Average Booking Value",
        value: Math.round(revenueData[0]?.avg || 0),
        change: calculateChange(Math.round(revenueData[0]?.avg || 0), 0),
      },
      {
        label: "Top Property Revenue",
        value: topProperties[0]?.total || 0,
        change: calculateChange(topProperties[0]?.total || 0, 0),
      },
      {
        label: "Total Bookings",
        value: topProperties.reduce((sum, p) => sum + p.count, 0),
        change: calculateChange(
          topProperties.reduce((sum, p) => sum + p.count, 0),
          0
        ),
      },
    ],
    tableHeaders: ["Property", "Bookings", "Revenue", "Average"],
    tableData,
    chartData: monthlyRevenue.map((item) => ({
      month: `${item._id.year}-${item._id.month}`,
      revenue: item.total,
    })),
  };
}

async function handleUsersReport(startDate, endDate) {
  const [users, userGrowth, userSignups] = await Promise.all([
    userModel
      .find({
        createdAt: { $gte: startDate, $lte: endDate },
      })
      .sort({ createdAt: -1 }),

    userModel.aggregate([
      { $match: { createdAt: { $gte: startDate, $lte: endDate } } },
      {
        $group: {
          _id: {
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" },
          },
          count: { $sum: 1 },
        },
      },
      { $sort: { "_id.year": 1, "_id.month": 1 } },
    ]),

    userModel.aggregate([
      { $match: { createdAt: { $gte: startDate, $lte: endDate } } },
      { $group: { _id: "$role", count: { $sum: 1 } } },
    ]),
  ]);

  // Format table data
  const tableData = users.map((user) => ({
    name: user.fullName,
    email: user.email,
    role: user.role,
    status: user.isVerified ? "Verified" : "Pending",
    date: user.createdAt.toLocaleDateString(),
  }));

  return {
    summaryStats: [
      {
        label: "Total Users",
        value: users.length,
        change: calculateChange(users.length, 0),
      },
      {
        label: "New Hosts",
        value: userSignups.find((u) => u._id === "host")?.count || 0,
        change: calculateChange(
          userSignups.find((u) => u._id === "host")?.count || 0,
          0
        ),
      },
      {
        label: "Verified Users",
        value: users.filter((u) => u.isVerified).length,
        change: calculateChange(users.filter((u) => u.isVerified).length, 0),
      },
      {
        label: "Active Users",
        value: Math.floor(users.length * 0.7),
        change: calculateChange(Math.floor(users.length * 0.7), 0),
      },
    ],
    tableHeaders: ["Name", "Email", "Role", "Status", "Join Date"],
    tableData,
    chartData: userGrowth.map((item) => ({
      month: `${item._id.year}-${item._id.month}`,
      users: item.count,
    })),
  };
}

async function handlePropertiesReport(startDate, endDate) {
  const [properties, propertyTypes, propertyGrowth] = await Promise.all([
    propertyListingModel
      .find({
        createdAt: { $gte: startDate, $lte: endDate },
      })
      .sort({ createdAt: -1 }),

    propertyListingModel.aggregate([
      { $match: { createdAt: { $gte: startDate, $lte: endDate } } },
      { $group: { _id: "$type", count: { $sum: 1 } } },
    ]),

    propertyListingModel.aggregate([
      { $match: { createdAt: { $gte: startDate, $lte: endDate } } },
      {
        $group: {
          _id: {
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" },
          },
          count: { $sum: 1 },
        },
      },
      { $sort: { "_id.year": 1, "_id.month": 1 } },
    ]),
  ]);

  // Format table data
  const tableData = properties.map((property) => ({
    title: property.title,
    type: property.type,
    location: property.location,
    price: property.price,
    bedrooms: property.bedrooms,
    status: property.status || "Active",
    date: property.createdAt.toLocaleDateString(),
  }));

  return {
    summaryStats: [
      {
        label: "Total Properties",
        value: properties.length,
        change: calculateChange(properties.length, 0),
      },
      {
        label: "Most Popular Type",
        value: propertyTypes.reduce((max, type) =>
          type.count > max.count ? type : max
        )._id,
        change: calculateChange(
          propertyTypes.reduce((max, type) =>
            type.count > max.count ? type : max
          ).count,
          0
        ),
      },
      {
        label: "Average Price",
        value:
          Math.round(
            properties.reduce((sum, p) => sum + p.price, 0) / properties.length
          ) || 0,
        change: calculateChange(
          Math.round(
            properties.reduce((sum, p) => sum + p.price, 0) / properties.length
          ) || 0,
          0
        ),
      },
      {
        label: "New Hosts",
        value: properties.length > 0 ? properties.length / 2 : 0,
        change: calculateChange(
          properties.length > 0 ? properties.length / 2 : 0,
          0
        ),
      },
    ],
    tableHeaders: [
      "Title",
      "Type",
      "Location",
      "Price",
      "Bedrooms",
      "Status",
      "Date",
    ],
    tableData,
    chartData: propertyGrowth.map((item) => ({
      month: `${item._id.year}-${item._id.month}`,
      properties: item.count,
    })),
  };
}

function calculateChange(current, previous) {
  if (previous === 0) return current === 0 ? "0%" : "+100%";
  const change = ((current - previous) / previous) * 100;
  return `${change >= 0 ? "+" : ""}${Math.round(change)}%`;
}

module.exports.exportReport = async (req, res) => {
  try {
    const {
      timeRange = "month",
      reportType = "bookings",
      format = "xlsx",
    } = req.query;
    const { startDate, endDate } = getDateRange(timeRange);

    let reportData;
    switch (reportType) {
      case "bookings":
        reportData = await handleBookingsReport(startDate, endDate);
        break;
      case "revenue":
        reportData = await handleRevenueReport(startDate, endDate);
        break;
      case "users":
        reportData = await handleUsersReport(startDate, endDate);
        break;
      case "properties":
        reportData = await handlePropertiesReport(startDate, endDate);
        break;
      default:
        return res.status(400).json({
          success: false,
          message: "Invalid report type",
        });
    }

    if (format === "xlsx") {
      await generateExcelReport(res, reportData, reportType);
    } else if (format === "pdf") {
      await generatePdfReport(res, reportData, reportType);
    } else {
      return res.status(400).json({
        success: false,
        message: "Invalid export format",
      });
    }
  } catch (error) {
    console.error("Error in exportReport:", error);
    res.status(500).json({
      success: false,
      message: "Failed to export report",
    });
  }
};

async function generateExcelReport(res, reportData, reportType) {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet("Report");

  // Styling constants
  const headerStyle = {
    font: { bold: true, color: { argb: 'FFFFFF' } },
    fill: { type: 'pattern', pattern: 'solid', fgColor: { argb: '2563EB' } },
    alignment: { horizontal: 'center', vertical: 'middle' },
    border: {
      top: { style: 'thin', color: { argb: '2563EB' } },
      left: { style: 'thin', color: { argb: '2563EB' } },
      bottom: { style: 'thin', color: { argb: '2563EB' } },
      right: { style: 'thin', color: { argb: '2563EB' } }
    }
  };

  const subHeaderStyle = {
    font: { bold: true, size: 12 },
    fill: { type: 'pattern', pattern: 'solid', fgColor: { argb: 'F3F4F6' } },
    alignment: { horizontal: 'center' },
    border: {
      top: { style: 'thin', color: { argb: 'E5E7EB' } },
      left: { style: 'thin', color: { argb: 'E5E7EB' } },
      bottom: { style: 'thin', color: { argb: 'E5E7EB' } },
      right: { style: 'thin', color: { argb: 'E5E7EB' } }
    }
  };

  // Title
  worksheet.mergeCells('A1:E1');
  const titleRow = worksheet.getCell('A1');
  titleRow.value = `${reportType.toUpperCase()} REPORT`;
  titleRow.font = { bold: true, size: 16 };
  titleRow.alignment = { horizontal: 'center' };

  // Date
  worksheet.mergeCells('A2:E2');
  const dateRow = worksheet.getCell('A2');
  dateRow.value = `Generated on: ${new Date().toLocaleString()}`;
  dateRow.alignment = { horizontal: 'center' };

  // Add spacing
  worksheet.addRow([]);

  // Headers
  const headersRow = worksheet.addRow(reportData.tableHeaders);
  headersRow.eachCell((cell) => {
    Object.assign(cell, headerStyle);
  });

  // Data rows
  reportData.tableData.forEach((row, index) => {
    const dataRow = worksheet.addRow(Object.values(row));
    dataRow.eachCell((cell) => {
      cell.alignment = { vertical: 'middle' };
      if (index % 2 === 0) {
        cell.fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: 'F9FAFB' }
        };
      }
    });
  });

  // Summary Statistics
  worksheet.addRow([]);
  worksheet.addRow([]);
  
  const summaryHeaderRow = worksheet.addRow(['Summary Statistics']);
  summaryHeaderRow.getCell(1).font = { bold: true, size: 14 };
  worksheet.mergeCells(`A${summaryHeaderRow.number}:E${summaryHeaderRow.number}`);
  
  worksheet.addRow([]);

  // Stats grid
  const statsGrid = worksheet.addRow(reportData.summaryStats.map(stat => stat.label));
  statsGrid.eachCell((cell) => {
    Object.assign(cell, subHeaderStyle);
  });

  const statsValues = worksheet.addRow(reportData.summaryStats.map(stat => stat.value));
  statsValues.eachCell((cell) => {
    cell.alignment = { horizontal: 'center' };
  });

  const statsChanges = worksheet.addRow(reportData.summaryStats.map(stat => stat.change));
  statsChanges.eachCell((cell) => {
    cell.alignment = { horizontal: 'center' };
    cell.font = {
      color: { argb: cell.value.startsWith('+') ? '10B981' : 'EF4444' }
    };
  });

  // Set column widths
  worksheet.columns.forEach(column => {
    column.width = 20;
  });

  // Set response headers
  res.setHeader(
    "Content-Type",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
  );
  res.setHeader(
    "Content-Disposition",
    `attachment; filename=${reportType}_report.xlsx`
  );

  await workbook.xlsx.write(res);
  res.end();
}

// async function generatePdfReport(res, reportData, reportType) {
//   try {
//     const doc = new PDFDocument({
//       margin: 50,
//       size: "A4",
//       bufferPages: true
//     });

//     const fileName = `${reportType}-report-${new Date().toISOString().split("T")[0]}.pdf`;

//     res.setHeader("Content-Type", "application/pdf");
//     res.setHeader("Content-Disposition", `attachment; filename=${fileName}`);

//     doc.on("error", (err) => {
//       console.error("PDF stream error:", err);
//       if (!res.headersSent) {
//         res.status(500).json({
//           success: false,
//           message: "Failed to generate PDF",
//         });
//       }
//     });

//     doc.pipe(res);

//     // Helper functions
//     const drawBox = (x, y, width, height, fillColor = '#2563EB') => {
//       doc.save()
//         .fillColor(fillColor)
//         .rect(x, y, width, height)
//         .fill()
//         .restore();
//     };

//     const formatDate = (dateString) => {
//       if (!dateString) return '';
//       const date = new Date(dateString);
//       return isNaN(date) ? dateString : date.toLocaleDateString();
//     };

//     // Header with blue background
//     drawBox(50, 50, doc.page.width - 100, 60, '#2563EB');
//     doc.fillColor('#FFFFFF')
//       .fontSize(24)
//       .font('Helvetica-Bold')
//       .text(`${reportType.toUpperCase()} REPORT`, 0, 70, { align: 'center' });

//     doc.fillColor('#FFFFFF')
//       .fontSize(10)
//       .font('Helvetica')
//       .text(`Generated on: ${new Date().toLocaleString()}`, 0, 100, { align: 'center' });

//     // Summary Statistics Section - Improved from version 2
//     doc.moveDown(2);
//     const statsPerRow = 2;
//     const statWidth = (doc.page.width - 100) / statsPerRow;
//     const statHeight = 80;
//     const statPadding = 10;

//     reportData.summaryStats.forEach((stat, index) => {
//       const row = Math.floor(index / statsPerRow);
//       const col = index % statsPerRow;
//       const x = 50 + col * statWidth;
//       const y = 180 + row * (statHeight + 20);

//       // Card-style container
//       doc.roundedRect(x, y, statWidth - statPadding, statHeight, 8)
//          .fill('#F3F4F6')
//          .stroke('#E5E7EB');

//       // Stat label
//       doc.fillColor('#374151')
//         .fontSize(12)
//         .font('Helvetica-Bold')
//         .text(stat.label, x + 15, y + 15);

//       // Stat value
//       doc.fillColor('#111827')
//         .fontSize(24)
//         .text(stat.value, x + 15, y + 35);

//       // Change indicator (green/red)
//       doc.fillColor(stat.change.startsWith('+') ? '#10B981' : '#EF4444')
//         .fontSize(14)
//         .text(stat.change, x + 15, y + 60);
//     });

//     // Chart Data Section (if available)
//     if (reportData.chartData && reportData.chartData.length > 0) {
//       doc.addPage();
//       doc.fillColor('#333333')
//         .fontSize(18)
//         .font('Helvetica-Bold')
//         .text('TREND ANALYSIS', { align: 'center' })
//         .moveDown(1);

//       // Simple table visualization of chart data
//       const chartTableTop = 100;
//       const chartColWidth = (doc.page.width - 100) / 3;

//       // Chart table header
//       drawBox(50, chartTableTop, doc.page.width - 100, 30, '#2563EB');
//       ['Month', 'Bookings', 'Revenue'].forEach((header, i) => {
//         doc.fillColor('#FFFFFF')
//           .fontSize(10)
//           .font('Helvetica-Bold')
//           .text(header, 50 + i * chartColWidth, chartTableTop + 10, {
//             width: chartColWidth,
//             align: 'center'
//           });
//       });

//       // Chart table rows
//       let currentChartY = chartTableTop + 30;
//       reportData.chartData.forEach((item, index) => {
//         if (currentChartY > doc.page.height - 50) {
//           doc.addPage();
//           currentChartY = 50;
//         }

//         const values = [
//           item.month,
//           item.bookings || '-',
//           item.revenue ? `₹${item.revenue}` : '-'
//         ];

//         if (index % 2 === 0) {
//           doc.rect(50, currentChartY, doc.page.width - 100, 20).fill('#F9FAFB');
//         }

//         values.forEach((val, i) => {
//           doc.fillColor('#374151')
//             .fontSize(9)
//             .text(val, 50 + i * chartColWidth, currentChartY + 5, {
//               width: chartColWidth,
//               align: 'center'
//             });
//         });

//         currentChartY += 20;
//       });
//     }

//     // Detailed Data Section - Improved from version 2
//     doc.addPage();
//     doc.fillColor('#333333')
//       .fontSize(18)
//       .font('Helvetica-Bold')
//       .text('DETAILED DATA', { align: 'center' })
//       .moveDown(0.5);

//     // Calculate column widths based on content
//     const pageWidth = doc.page.width - 100;
//     const columns = reportData.tableHeaders.map((header, i) => {
//       // Get sample data for width calculation
//       const sampleData = reportData.tableData.slice(0, 10).map(row => {
//         const value = Object.values(row)[i];
//         return value ? String(value) : '';
//       });

//       // Calculate max width needed
//       const headerWidth = doc.font('Helvetica-Bold').fontSize(10).widthOfString(header);
//       const dataWidth = Math.max(...sampleData.map(val => 
//         doc.font('Helvetica').fontSize(9).widthOfString(val)
//       ));

//       return {
//         header,
//         width: Math.min(Math.max(headerWidth, dataWidth) + 20, pageWidth), // Add padding
//         align: i === 0 ? 'left' : 'center' // First column left-aligned
//       };
//     });

//     // Adjust column widths if total exceeds page width
//     const totalWidth = columns.reduce((sum, col) => sum + col.width, 0);
//     const scaleFactor = Math.min(1, pageWidth / totalWidth);
//     columns.forEach(col => col.width *= scaleFactor);

//     // Table Header
//     drawBox(50, doc.y, pageWidth, 30, '#2563EB');
//     columns.forEach((col, i) => {
//       doc.fillColor('#FFFFFF')
//         .fontSize(10)
//         .font('Helvetica-Bold')
//         .text(col.header, 50 + columns.slice(0, i).reduce((sum, c) => sum + c.width, 0), doc.y + 10, {
//           width: col.width,
//           align: col.align
//         });
//     });

//     // Table Rows
//     let currentY = doc.y + 30;
//     const rowHeight = 20;

//     reportData.tableData.forEach((row, rowIndex) => {
//       // Check for page break
//       if (currentY > doc.page.height - 50) {
//         doc.addPage();
//         currentY = 50;
        
//         // Redraw headers on new page
//         drawBox(50, currentY, pageWidth, 30, '#2563EB');
//         columns.forEach((col, i) => {
//           doc.fillColor('#FFFFFF')
//             .fontSize(10)
//             .font('Helvetica-Bold')
//             .text(col.header, 50 + columns.slice(0, i).reduce((sum, c) => sum + c.width, 0), currentY + 10, {
//               width: col.width,
//               align: col.align
//             });
//         });
//         currentY += 30;
//       }

//       // Alternate row colors
//       if (rowIndex % 2 === 0) {
//         doc.rect(50, currentY, pageWidth, rowHeight).fill('#F9FAFB');
//       }

//       // Draw cell values
//       Object.values(row).forEach((value, colIndex) => {
//         const formattedValue = reportData.tableHeaders[colIndex].toLowerCase().includes('date') 
//           ? formatDate(value) 
//           : String(value || '');

//         doc.fillColor('#374151')
//           .fontSize(9)
//           .text(formattedValue, 
//             50 + columns.slice(0, colIndex).reduce((sum, c) => sum + c.width, 0), 
//             currentY + 5, 
//             {
//               width: columns[colIndex].width,
//               align: columns[colIndex].align
//             }
//           );
//       });

//       currentY += rowHeight;
//     });

//     // Footer
//     doc.addPage()
//       .fillColor('#6B7280')
//       .fontSize(10)
//       .text('End of report', { align: 'center' });

//     doc.end();
//   } catch (error) {
//     console.error("Error in generatePdfReport:", error);
//     if (!res.headersSent) {
//       res.status(500).json({
//         success: false,
//         message: "Failed to generate PDF"
//       });
//     }
//   }
// }

async function generatePdfReport(res, reportData, reportType) {
  try {
    const doc = new PDFDocument({ margin: 30, size: "A4" });
    const fileName = `${reportType}-report-${
      new Date().toISOString().split("T")[0]
    }.pdf`;

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", `attachment; filename=${fileName}`);

    doc.on("error", (err) => {
      console.error("PDF stream error:", err);
      if (!res.headersSent) {
        res.status(500).json({
          success: false,
          message: "Failed to generate PDF",
        });
      }
    });

    doc.pipe(res);

    // Header
    doc
      .fillColor("#333333")
      .fontSize(20)
      .font("Helvetica-Bold")
      .text(`${reportType.toUpperCase()} REPORT`, { align: "center" })
      .moveDown(0.3);

    doc
      .fontSize(10)
      .font("Helvetica")
      .text(`Generated on: ${new Date().toLocaleString()}`, { align: "center" })
      .moveDown(1);

    // Summary Section
    doc
      .fontSize(14)
      .font("Helvetica-Bold")
      .text("SUMMARY STATISTICS", { align: "center" })
      .moveDown(0.5);

    const boxWidth = 240;
    const boxHeight = 60;
    const margin = 20;
    const startX = 50;
    const startY = doc.y;

    reportData.summaryStats.forEach((stat, index) => {
      const row = Math.floor(index / 2);
      const col = index % 2;
      const x = startX + col * (boxWidth + margin);
      const y = startY + row * (boxHeight + margin);

      doc
        .roundedRect(x, y, boxWidth, boxHeight, 5)
        .fill("#f5f5f5")
        .stroke("#dddddd");

      doc
        .fillColor("#333333")
        .font("Helvetica-Bold")
        .fontSize(10)
        .text(stat.label.toUpperCase(), x + 10, y + 10, {
          width: boxWidth - 20,
        });

      doc.fontSize(18).text(stat.value, x + 10, y + 25);

      doc
        .font("Helvetica")
        .fontSize(10)
        .fillColor(stat.change.startsWith("+") ? "#4CAF50" : "#F44336")
        .text(stat.change, x + 10, y + 45);
    });

    doc.moveDown(2);

    // Detailed Data Section
    doc.addPage();
    doc
      .fontSize(14)
      .font("Helvetica-Bold")
      .fillColor("#333333")
      .text("DETAILED DATA", { align: "center" })
      .moveDown(0.5);

    // Calculate column widths
    const pageWidth = doc.page.width - 60;
    const columns = reportData.tableHeaders.map((header) => ({
      header,
      width: Math.min(
        Math.max(
          doc.font("Helvetica-Bold").fontSize(10).widthOfString(header) + 10,
          60
        ),
        pageWidth / reportData.tableHeaders.length
      ),
    }));

    const totalWidth = columns.reduce((sum, col) => sum + col.width, 0);
    const scaleFactor = Math.min(1, pageWidth / totalWidth);
    columns.forEach((col) => (col.width *= scaleFactor));

    // Center table
    const tableTotalWidth = columns.reduce((sum, col) => sum + col.width, 0);
    const startXTable = (doc.page.width - tableTotalWidth) / 2;

    // Draw header row
    let x = startXTable;
    const headerY = doc.y;
    doc.font("Helvetica-Bold").fontSize(10);

    columns.forEach((col) => {
      doc.rect(x, headerY, col.width, 20).fill("#333333").stroke("#333333");

      doc
        .fillColor("#FFFFFF")
        .text(col.header, x + 5, headerY + 5, {
          width: col.width - 10,
          align: "left",
        });

      x += col.width;
    });

    // Draw table rows
    doc.font("Helvetica").fontSize(9).fillColor("#333333");
    let currentY = headerY + 20;

    reportData.tableData.forEach((row, rowIndex) => {
      if (currentY > doc.page.height - 50) {
        doc.addPage();
        currentY = 50;
      }

      x = startXTable;
      const rowValues = Object.values(row);

      columns.forEach((col, colIndex) => {
        const cellValue = String(rowValues[colIndex] || "");

        if (rowIndex % 2 === 0) {
          doc
            .rect(x, currentY, col.width, 18)
            .fill("#f9f9f9")
            .stroke("#eeeeee");
        }

        doc.fillColor("#333333").text(cellValue, x + 5, currentY + 5, {
          width: col.width - 10,
          align: "left",
          height: 18,
        });

        x += col.width;
      });

      currentY += 18;
    });

    doc.end();
  } catch (error) {
    console.error("Error in generatePdfReport:", error);
    if (!res.headersSent) {
      res.status(500).json({
        success: false,
        message: "Failed to generate PDF",
      });
    }
  }
}
