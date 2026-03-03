'use client';
import '@/app/styles/styledGlobal.css';
import { Toast } from 'primereact/toast';
import { Button } from 'primereact/button';
import { useRouter } from 'next/navigation';
import { Messages } from 'primereact/messages';
import ListarServicos from './listService/list';
import Input from '@/app/shared/include/input/input-all';
import { ServiceEntity } from '@/app/entity/ServiceEntity';
import { usePageSize } from '@/app/components/pageSize/pageSize';
import { ChangeEvent, useEffect, useRef, useState } from 'react';
import { Checkbox, CheckboxChangeEvent } from 'primereact/checkbox';
import { Paginator, PaginatorPageChangeEvent } from 'primereact/paginator';
import { useGenericSearch } from '@/app/services/debounceSearch/controller';
import { ativarServico, deletarServico, listServico } from './controller/controller';
import DialogFilter from '@/app/components/dialogs/dialogFilterComponents/dialogFilter';
import { useIsDesktop, useIsMobile } from '@/app/components/responsiveCelular/responsive';

function Usuarios() {
    const router = useRouter();
    const pageSize = usePageSize();
    const isMobile = useIsMobile();
    const isDesktop = useIsDesktop();
    const toast = useRef<Toast>(null);
    const msgs = useRef<Messages | null>(null);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [service, setService] = useState<ServiceEntity>(
        new ServiceEntity({
            ativo: true,
            id: 0,
            descricao: '',
            descricao_completa: '',
            codigo: '',
            item_lista_servico: '',
            exigibilidade_iss: '',
            iss_retido: '',
            observacoes: '',
            codigo_municipio: '',
            numero_processo: '',
            responsavel_retencao: '',
            codigo_cnae: '',
            codigo_nbs: '',
            codigo_inter_contr: '',
            codigo_indicador_operacao: '',
            tipo_operacao: 0,
            finalidade_nfse: 0,
            indicador_finalidade: 0,
            indicador_destinatario: 0,
            codigo_situacao_tributaria: '',
            codigo_classificacao_tributaria: '',
            codigo_situacao_tributaria_regular: '',
            codigo_classificacao_tributaria_regular: '',
            codigo_credito_presumido: '',
            percentual_diferencial_uf: 0,
            percentual_diferencial_municipal: 0,
            percentual_diferencial_cbs: 0,
            valor_servico: null,
            valor_desconto: 0
        })
    );
    const [visible, setVisible] = useState<boolean>(false);
    const [isServicosCreated, setIsServicosCreated] = useState(false);
    const [listarInativos, setListarInativos] = useState<boolean>(false);
    const [listPaginationServicos, setListPaginationServicos] = useState<Record<string, any>>({
        pageable: {
            pageNumber: 0,
            pageSize: pageSize,
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
        router.push('/cadastro/servicos/created');
        setIsServicosCreated(true);
    };
    const handleListServicos = async (pageNumber?: number, _searchTerm?: string, listarInativos = false) => {
        setLoading(true);
        try {
            const Servicos = await listServico(
                {
                    ...listPaginationServicos,
                    pageable: {
                        ...listPaginationServicos.pageable,
                        pageNumber: pageNumber ?? listPaginationServicos.pageable.pageNumber,
                        pageSize: pageSize
                    }
                },
                listarInativos,
                setLoading,
                _searchTerm ?? searchTerm
            );
            setListPaginationServicos(Servicos);
        } catch (error) {
            toast.current?.show({
                severity: 'error',
                summary: 'Erro',
                detail: 'Falha ao buscar Servicos',
                life: 3000
            });
        } finally {
            setLoading(false);
        }
    };
    const { debouncedSearch, searchNow } = useGenericSearch({
        setter: setService,
        field: 'descricao',
        onSearch: (value) => handleListServicos(0, value, listarInativos)
    });
    const handleCheckboxChange = (e: CheckboxChangeEvent) => {
        const newValue = e.checked ?? false;
        setListarInativos(newValue);
        handleListServicos(0, searchTerm, newValue);
        setVisible(false);
    };
    const onPageChange = (event: PaginatorPageChangeEvent) => {
        const selectedPage = event.page;
        setListPaginationServicos((prev) => ({
            ...prev,
            pageable: {
                ...prev.pageable,
                pageNumber: selectedPage
            }
        }));
        handleListServicos(selectedPage, searchTerm, listarInativos);
    };
    const handleSearchChange = (event: ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value;
        setSearchTerm(value);
        debouncedSearch(value);
    };
    const handleSalvarFiltro = () => {
        handleListServicos(0, searchTerm, listarInativos);
        setVisible(false);
    };
    const handleCancelarFiltro = () => {
        setVisible(false);
    };
    const handleCheckboxChangeMobile = (e: CheckboxChangeEvent) => {
        setListarInativos(e.checked ?? false);
    };
    useEffect(() => {
        handleListServicos();
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
                                        id="descricao"
                                        onChange={handleSearchChange}
                                        value={searchTerm}
                                        loading={loading}
                                        onClickSearch={() => searchNow(searchTerm)}
                                        topLabel="Serviço:"
                                        showTopLabel
                                    />
                                </div>
                                <div className="col-4  lg:col-3 p-0" style={{marginTop:"4px"}}>
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
                        </div>
                        <div>
                            <ListarServicos
                                loading={loading}
                                setLoading={setLoading}
                                searchTerm={searchTerm}
                                listarInativos={listarInativos}
                                listPaginationServicos={listPaginationServicos}
                                setListPaginationServicos={setListPaginationServicos}
                                deletar={(id) => deletarServico(id, msgs, listPaginationServicos, listarInativos, setLoading, searchTerm)}
                                ativar={(id) => ativarServico(id, msgs, listPaginationServicos, listarInativos, setLoading, searchTerm)}
                            />
                        </div>
                        <div style={{ marginTop: 'auto' }}>
                            <div className="custom-paginator">
                                <Paginator
                                    first={listPaginationServicos.pageable.pageNumber * listPaginationServicos.pageable.pageSize}
                                    rows={pageSize}
                                    totalRecords={listPaginationServicos.totalElements}
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
                                            useRightButton={true}
                                            iconRight={'pi pi-search'}
                                            id="descricao"
                                            value={searchTerm}
                                            loading={loading}
                                            onChange={handleSearchChange}
                                            onClickSearch={() => searchNow(searchTerm)}
                                            topLabel="Serviço:"
                                            showTopLabel
                                        />
                                    </div>
                                    <div className="checkBox-width-max-10rem">
                                        <div className="checkbox-container">
                                            <Checkbox inputId="listarInativos" onChange={handleCheckboxChange} checked={listarInativos} />
                                            <label htmlFor="listarInativos" className="ml-2">
                                                Listar Desativadas
                                            </label>
                                        </div>
                                    </div>
                                    <div className="container-button-primary-novo">
                                        <Button label="Novo" icon="pi pi-plus" onClick={handleNavigate} className="p-button-primary-novo" />
                                    </div>
                                </div>
                                <div className="mt-3">
                                    <ListarServicos
                                        loading={loading}
                                        setLoading={setLoading}
                                        searchTerm={searchTerm}
                                        listarInativos={listarInativos}
                                        listPaginationServicos={listPaginationServicos}
                                        setListPaginationServicos={setListPaginationServicos}
                                        deletar={(id) => deletarServico(id, msgs, listPaginationServicos, listarInativos, setLoading, searchTerm)}
                                        ativar={(id) => ativarServico(id, msgs, listPaginationServicos, listarInativos, setLoading, searchTerm)}
                                    />
                                </div>
                            </div>
                        </div>
                        <div style={{ marginTop: 'auto' }}>
                            <Paginator first={listPaginationServicos.pageable.pageNumber * listPaginationServicos.pageable.pageSize} rows={pageSize} totalRecords={listPaginationServicos.totalElements} onPageChange={onPageChange} />
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}
export default Usuarios;
