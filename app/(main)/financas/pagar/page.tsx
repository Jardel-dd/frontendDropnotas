'use client';
import '@/app/styles/styledGlobal.css';
import { Toast } from 'primereact/toast';
import { Button } from 'primereact/button';
import { useRouter } from 'next/navigation';
import { Messages } from 'primereact/messages';
import ListarContasPagar from './tabela/pagarListagem';
import Input from '@/app/shared/include/input/input-all';
import { listContasPagar } from './controller/controller';
import {  PaginatorPageChangeEvent } from 'primereact/paginator';
import { usePageSize } from '@/app/components/pageSize/pageSize';
import { ChangeEvent, useEffect, useRef, useState } from 'react';
import { useTheme } from '@/app/components/isDarkMode/isDarkMode';
import { ContasPagarEntity } from '@/app/entity/contasPagarEntity';
import { Checkbox, CheckboxChangeEvent } from 'primereact/checkbox';
import { useGenericSearch } from '@/app/services/debounceSearch/controller';
import { useIsDesktop, useIsMobile } from '@/app/components/responsiveCelular/responsive';
import { FilterOverlay } from '@/app/components/buttonsComponent/btn-FilterComponent/Btn-Filter';
import CustomPaginator from '@/app/components/paginator/customPaginator';

const ContasPagar: React.FC = () => {
    const router = useRouter();
    const isMobile = useIsMobile();
    const pageSize = usePageSize();
    const isDesktop = useIsDesktop();
    const { isDarkMode } = useTheme();
    const toast = useRef<Toast>(null);
    const msgs = useRef<Messages | null>(null);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [listarInativos, setListarInativos] = useState<boolean>(false);
    const [contasPagar, setContasPagar] = useState<ContasPagarEntity>(
           new ContasPagarEntity({
               ativo: true,
               id: 0,
               descricao: '',
               id_fornecedor: 0,
               valor_original: 0,
               valor_total: 0,
               data_vencimento: '',
               observacao: ''
           }
           ));
    const [listPaginationContasPagar, setListPaginationContasPagar] = useState<Record<string, any>>({
        content: [],
        pageable: {
            pageNumber: 0,
            pageSize: pageSize,
            sort: {
                empty: true,
                unsorted: true,
                sorted: false
            }
        },
        totalPages: 0,
        totalElements: 0,
        last: false,
        size: 10,
        number: 0,
        sort: {
            empty: true,
            unsorted: true,
            sorted: false
        },
        numberOfElements: 0,
        first: true,
        empty: false
    });
    const handleNavigate = () => {
        router.push('/financas/pagar/created');
    };
    const handleListContasPagar = async (pageNumber?: number, _searchTerm?: string, listarInativos = false, ) => {
        setLoading(true);
        try {
            const contasPagarResponse = await listContasPagar(
                {
                    ...listPaginationContasPagar,
                    pageable: {
                        ...listPaginationContasPagar.pageable,
                        pageNumber: pageNumber ?? listPaginationContasPagar.pageable.pageNumber,
                        pageSize: pageSize
                    }
                },
                listarInativos,
                setLoading,
                _searchTerm ?? searchTerm
            );
            setListPaginationContasPagar(contasPagarResponse);
        } catch (error) {
            toast.current?.show({
                severity: 'error',
                summary: 'Atenção:',
                detail: 'Falha ao buscar contas a Receber ',
                life: 3000
            });
        } finally {
            setLoading(false);
        }
    };
    const { debouncedSearch, searchNow } = useGenericSearch({
        setter: setContasPagar,
        field: 'descricao',
        onSearch: (value) => handleListContasPagar(0, value, listarInativos)
    });
    const onPageChange = (event: PaginatorPageChangeEvent) => {
        const selectedPage = event.page;
        setListPaginationContasPagar((prev) => ({
            ...prev,
            pageable: {
                ...prev.pageable,
                pageNumber: selectedPage
            }
        }));
        handleListContasPagar(selectedPage, searchTerm, listarInativos);
    };
    const handleCheckboxChange = (e: CheckboxChangeEvent) => {
        const newValue = e.checked ?? false;
        setListarInativos(newValue);
        handleListContasPagar(0, searchTerm, newValue);
    };
    const handleSearchChange = (event: ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value;
        setSearchTerm(value);
        debouncedSearch(value);
    };
    const handleClearFilters = () => {
        setListarInativos(false);
        handleListContasPagar(0, '', false);
    };
    const handleApplyFilters = () => {
        const firstPage = 0;
        handleListContasPagar(firstPage, searchTerm, listarInativos);
    };
    useEffect(() => {
        handleListContasPagar();
    }, []);
    return (
        <div className="w-full">
            <Messages ref={msgs} className="custom-messages" />
            {isMobile && (
                <>
                    <div className="card styled-container-main-all-routes p-2">
                        <div className="grid formgrid p-2" >
                            <div className="col-8 mb-0 lg:col-6 lg:mb-0 p-0">
                                <Input
                                    label="Buscar"
                                    outlined={true}
                                    useRightButton={true}
                                    iconRight={'pi pi-search'}
                                    id="descricao"
                                    onChange={handleSearchChange}
                                    value={searchTerm}
                                    loading={loading}
                                    onClickSearch={() => searchNow(searchTerm)}
                                    topLabel="Descrição:"
                                    showTopLabel
                                />
                            </div>
                           <div className="col-4 mb-0 lg:col-3 lg:mb-0 p-1 ">
                                <div className="container-BTN-Filter-Created">
                                    <FilterOverlay 
                                    onClear={handleClearFilters} 
                                    onApply={handleApplyFilters}
                                    buttonClassName="height-2-8rem-ml-1rem-mobile"
                                     >
                                        <div className="col-12 lg:col-12 mt-3">
                                            <Checkbox inputId="listarInativos" onChange={handleCheckboxChange} checked={listarInativos} />
                                            <label htmlFor="listarInativos" className="ml-2">
                                                Listar Desativadas
                                            </label>
                                        </div>
                                    </FilterOverlay>
                                    <Button icon="pi pi-plus" className="ml-1rem" onClick={handleNavigate} />
                                </div>
                            </div>
                        </div>
                        <div>
                            <ListarContasPagar
                                loading={loading}
                                searchTerm={searchTerm}
                                setLoading={setLoading}
                                listarInativos={listarInativos}
                                setListPaginationContasPagar={setListPaginationContasPagar}
                                listPaginationContasPagar={listPaginationContasPagar}
                            />
                        </div>
                        <div style={{ marginTop: 'auto' }}>
                            <div className="custom-paginator">
                                <CustomPaginator
                                    first={listPaginationContasPagar.pageable.pageNumber * listPaginationContasPagar.pageable.pageSize}
                                    rows={pageSize}
                                    totalRecords={listPaginationContasPagar.totalElements}
                                    onPageChange={onPageChange}
                                    isMobile
                                />
                            </div>
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
                                            label="Buscar "
                                            outlined={true}
                                            id="descricao"
                                            useRightButton={true}
                                            iconRight={'pi pi-search'}
                                            onChange={handleSearchChange}
                                            value={searchTerm}
                                            loading={loading}
                                            onClickSearch={() => searchNow(searchTerm)}
                                            topLabel="Descrição:"
                                            showTopLabel
                                        />
                                    </div>
                                    <div className="Container-Btn-Filter-Desktop">
                                        <FilterOverlay onClear={handleClearFilters} onApply={handleApplyFilters} buttonClassName="Btn-Filter-Desktop">
                                            <h1></h1>
                                        </FilterOverlay>
                                    </div>
                                    <div className="container-button-primary-novo">
                                        <Button icon="pi pi-plus" label="Novo" onClick={handleNavigate} className="p-button-primary-novo" />
                                    </div>
                                </div>
                                <div >
                                    <ListarContasPagar
                                        loading={loading}
                                        searchTerm={searchTerm}
                                        setLoading={setLoading}
                                        listarInativos={listarInativos}
                                        setListPaginationContasPagar={setListPaginationContasPagar}
                                        listPaginationContasPagar={listPaginationContasPagar}
                                    />
                                </div>
                            </div>
                        </div>
                        <div style={{ marginTop: 'auto' }}>
                            <CustomPaginator first={listPaginationContasPagar.pageable.pageNumber * listPaginationContasPagar.pageable.pageSize} rows={pageSize} totalRecords={listPaginationContasPagar.totalElements} onPageChange={onPageChange} />
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

export default ContasPagar;
