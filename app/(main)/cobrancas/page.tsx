'use client';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import React, { useState } from 'react';
import { Calendar } from 'primereact/calendar';
import { Nullable } from 'primereact/ts-helpers';
import { Dropdown } from 'primereact/dropdown';
import { Paginator } from 'primereact/paginator';
import { Sidebar } from 'primereact/sidebar';
import { StyedCalendar, StyedDivBuscarCobrancas, StyedDivCalendar, StyedDivDropdown, StyedInputBuscar } from './styles/styled';

interface InputValue {
    name: string;
    code: string;
}
function Cobrancas() {
    const [dropdownValuesCobrancas, setDropdownValuesCobrancas] = useState(null);
    const [first, setFirst] = useState(0);
    const [rows, setRows] = useState(10);
    const [visibleRight, setVisibleRight] = useState<boolean>(false);

    const [date, setDate] = useState<Nullable<Date>>(null);
    const dropdownValuesCobranca: InputValue[] = [
        { name: 'Todos', code: 'Todos' },
        { name: 'Dinheiro', code: 'Dinheiro' },
        { name: 'Cheque', code: 'Cheque' }
    ];

    const onPageChange = (event: { first: React.SetStateAction<number>; rows: React.SetStateAction<number> }) => {
        setFirst(event.first);
        setRows(event.rows);
    };

    return (
        <div className="grid">
            <div style={{ width: '100%' }}>
                <div className="card" >
                    <div >
                        <div >
                            <div style={StyedDivBuscarCobrancas}>
                                <span className="p-float-label p-input-icon-left">
                                    <i className="pi pi-search" />
                                    <InputText className="searchInput" type="text" placeholder="Buscar" style={StyedInputBuscar} />
                                    <label htmlFor="lefticon">Buscar</label>
                                </span>
                            </div>
                            <div style={StyedDivCalendar}>
                                <span>
                                    <Calendar placeholder="Filtrar mês" style={StyedCalendar} value={date} onChange={(e) => setDate(e.value)} view="month" dateFormat="mm/yy" />
                                    <label htmlFor="calendar1"></label>
                                </span>
                            </div>
                            <div style={StyedDivDropdown}>
                                <Dropdown value={dropdownValuesCobrancas} onChange={(e) => setDropdownValuesCobrancas(e.value)} options={dropdownValuesCobranca} optionLabel="name" placeholder="Forma de recebimento" style={{ width: '100%' }} />
                            </div>

                            <div className='container-button-primary-novo'>
                                <Button label="Novo" icon="pi pi-plus"  />
                            </div>
                            <div>
                                <Button  icon="pi pi-send" onClick={() => setVisibleRight(true)} outlined />
                                <Sidebar style={{ margin: '0' }} visible={visibleRight} position="right" onHide={() => setVisibleRight(false)}>
                                    <h2 style={{ fontSize: '20px' }}>Boletos</h2>
                                </Sidebar>
                            </div>
                        </div>
                    </div>
                    {/* <ComponentDataTable/> */}
                    <div style={{ marginTop: 'auto' }}>
                        <Paginator first={first} rows={rows} totalRecords={120} rowsPerPageOptions={[10, 20, 30]} onPageChange={onPageChange} />
                    </div>
                </div>
            </div>
        </div>
    );
}
export default Cobrancas;
