'use client';
import '@/app/styles/styledGlobal.css';
import { Toast } from 'primereact/toast';
import { Button } from 'primereact/button';
import { useRouter } from 'next/navigation';
import { Messages } from 'primereact/messages';
import ListarVendedores from './tabela/vendedorListagem';
import Input from '@/app/shared/include/input/input-all';
import { VendedorEntity } from '@/app/entity/VendedorEntity';
import { EnderecoEntity } from '@/app/entity/enderecoEntity';
import { PaginatorPageChangeEvent } from 'primereact/paginator';
import { ChangeEvent, useEffect, useRef, useState } from 'react';
import { usePageSize } from '@/app/components/pageSize/pageSize';
import { useTheme } from '@/app/components/isDarkMode/isDarkMode';
import { Checkbox, CheckboxChangeEvent } from 'primereact/checkbox';
import { useGenericSearch } from '@/app/services/debounceSearch/controller';
import { ativarVendedor, deletarVendedor, listVendedor } from './controller/controller';
import { useIsDesktop, useIsMobile } from '@/app/components/responsiveCelular/responsive';
import { FilterOverlay } from '@/app/components/buttonsComponent/btn-FilterComponent/Btn-Filter';
import CustomPaginator from '@/app/components/paginator/customPaginator';
import CheckBoxField from '@/app/components/CheckBoxField/checkBoxField';

