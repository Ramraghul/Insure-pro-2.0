import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Card, CardContent, Typography, Grid } from '@material-ui/core';
import Chart from 'chart.js/auto';

function Report() {
    const [salesData, setSalesData] = useState(null);
    const chartRefTotalSales = React.createRef();
    const chartRefMonthWiseSales = React.createRef();
    const chartRefMostPopular = React.createRef();
    const chartRefMostRevenue = React.createRef();
    const chartRefDayWiseSales = React.createRef();
    const chartRefPopularItemOrdersStats = React.createRef();

    useEffect(() => {
        const fetchSalesData = async () => {
            try {
                const response = await axios.get('http://localhost:8765/api/getSalesAnalytics');
                setSalesData(response.data.data);
            } catch (error) {
                console.error('Error fetching sales data:', error);
            }
        };
        fetchSalesData();
    }, []);

    useEffect(() => {
        let totalSalesChartInstance = null;
        let monthWiseSalesChartInstance = null;
        let mostPopularChartInstance = null;
        let mostRevenueChartInstance = null;
        let dayWiseSalesChartInstance = null;
        let popularItemOrdersStatsChartInstance = null;

        if (salesData) {
            // Total Sales
            const totalSalesData = salesData.totalSales;

            const ctxTotalSales = chartRefTotalSales.current.getContext('2d');
            if (totalSalesChartInstance) {
                totalSalesChartInstance.destroy();
            }
            totalSalesChartInstance = new Chart(ctxTotalSales, {
                type: 'doughnut',
                data: {
                    labels: ['Total Sales'],
                    datasets: [{
                        data: [totalSalesData],
                        backgroundColor: ['rgba(75, 192, 192, 0.2)'],
                        borderColor: ['rgba(75, 192, 192, 1)'],
                        borderWidth: 1,
                    }],
                },
                options: {
                    plugins: {
                        title: {
                            display: true,
                            text: 'Total Sales of the Store',
                            padding: {
                                top: 10,
                                bottom: 30
                            }
                        },
                    },
                },
            });

            // Day-wise Sales
            const dayWiseSalesLabels = Object.keys(salesData.dayWiseSales);
            const dayWiseSalesData = Object.values(salesData.dayWiseSales);

            const ctxDayWiseSales = chartRefDayWiseSales.current.getContext('2d');
            if (dayWiseSalesChartInstance) {
                dayWiseSalesChartInstance.destroy();
            }
            dayWiseSalesChartInstance = new Chart(ctxDayWiseSales, {
                type: 'line',
                data: {
                    labels: dayWiseSalesLabels,
                    datasets: [{
                        label: 'Day-wise Sales',
                        data: dayWiseSalesData,
                        fill: false,
                        borderColor: 'rgba(255, 99, 132, 1)',
                        borderWidth: 1
                    }]
                },
                options: {
                    scales: {
                        x: {
                            display: true,
                            title: {
                                display: true,
                                text: 'Date'
                            }
                        },
                        y: {
                            display: true,
                            title: {
                                display: true,
                                text: 'Sales'
                            }
                        }
                    }
                }
            });

            // Month-wise Sales
            const monthWiseSalesLabels = Object.keys(salesData.monthWiseSales);
            const monthWiseSalesData = Object.values(salesData.monthWiseSales);

            const ctxMonthWiseSales = chartRefMonthWiseSales.current.getContext('2d');
            if (monthWiseSalesChartInstance) {
                monthWiseSalesChartInstance.destroy();
            }
            monthWiseSalesChartInstance = new Chart(ctxMonthWiseSales, {
                type: 'bar',
                data: {
                    labels: monthWiseSalesLabels,
                    datasets: [{
                        label: 'Month-wise Sales',
                        data: monthWiseSalesData,
                        backgroundColor: 'rgba(54, 162, 235, 0.2)',
                        borderColor: 'rgba(54, 162, 235, 1)',
                        borderWidth: 1,
                    }],
                },
                options: {
                    scales: {
                        y: {
                            beginAtZero: true,
                        },
                    },
                },
            });

            // Most Popular Item
            const mostPopularLabels = Object.keys(salesData.mostPopularItemPerMonth);
            const mostPopularData = Object.values(salesData.mostPopularItemPerMonth).map(item => ({
                value: item.value,
                item: item.item
            }));

            const ctxMostPopular = chartRefMostPopular.current.getContext('2d');
            if (mostPopularChartInstance) {
                mostPopularChartInstance.destroy();
            }
            mostPopularChartInstance = new Chart(ctxMostPopular, {
                type: 'bar',
                data: {
                    labels: mostPopularLabels,
                    datasets: [{
                        label: 'Most Popular Item',
                        data: mostPopularData.map(item => item.value),
                        backgroundColor: 'rgba(54, 162, 235, 0.2)',
                        borderColor: 'rgba(54, 162, 235, 1)',
                        borderWidth: 1,
                    }],
                },
                options: {
                    plugins: {
                        title: {
                            display: true,
                            text: 'Most Popular Item in Each Month',
                            padding: {
                                top: 10,
                                bottom: 30
                            }
                        },
                        tooltip: {
                            callbacks: {
                                label: function (context) {
                                    var label = context.dataset.label || '';
                                    if (label) {
                                        label += ': ';
                                    }
                                    label += context.parsed.y + ' (' + mostPopularData[context.dataIndex].item + ')';
                                    return label;
                                }
                            }
                        }
                    },
                },
            });

            // Most Revenue Item
            const mostRevenueLabels = Object.keys(salesData.mostRevenueItemPerMonth);
            const mostRevenueData = Object.values(salesData.mostRevenueItemPerMonth).map(item => ({
                value: item.value,
                item: item.item
            }));

            const ctxMostRevenue = chartRefMostRevenue.current.getContext('2d');
            if (mostRevenueChartInstance) {
                mostRevenueChartInstance.destroy();
            }
            mostRevenueChartInstance = new Chart(ctxMostRevenue, {
                type: 'bar',
                data: {
                    labels: mostRevenueLabels,
                    datasets: [{
                        label: 'Most Revenue Item',
                        data: mostRevenueData.map(item => item.value),
                        backgroundColor: 'rgba(255, 99, 132, 0.2)',
                        borderColor: 'rgba(255, 99, 132, 1)',
                        borderWidth: 1,
                    }],
                },
                options: {
                    plugins: {
                        title: {
                            display: true,
                            text: 'Most Revenue Item in Each Month',
                            padding: {
                                top: 10,
                                bottom: 30
                            }
                        },
                        tooltip: {
                            callbacks: {
                                label: function (context) {
                                    var label = context.dataset.label || '';
                                    if (label) {
                                        label += ': ';
                                    }
                                    label += context.parsed.y + ' (' + mostRevenueData[context.dataIndex].item + ')';
                                    return label;
                                }
                            }
                        }
                    },
                },
            });


            // Popular Item Orders Stats
            const popularItemOrdersLabels = Object.keys(salesData.popularItemOrdersStats);
            const popularItemOrdersData = Object.values(salesData.popularItemOrdersStats);

            const ctxPopularItemOrdersStats = chartRefPopularItemOrdersStats.current.getContext('2d');
            if (popularItemOrdersStatsChartInstance) {
                popularItemOrdersStatsChartInstance.destroy();
            }
            popularItemOrdersStatsChartInstance = new Chart(ctxPopularItemOrdersStats, {
                type: 'bar',
                data: {
                    labels: popularItemOrdersLabels,
                    datasets: [{
                        label: 'Min',
                        data: popularItemOrdersData.map(stats => stats.min),
                        backgroundColor: 'rgba(255, 99, 132, 0.2)',
                        borderColor: 'rgba(255, 99, 132, 1)',
                        borderWidth: 1,
                    },
                    {
                        label: 'Max',
                        data: popularItemOrdersData.map(stats => stats.max),
                        backgroundColor: 'rgba(75, 192, 192, 0.2)',
                        borderColor: 'rgba(75, 192, 192, 1)',
                        borderWidth: 1,
                    },
                    {
                        label: 'Average',
                        data: popularItemOrdersData.map(stats => stats.average),
                        backgroundColor: 'rgba(54, 162, 235, 0.2)',
                        borderColor: 'rgba(54, 162, 235, 1)',
                        borderWidth: 1,
                    }],
                },
                options: {
                    plugins: {
                        title: {
                            display: true,
                            text: 'Popular Item Orders Stats',
                            padding: {
                                top: 10,
                                bottom: 30
                            }
                        },
                    },
                    scales: {
                        y: {
                            beginAtZero: true,
                        },
                    },
                },
            });

        }

        return () => {
            if (totalSalesChartInstance) {
                totalSalesChartInstance.destroy();
            }
            if (dayWiseSalesChartInstance) {
                dayWiseSalesChartInstance.destroy();
            }
            if (monthWiseSalesChartInstance) {
                monthWiseSalesChartInstance.destroy();
            }
            if (mostPopularChartInstance) {
                mostPopularChartInstance.destroy();
            }
            if (mostRevenueChartInstance) {
                mostRevenueChartInstance.destroy();
            }
            if (popularItemOrdersStatsChartInstance) {
                popularItemOrdersStatsChartInstance.destroy();
            }
        };
    }, [chartRefDayWiseSales, chartRefMonthWiseSales, chartRefMostPopular, chartRefMostRevenue, chartRefPopularItemOrdersStats, chartRefTotalSales, salesData]);

    return (
        <div>
            {salesData && (
                <Grid container spacing={2}>

                    <Grid item xs={12} md={5} lg={3}>   
                        <Card style={{ width: '100%', height: '100%' }}>
                            <CardContent>
                                <Typography variant="h6" component="h2">
                                    Total Sales: Rs {salesData.totalSales}
                                </Typography>
                                <canvas ref={chartRefTotalSales}></canvas>
                            </CardContent>
                        </Card>
                    </Grid>

                    <Grid item xs={12} md={0} lg={6}>
                        <Card>
                            <CardContent>
                                <Typography variant="h6" component="h2">
                                    Day-wise Sales
                                </Typography>
                                <canvas ref={chartRefDayWiseSales}></canvas>
                            </CardContent>
                        </Card>
                    </Grid>

                    <Grid item xs={12} md={5} lg={4}>
                        <Card>
                            <CardContent>
                                <Typography variant="h6" component="h2">
                                    Month-wise Sales
                                </Typography>
                                <canvas ref={chartRefMonthWiseSales}></canvas>
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid item xs={12} md={6} lg={4}>
                        <Card>
                            <CardContent>
                                <Typography variant="h6" component="h2">
                                    Most Popular Item in Each Month
                                </Typography>
                                <canvas ref={chartRefMostPopular}></canvas>
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid item xs={12} md={6} lg={4}>
                        <Card>
                            <CardContent>
                                <Typography variant="h6" component="h2">
                                    Most Revenue Item in Each Month
                                </Typography>
                                <canvas ref={chartRefMostRevenue}></canvas>
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid item xs={12} md={6} lg={4}>
                        <Card>
                            <CardContent>
                                <Typography variant="h6" component="h2">
                                    Popular Item Orders Stats
                                </Typography>
                                <canvas ref={chartRefPopularItemOrdersStats}></canvas>
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>
            )}
        </div>
    );
}

export default Report;
