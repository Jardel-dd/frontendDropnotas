'use client';
import '@/app/styles/styledGlobal.css';
import { Toast } from 'primereact/toast';
import { Button } from 'primereact/button';
import { useRouter } from 'next/navigation';
import { Messages } from 'primereact/messages';
import ListarVendedores from './list/list-vendedores';
import Input from '@/app/shared/include/input/input-all';
import { VendedorEntity } from '@/app/entity/VendedorEntity';
import { EnderecoEntity } from '@/app/entity/enderecoEntity';
import { ChangeEvent, useEffect, useRef, useState } from 'react';
import { usePageSize } from '@/app/components/pageSize/pageSize';
import { useTheme } from '@/app/components/isDarkMode/isDarkMode';
import { Checkbox, CheckboxChangeEvent } from 'primereact/checkbox';
import { Paginator, PaginatorPageChangeEvent } from 'primereact/paginator';
import { useGenericSearch } from '@/app/services/debounceSearch/controller';
import { ativarVendedor, deletarVendedor, listVendedor } from './controller/controller';
import DialogFilter from '@/app/components/dialogs/dialogFilterComponents/dialogFilter';
import { useIsDesktop, useIsMobile } from '@/app/components/responsiveCelular/responsive';

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
    const handleCheckboxChange = (e: CheckboxChangeEvent) => {
        const newValue = e.checked ?? false;
        setListarInativos(newValue);
        handleListVendedores(0, searchTerm, newValue);
        setVisible(false);
    };
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
    const handleSalvarFiltro = () => {
        handleListVendedores(0, searchTerm, listarInativos);
        setVisible(false);
    };
    const handleCancelarFiltro = () => {
        setVisible(false);
    };
    const handleCheckboxChangeMobile = (e: CheckboxChangeEvent) => {
        setListarInativos(e.checked ?? false);
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
                        <div className="scrollable-container">
                            <div className="grid formgrid p-0">
                                <div className="col-8 mb-0 lg:col-6 lg:mb-0 p-0 ">
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
                                <div className="col-4 mb-0 lg:col-3 lg:mb-0 p-0" style={{marginTop:"4px"}}>
                                    <div className="container-BTN-Filter-Created">
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
                                <Paginator
                                    first={listPaginationVendedores.pageable.pageNumber * listPaginationVendedores.pageable.pageSize}
                                    rows={pageSize}
                                    totalRecords={listPaginationVendedores.totalElements}
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
                                    style={{ background: isDarkMode ? '#162A41' : '#EFF3F8' }}
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
                                    <div className="checkbox-container">
                                        <Checkbox inputId="listarInativos" onChange={handleCheckboxChange} checked={listarInativos} />
                                        <label htmlFor="listarInativos" className="ml-2">
                                            Listar Desativadas
                                        </label>
                                    </div>
                                    <div className="container-button-primary-novo">
                                        <Button icon="pi pi-plus" label="Novo" onClick={handleNavigate} className="p-button-primary-novo" />
                                    </div>
                                </div>
                                <div className="mt-2">
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
                        </div>
                        <div style={{ marginTop: 'auto' }}>
                            <Paginator first={listPaginationVendedores.pageable.pageNumber * listPaginationVendedores.pageable.pageSize} rows={pageSize} totalRecords={listPaginationVendedores.totalElements} onPageChange={onPageChange} />
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};
export default Vendedores;
