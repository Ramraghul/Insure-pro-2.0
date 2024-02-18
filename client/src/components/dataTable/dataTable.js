import "primereact/resources/themes/lara-light-cyan/theme.css";
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FilterMatchMode } from 'primereact/api';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { InputText } from 'primereact/inputtext';
import { Button } from "primereact/button";

export default function BasicFilterDemo() {
    const [customers, setCustomers] = useState([]);
    const [filters, setFilters] = useState({
        global: { value: null, matchMode: FilterMatchMode.CONTAINS },
        Date: { value: null, matchMode: FilterMatchMode.BETWEEN },
        SKU: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
    });
    const [loading, setLoading] = useState(false);
    const [globalFilterValue, setGlobalFilterValue] = useState('');
    const [first, setFirst] = useState(0);
    const paginatorLeft = <Button type="button" icon="pi pi-refresh" text />;
    const paginatorRight = <Button type="button" icon="pi pi-download" text />;

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const response = await axios.get('http://localhost:8765/api/getAllSalesData');
                setCustomers(response.data.data);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching data:', error);
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const onGlobalFilterChange = (e) => {
        const value = e.target.value;
        let _filters = { ...filters };
        _filters['global'].value = value;
        setFilters(_filters);
        setGlobalFilterValue(value);
    };

    const header = (
        <div className="flex justify-content-end">
            <span className="p-input-icon-left">
                <i className="pi pi-search" />
                <InputText value={globalFilterValue} onChange={onGlobalFilterChange} placeholder="Keyword Search" />
            </span>
        </div>
    );

    return (
        <div className="card">
            <DataTable value={customers} paginator rows={8} filters={filters} filterMatchMode="row" loading={loading}
                globalFilterFields={['Date', 'SKU', 'Unit_Price', 'Quantity', 'Total_Price']} header={header} emptyMessage="No customers found."
                first={first} onPage={(e) => setFirst(e.first)} totalRecords={customers.length}
                paginatorTemplate="RowsPerPageDropdown FirstPageLink PrevPageLink CurrentPageReport NextPageLink LastPageLink"
                currentPageReportTemplate="{first} to {last} of {totalRecords}" paginatorLeft={paginatorLeft} paginatorRight={paginatorRight}>
                <Column sortable field="Date" header="Date" filter filterPlaceholder="Search by Date" style={{ minWidth: '12rem' }} />
                <Column sortable field="SKU" header="SKU" filter filterField="SKU" style={{ minWidth: '12rem' }} filterPlaceholder="Search by SKU" />
                <Column sortable field="Unit_Price" header="Unit Price" style={{ minWidth: '14rem' }} />
                <Column sortable field="Quantity" header="Quantity" style={{ minWidth: '12rem' }} />
                <Column sortable field="Total_Price" header="Total Price" style={{ minWidth: '6rem' }}/>
            </DataTable>
        </div>
    );
}
