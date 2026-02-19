'use client';
import '@/app/styles/styledGlobal.css';
import { Toast } from 'primereact/toast';
import { Button } from 'primereact/button';
import { useRouter } from 'next/navigation';
import { Messages } from 'primereact/messages';
import ListarContratos from './listContract/list';
import Input from '@/app/shared/include/input/input-all';
import { ContratoEntity } from '@/app/entity/ContratoEntity';
import { ChangeEvent, useEffect, useRef, useState } from 'react';
import { usePageSize } from '@/app/components/pageSize/pageSize';
import { Checkbox, CheckboxChangeEvent } from 'primereact/checkbox';
import { Paginator, PaginatorPageChangeEvent } from 'primereact/paginator';
import { useGenericSearch } from '@/app/services/debounceSearch/controller';
import { ativarContrato, deletarContrato, listContrato } from './controller/controller';
import DialogFilter from '@/app/components/dialogs/dialogFilterComponents/dialogFilter';
import { useIsDesktop, useIsMobile } from '@/app/components/responsiveCelular/responsive';

const Contratos: React.FC = () => {
    const router = useRouter();
    const pageSize = usePageSize();
    const isMobile = useIsMobile();
    const isDesktop = useIsDesktop();
    const toast = useRef<Toast>(null);
    const msgs = useRef<Messages | null>(null);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [visible, setVisible] = useState<boolean>(false);
    const [contrato, setContrato] = useState<ContratoEntity>(
        new ContratoEntity({
            ativo: true,
            id: 0,
            descricao: '',
            valor_servico: null,
            periodicidade: '',
            emitir_boleto: false,
            enviar_email: false,
            enviar_whatsapp: false,
            id_servico: 0,
            id_empresa: 0,
            id_categoria_contrato: null,
            id_forma_pagamento: null,
            id_clientes_contrato: [0]
        })
    );
    const [isContratosCreated, setIsContratosCreated] = useState(false);
    const [listarInativos, setListarInativos] = useState<boolean>(false);
    const [listPaginationContratos, setListPaginationContratos] = useState<Record<string, any>>({
        pageable: {
            pageNumber: 0,
            pageSize: 10,
            sort: {
                empty: true,
                sorted: false,
                unsorted: true
            },
            offset: 0,
            paged: true,
            unpaged: false
        },
        totalPages: 1,
        totalElements: 2,
        last: true,
        size: 20,
        number: 0,
        sort: {
            empty: true,
            sorted: false,
            unsorted: true
        },
        numberOfElements: 0,
        first: true,
        empty: false
    });
    const handleNavigate = () => {
        router.push('/contrato/created');
        setIsContratosCreated(true);
    };
    const handleListContratos = async (pageNumber?: number, _searchTerm?: string, listarInativos = false) => {
        setLoading(true);
        try {
            const contratos = await listContrato(
                {
                    ...listPaginationContratos,
                    pageable: {
                        ...listPaginationContratos.pageable,
                        pageNumber: pageNumber ?? listPaginationContratos.pageable.pageNumber,
                        pageSize: pageSize
                    }
                },
                listarInativos,
                setLoading,
                _searchTerm ?? searchTerm
            );
            setListPaginationContratos(contratos);
        } catch (error) {
            console.error('Erro ao buscar Contratos:', error);
            toast.current?.show({
                severity: 'error',
                summary: 'Erro',
                detail: 'Falha ao buscar Contratos'
            });
        } finally {
            setLoading(false);
        }
    };
    const { debouncedSearch, searchNow } = useGenericSearch({
        setter: setContrato,
        field: 'descricao',
        onSearch: (value) => handleListContratos(0, value, listarInativos)
    });
    const onPageChange = (event: PaginatorPageChangeEvent) => {
        const selectedPage = event.page;
        setListPaginationContratos((prev) => ({
            ...prev,
            pageable: {
                ...prev.pageable,
                pageNumber: selectedPage
            }
        }));
        handleListContratos(selectedPage, searchTerm, listarInativos);
    };
    const handleCheckboxChange = (e: CheckboxChangeEvent) => {
        const newValue = e.checked ?? false;
        setListarInativos(newValue);
        handleListContratos(0, searchTerm, newValue);
        setVisible(false);
    };
    const handleSearchChange = (event: ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value;
        setSearchTerm(value);
        debouncedSearch(value);
    };
    const handleSalvarFiltro = () => {
        handleListContratos(0, searchTerm, listarInativos);
        setVisible(false);
    };
    const handleCheckboxChangeMobile = (e: CheckboxChangeEvent) => {
        setListarInativos(e.checked ?? false);
    };
    const handleCancelarFiltro = () => {
        setVisible(false);
    };
    useEffect(() => {
        handleListContratos();
    }, []);
    return (
        <div className="p-fluid">
            <Messages ref={msgs} className="custom-messages" />
            {isMobile && (
                <>
                    <div className="grid formgrid" style={{ maxHeight: '74px' }}>
                        <div className="col-8 mb-0 lg:col-6 lg:mb-0 p-0 ">
                            <Input
                                label="Buscar"
                                outlined={true}
                                id="descricao"
                                useRightButton={true}
                                iconRight={'pi pi-search'}
                                onChange={handleSearchChange}
                                value={searchTerm}
                                loading={loading}
                                onClickSearch={() => searchNow(searchTerm)}
                                topLabel="Contratos:"
                                showTopLabel
                            />
                        </div>
                        <div className="col-4 mb-0 lg:col-2 p-0 ">
                            <div className="container-BTN-Filter-Created ">
                                <Button className="height-2-8rem-ml-1rem" icon="pi pi-filter" onClick={() => setVisible(true)} outlined />
                                <Button icon="pi pi-plus" className="ml-1rem" onClick={handleNavigate} />
                            </div>
                        </div>
                    </div>
                    <DialogFilter visible={visible} header="Filtro" onHide={() => setVisible(false)} onSave={handleSalvarFiltro} onCancel={handleCancelarFiltro}>
                        <div className="checkBoxMobile-width-max-10rem">
                            <div className="checkbox-container">
                                <Checkbox inputId="listarInativos" onChange={handleCheckboxChangeMobile} checked={listarInativos} />
                                <label htmlFor="listarInativos" className="ml-2">
                                    Listar Desativadas
                                </label>
                            </div>
                        </div>
                    </DialogFilter>
                    <div className="mt-1">
                        <ListarContratos
                            loading={loading}
                            listPaginationContratos={listPaginationContratos}
                            setLoading={setLoading}
                            searchTerm={searchTerm}
                            listarInativos={listarInativos}
                            setListPaginationContratos={setListPaginationContratos}
                            deletar={(id) => deletarContrato(id, msgs, listPaginationContratos, listarInativos, setLoading, searchTerm)}
                            ativar={(id) => ativarContrato(id, msgs, listPaginationContratos, listarInativos, setLoading, searchTerm)}
                        />
                    </div>
                    <div style={{ marginTop: 'auto' }}>
                        <div className="custom-paginator">
                            <Paginator
                                first={listPaginationContratos.pageable.pageNumber * listPaginationContratos.pageable.pageSize}
                                rows={listPaginationContratos.pageable.pageSize}
                                totalRecords={listPaginationContratos.totalElements}
                                onPageChange={onPageChange}
                                template={{
                                    layout: 'PrevPageLink CurrentPageReport NextPageLink',
                                    CurrentPageReport: (options) => {
                                        const pageNumber = Math.floor(options.first / options.rows) + 1;
                                        return (
                                            <span>
                                                Página {pageNumber} de {options.totalPages}
                                            </span>
                                        );
                                    }
                                }}
                            />
                        </div>
                    </div>
                </>
            )}
            {isDesktop && (
                <>
                    <div className="card styled-container-main-all-routes p-2">
                        <div className="scrollable-container">
                            <div className="p-0">
                                <div className="grid formgrid">
                                    <div className="col-12 lg:col-3 container-input-search-all">
                                        <Input
                                            label="Buscar"
                                            outlined={true}
                                            id="descricao"
                                            useRightButton={true}
                                            iconRight={'pi pi-search'}
                                            onChange={handleSearchChange}
                                            value={searchTerm}
                                            loading={loading}
                                            onClickSearch={() => searchNow(searchTerm)}
                                            topLabel="Contratos:"
                                            showTopLabel
                                        />
                                    </div>
                                    <div className="checkbox-container">
                                        <Checkbox inputId="listarInativos" onChange={handleCheckboxChange} checked={listarInativos} />
                                        <label htmlFor="listarInativos" className="ml-2">
                                            Listar Desativadas
                                        </label>
                                    </div>
                                    <div className="container-button-primary-novo">
                                        <Button label="Novo" icon="pi pi-plus" onClick={handleNavigate} className="p-button-primary-novo" />
                                    </div>
                                </div>
                            </div>
                            <div className="mt-3">
                                <ListarContratos
                                    loading={loading}
                                    listPaginationContratos={listPaginationContratos}
                                    setLoading={setLoading}
                                    searchTerm={searchTerm}
                                    listarInativos={listarInativos}
                                    setListPaginationContratos={setListPaginationContratos}
                                    deletar={(id) => deletarContrato(id, msgs, listPaginationContratos, listarInativos, setLoading, searchTerm)}
                                    ativar={(id) => ativarContrato(id, msgs, listPaginationContratos, listarInativos, setLoading, searchTerm)}
                                />
                            </div>
                        </div>
                        <div style={{ marginTop: 'auto' }}>
                            <Paginator
                                first={listPaginationContratos.pageable.pageNumber * listPaginationContratos.pageable.pageSize}
                                rows={listPaginationContratos.pageable.pageSize}
                                totalRecords={listPaginationContratos.totalElements}
                                onPageChange={onPageChange}
                            />
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};
export default Contratos;
