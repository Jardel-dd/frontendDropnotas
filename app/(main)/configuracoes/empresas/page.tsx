'use client';
import '@/app/styles/styledGlobal.css';
import { Toast } from 'primereact/toast';
import { Button } from 'primereact/button';
import { useRouter } from 'next/navigation';
import { Messages } from 'primereact/messages';
import ListarEmpresas from './listCompany/list';
import Input from '@/app/shared/include/input/input-all';
import { CompanyEntity, } from '@/app/entity/CompanyEntity';
import { EnderecoEntity } from '@/app/entity/enderecoEntity';
import { usePageSize } from '@/app/components/pageSize/pageSize';
import { ChangeEvent, useEffect, useRef, useState } from 'react';
import { useTheme } from '@/app/components/isDarkMode/isDarkMode';
import { Checkbox, CheckboxChangeEvent } from 'primereact/checkbox';
import { Paginator, PaginatorPageChangeEvent } from 'primereact/paginator';
import { useGenericSearch } from '@/app/services/debounceSearch/controller';
import { ativarEmpresa, deletarEmpresa, listEmpresa } from './controller/controller';
import DialogFilter from '@/app/components/dialogs/dialogFilterComponents/dialogFilter';
import { useIsDesktop, useIsMobile } from '@/app/components/responsiveCelular/responsive';