const Vendedores: React.FC = () => {
    const router = useRouter();
    const pageSize = usePageSize();
    const isMobile = useIsMobile();
    const isDesktop = useIsDesktop();
    const toast = useRef<Toast>(null);
    const { isDarkMode } = useTheme();
    const msgs = useRef<Messages | null>(null);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [visible, setVisible] = useState<boolean>(false);
    const [vendedor, setVendedor] = useState<VendedorEntity>(
        new VendedorEntity({
            id: 0,
            razao_social: '',
            nome_fantasia: '',
            cpf: null,
            rg: null,
            email: '',
            documento_estrangeiro: null,
            cnpj: null,
            inscricao_estadual: '',
            inscricao_municipal: '',
            atividade_principal: '',
            codigo_regime_tributario: '',
            tipo_pessoa: 'PESSOA_JURIDICA',
            contribuinte: '',
            telefone: '',
            endereco: {} as EnderecoEntity,
            arquivo_contrato: '',
            id_vendedor_padrao: null,
            percentual_comissao: null,
            ativo: true,
            pais: ''
        })
    );
    const [listarInativos, setListarInativos] = useState<boolean>(false);
    const [isVendedoresCreated, setIsVendedoresCreated] = useState(false);
    const [listPaginationVendedores, setListPaginationVendedores] = useState<Record<string, any>>({
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
        router.push('/cadastro/vendedores/created');
        setIsVendedoresCreated(true);
    };
    const handleListVendedores = async (pageNumber?: number, _searchTerm?: string, listarInativos = false) => {
        setLoading(true);
        try {
            const vendedores = await listVendedor(
                {
                    ...listPaginationVendedores,
                    pageable: {
                        ...listPaginationVendedores.pageable,
                        pageNumber: pageNumber ?? listPaginationVendedores.pageable.pageNumber,
                        pageSize: pageSize
                    }
                },
                listarInativos,
                setLoading,
                _searchTerm ?? searchTerm
            );
            setListPaginationVendedores(vendedores);
        } catch (error) {
            toast.current?.show({
                severity: 'error',
                summary: 'Erro',
                detail: 'Falha Vendedor '
            });
        } finally {
            setLoading(false);
        }
    };
    const { debouncedSearch, searchNow } = useGenericSearch({
        setter: setVendedor,
        field: 'razao_social',
        onSearch: (value) => handleListVendedores(0, value, listarInativos)
    });
    const onPageChange = (event: PaginatorPageChangeEvent) => {
        const selectedPage = event.page;
        setListPaginationVendedores((prev) => ({
            ...prev,
            pageable: {
                ...prev.pageable,
                pageNumber: selectedPage
            }
        }));
        handleListVendedores(selectedPage, searchTerm, listarInativos);
    };
    const handleSearchChange = (event: ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value;
        setSearchTerm(value);
        debouncedSearch(value);
    };
    const handleClearFilters = () => {
        const defaultFilter = {
            cliente: true,
            fornecedor: true
        };
        setListarInativos(false);
        handleListVendedores(0, searchTerm, listarInativos);
        setVisible(false);
    };
    const handleApplyFilters = () => {
        const firstPage = 0;
        handleListVendedores(0, searchTerm, listarInativos);
        setVisible(false);
    };
    const handleCheckboxChange = (e: CheckboxChangeEvent) => {
        setListarInativos(e.checked ?? false);
    };
    const handleSalvarFiltro = () => {
        handleListVendedores(0, searchTerm, listarInativos);
        setVisible(false);
    };
    useEffect(() => {
        handleListVendedores();
    }, []);
    return (
        <div className="w-full">
            <Messages ref={msgs} className="custom-messages" />
            {isMobile && (
                <>
                    <div className="card styled-container-main-all-routes p-2">
                        <div className="grid formgrid p-2">
                            <div className="col-8 mb-0 lg:col-6 lg:mb-0 p-0">
                                <Input
                                    label="Buscar"
                                    outlined={true}
                                    useRightButton={true}
                                    iconRight={'pi pi-search'}
                                    id="razao_social"
                                    onChange={handleSearchChange}
                                    value={searchTerm}
                                    loading={loading}
                                    onClickSearch={() => searchNow(searchTerm)}
                                    topLabel="Vendedores:"
                                    showTopLabel
                                />
                            </div>
                            <div className="col-4 mb-0 lg:col-3 lg:mb-0">
                                <div className="container-BTN-Filter-Created">
                                    <FilterOverlay onApply={handleApplyFilters} onClear={handleClearFilters} buttonClassName="height-2-8rem-ml-1rem-mobile">
                                        <CheckBoxField
                                            inputId="listarInativos"
                                            label="Listar Desativadas"
                                            checked={listarInativos}
                                            onChange={handleCheckboxChange}
                                        />
                                    </FilterOverlay>
                                    <Button icon="pi pi-plus" className="ml-1rem" onClick={handleNavigate} />
                                </div>
                            </div>
                        </div>
                        <div>
                            <ListarVendedores
                                loading={loading}
                                listPaginationVendedores={listPaginationVendedores}
                                deletar={(id) => deletarVendedor(id, msgs, listPaginationVendedores, listarInativos, setLoading, searchTerm)}
                                ativar={(id) => ativarVendedor(id, msgs, listPaginationVendedores, listarInativos, setLoading, searchTerm)}
                                setLoading={setLoading}
                                searchTerm={searchTerm}
                                listarInativos={listarInativos}
                                setListPaginationVendedores={setListPaginationVendedores}
                            />
                        </div>
                        <div style={{ marginTop: 'auto' }}>
                            <div className="custom-paginator">
                                <CustomPaginator
                                    first={listPaginationVendedores.pageable.pageNumber * listPaginationVendedores.pageable.pageSize}
                                    rows={pageSize}
                                    totalRecords={listPaginationVendedores.totalElements}
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
                                            label="Buscar"
                                            outlined={true}
                                            id="razao_social"
                                            useRightButton={true}
                                            iconRight={'pi pi-search'}
                                            onChange={handleSearchChange}
                                            value={searchTerm}
                                            loading={loading}
                                            onClickSearch={() => searchNow(searchTerm)}
                                            topLabel="Vendedores:"
                                            showTopLabel
                                        />
                                    </div>
                                    <div className="Container-Btn-Filter-Desktop">
                                        <FilterOverlay
                                            onApply={handleSalvarFiltro}
                                            onClear={handleClearFilters}
                                            buttonClassName="Btn-Filter-Desktop">
                                            <CheckBoxField
                                                inputId="listarInativos"
                                                label="Listar Desativadas"
                                                checked={listarInativos}
                                                onChange={handleCheckboxChange}
                                            />

                                        </FilterOverlay>
                                    </div>
                                    <div className="container-button-primary-novo">
                                        <Button icon="pi pi-plus" label="Novo" onClick={handleNavigate} className="p-button-primary-novo" />
                                    </div>
                                </div>
                            </div>
                            <div>
                                <ListarVendedores
                                    loading={loading}
                                    listPaginationVendedores={listPaginationVendedores}
                                    deletar={(id) => deletarVendedor(id, msgs, listPaginationVendedores, listarInativos, setLoading, searchTerm)}
                                    ativar={(id) => ativarVendedor(id, msgs, listPaginationVendedores, listarInativos, setLoading, searchTerm)}
                                    setLoading={setLoading}
                                    searchTerm={searchTerm}
                                    listarInativos={listarInativos}
                                    setListPaginationVendedores={setListPaginationVendedores}
                                />
                            </div>
                        </div>
                        <div style={{ marginTop: 'auto' }}>
                            <CustomPaginator first={listPaginationVendedores.pageable.pageNumber * listPaginationVendedores.pageable.pageSize} rows={pageSize} totalRecords={listPaginationVendedores.totalElements} onPageChange={onPageChange} />
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};
export default Vendedores;
