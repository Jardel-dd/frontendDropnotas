'use client';
import '@/app/styles/styledGlobal.css';
import { Toast } from 'primereact/toast';
import { Button } from 'primereact/button';
import { useRouter } from 'next/navigation';
import { Messages } from 'primereact/messages';
import ListarServicos from './tabela/servicoListagem';
import Input from '@/app/shared/include/input/input-all';
import { ServiceEntity } from '@/app/entity/ServiceEntity';
import { PaginatorPageChangeEvent } from 'primereact/paginator';
import { usePageSize } from '@/app/components/pageSize/pageSize';
import { ChangeEvent, useEffect, useRef, useState } from 'react';
import { Checkbox, CheckboxChangeEvent } from 'primereact/checkbox';
import CustomPaginator from '@/app/components/paginator/customPaginator';
import { useGenericSearch } from '@/app/services/debounceSearch/controller';
import { ativarServico, deletarServico, listServico } from './controller/controller';
import { useIsDesktop, useIsMobile } from '@/app/components/responsiveCelular/responsive';
import { FilterOverlay } from '@/app/components/buttonsComponent/btn-FilterComponent/Btn-Filter';
import CheckBoxField from '@/app/components/CheckBoxField/checkBoxField';

function Servicos() {
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
            indicador_destinatario: '',
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
    const handleClearFilters = () => {
        setListarInativos(false);
        handleListServicos(0, searchTerm, listarInativos);
        setVisible(false);
    };
    const handleCheckboxChange = (e: CheckboxChangeEvent) => {
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
                        <div className="grid formgrid p-2">
                            <div className="col-8 mb-0 lg:col-6 lg:mb-0 p-0">
                                <Input
                                    label="Pesquisar Descrição"
                                    outlined={true}
                                    useRightButton={true}
                                    iconRight={'pi pi-search'}
                                    id="descricao"
                                    onChange={handleSearchChange}
                                    value={searchTerm}
                                    loading={loading}
                                    onClickSearch={() => searchNow(searchTerm)}
                                    topLabel="Pesquisar:"
                                    showTopLabel
                                />
                            </div>
                            <div className="col-4 mb-0 lg:col-3 lg:mb-0 ">
                                <div className="container-BTN-Filter-Created">
                                    <FilterOverlay
                                        onApply={handleSalvarFiltro}
                                        onClear={handleClearFilters}
                                        buttonClassName="height-2-8rem-ml-1rem-mobile">
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
                                <CustomPaginator
                                    first={listPaginationServicos.pageable.pageNumber * listPaginationServicos.pageable.pageSize}
                                    rows={pageSize}
                                    totalRecords={listPaginationServicos.totalElements}
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
                                    <div className="col-12 lg:col-12 container-input-search-all">
                                        <Input
                                            label="Pesquisar Descrição"
                                            outlined={true}
                                            useRightButton={true}
                                            iconRight={'pi pi-search'}
                                            id="descricao"
                                            value={searchTerm}
                                            loading={loading}
                                            onChange={handleSearchChange}
                                            onClickSearch={() => searchNow(searchTerm)}
                                            topLabel="Pesquisar:"
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
                            <CustomPaginator
                                first={listPaginationServicos.pageable.pageNumber * listPaginationServicos.pageable.pageSize}
                                rows={pageSize}
                                totalRecords={listPaginationServicos.totalElements}
                                onPageChange={onPageChange} />
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}
export default Servicos;