const Empresas: React.FC = () => {
    const router = useRouter();
    const pageSize = usePageSize();
    const isMobile = useIsMobile();
    const isDesktop = useIsDesktop();
    const { isDarkMode } = useTheme();
    const toast = useRef<Toast>(null);
    const msgs = useRef<Messages | null>(null);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [empresa, setEmpresa] = useState<CompanyEntity>(
        new CompanyEntity({
            id: 0,
            id_usuarios_acesso: [0],
            cnpj: '',
            razao_social: '',
            nome_fantasia: '',
            logo_empresa: '',
            atividade_principal: '',
            inscricao_estadual: '',
            inscricao_municipal: '',
            codigo_regime_tributario: '',
            endereco: new EnderecoEntity({
                cep: '',
                logradouro: '',
                complemento: '',
                numero: '',
                bairro: '',
                municipio: '',
                codigo_municipio: '',
                codigo_pais: '',
                nome_pais: '',
                uf: '',
                telefone: ''
            }),
            cnaes_secundarios: ['0'],
            certificado_digital: '',
            data_vencimento_certificado_digital: '',
            senha_certificado_digital: '',
            nome_certificado_digital: '',
            serie_emissao_nfse: '',
            proximo_numero_rps: 0,
            proximo_numero_lote: 0,
            aliquota_iss: 0,
            cnae_fiscal: '',
            prestacao_sus: false,
            regime_especial_tributacao: '',
            incentivo_fiscal: false,
            email: '',
            telefone: '',
            ativo: true,
            tipo_rps: '',
        }));
    const [visible, setVisible] = useState<boolean>(false);
    const [isCompanyCreated, setIsCompanyCreated] = useState(false);
    const [listarInativos, setListarInativos] = useState<boolean>(false);
    const [selectedEmpresa, setSelectedEmpresa] = useState<CompanyEntity | null>(null);
    const [listPaginationEmpresa, setListPaginationEmpresa] = useState<Record<string, any>>({
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
        router.push('/configuracoes/empresas/created');
        setIsCompanyCreated(true);
    };
    const handleListCompany = async (
        pageNumber?: number,
        _searchTerm?: string,
        listarInativos = false
    ) => {
        setLoading(true);
        try {
            const empresas = await listEmpresa(
                {
                    ...listPaginationEmpresa,
                    pageable: {
                        ...listPaginationEmpresa.pageable,
                        pageNumber: pageNumber ?? listPaginationEmpresa.pageable.pageNumber,
                        pageSize: pageSize,
                    },
                },
                listarInativos,
                setLoading,
                _searchTerm ?? searchTerm
            );
            setListPaginationEmpresa(empresas);
        } catch (error) {
            toast.current?.show({
                severity: 'error',
                summary: 'Erro',
                detail: 'Falha ao buscar empresas',
            });
        } finally {
            setLoading(false);
        }
    };
    const { debouncedSearch, searchNow } = useGenericSearch({
        setter: setEmpresa,
        field: 'razao_social',
        onSearch: (value) => handleListCompany(0, value, listarInativos),
    });
    const onPageChange = (event: PaginatorPageChangeEvent) => {
        const selectedPage = event.page;
        setListPaginationEmpresa((prev) => ({
            ...prev,
            pageable: {
                ...prev.pageable,
                pageNumber: selectedPage
            }
        }));
        handleListCompany(selectedPage, searchTerm, listarInativos);
    };
    const handleCheckboxChange = (e: CheckboxChangeEvent) => {
        const newValue = e.checked ?? false;
        setListarInativos(newValue);
        handleListCompany(0, searchTerm, newValue);
        setVisible(false);
    };
    const handleSearchChange = (event: ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value;
        setSearchTerm(value);
        debouncedSearch(value);
    };
    const handleSalvarFiltro = () => {
        handleListCompany(0, searchTerm, listarInativos);
        setVisible(false);
    };
    const handleCancelarFiltro = () => {
        setVisible(false);
    };
    const handleCheckboxChangeMobile = (e: CheckboxChangeEvent) => {
        setListarInativos(e.checked ?? false);
    };
    useEffect(() => {
        handleListCompany();
    }, []);
    return (
        <div className='p-fluid'>
            <Messages ref={msgs} className="custom-messages" />
            <div className="card styled-container-main-all-routes p-3">
                {isMobile &&
                    <>
                        <div className='flex-column-full'>
                            <div className="flex flex-row align-items-start ">
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
                                    topLabel="Empresas:"
                                    showTopLabel
                                />
                                <div  style={{ display: "flex", flexDirection: "row", justifyContent:"center", alignItems:"center",marginTop:"6px", height:"76px"}}>
                                    <Button className='height-2-8rem-ml-1rem' icon="pi pi-filter" onClick={() => setVisible(true)} outlined />
                                    <Button icon="pi pi-plus" className='ml-1rem' onClick={handleNavigate} />
                                </div>
                            </div>
                            <DialogFilter
                                visible={visible}
                                header="Filtro"
                                onHide={() => setVisible(false)}
                                onSave={handleSalvarFiltro}
                                onCancel={handleCancelarFiltro}
                            >
                                <div className='checkBoxMobile-width-max-10rem'>
                                    <div className="checkbox-container">
                                        <Checkbox
                                            inputId="listarInativos"
                                            onChange={handleCheckboxChangeMobile}
                                            checked={listarInativos}
                                        />
                                        <label htmlFor="listarInativos" className="ml-2">
                                            Listar Desativadas
                                        </label>
                                    </div>
                                </div>
                            </DialogFilter>
                        </div>
                        <div >
                            <ListarEmpresas
                                loading={loading}
                                listPaginationEmpresa={listPaginationEmpresa}
                                deletar={(id) => deletarEmpresa(id, msgs, listPaginationEmpresa, listarInativos, setLoading, searchTerm)}
                                ativar={(id) => ativarEmpresa(id, msgs, listPaginationEmpresa, listarInativos, setLoading, searchTerm)}
                                setSelectedEmpresa={setSelectedEmpresa}
                                selectedEmpresa={selectedEmpresa}
                                setLoading={setLoading}
                                searchTerm={searchTerm}
                                setListPaginationEmpresa={setListPaginationEmpresa}
                                listarInativos={listarInativos}
                            />
                        </div>
                        <div style={{ marginTop: 'auto' }}>
                            <div className="custom-paginator">
                                <Paginator
                                    first={listPaginationEmpresa.pageable.pageNumber * listPaginationEmpresa.pageable.pageSize}
                                    rows={pageSize}
                                    totalRecords={listPaginationEmpresa.totalElements}
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
                                    style={{ background: isDarkMode ? "#162A41" : "#EFF3F8" }}
                                />
                            </div>
                        </div>
                    </>
                }
                {isDesktop &&
                    <>
                       <div className="grid formgrid p-0"  >
                            <div className="col-12 lg:col-3 container-input-search-all" >
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
                                    topLabel="Empresas:"
                                    showTopLabel
                                />
                            </div>
                            <div className="checkbox-container">
                                <Checkbox
                                    inputId="listarInativos"
                                    onChange={handleCheckboxChange}
                                    checked={listarInativos}
                                />
                                <label htmlFor="listarInativos" className="ml-2">
                                    Listar Desativadas
                                </label>
                            </div>
                            <div className='container-button-primary-novo'>
                                <Button icon="pi pi-plus" label='Novo' onClick={handleNavigate} className="p-button-primary-novo" />
                            </div>
                        </div>
                        <div className='mt-2'>
                            <ListarEmpresas
                                loading={loading}
                                listPaginationEmpresa={listPaginationEmpresa}
                                deletar={(id) => deletarEmpresa(id, msgs, listPaginationEmpresa, listarInativos, setLoading, searchTerm)}
                                ativar={(id) => ativarEmpresa(id, msgs, listPaginationEmpresa, listarInativos, setLoading, searchTerm)}
                                setSelectedEmpresa={setSelectedEmpresa}
                                selectedEmpresa={selectedEmpresa}
                                setLoading={setLoading}
                                searchTerm={searchTerm}
                                setListPaginationEmpresa={setListPaginationEmpresa}
                                listarInativos={listarInativos}
                            />
                        </div>
                        <div style={{ marginTop: 'auto' }}>
                            <Paginator
                                first={listPaginationEmpresa.pageable.pageNumber * listPaginationEmpresa.pageable.pageSize}
                                rows={pageSize}
                                totalRecords={listPaginationEmpresa.totalElements}
                                onPageChange={onPageChange}
                            />
                        </div>
                    </>
                }
                </div>
            </div>
    );
};

export default Empresas;
