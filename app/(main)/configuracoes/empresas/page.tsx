'use client';
import '@/app/styles/styledGlobal.css';
import { Toast } from 'primereact/toast';
import { Button } from 'primereact/button';
import { useRouter, useSearchParams } from 'next/navigation';
import { Messages } from 'primereact/messages';
import ListarEmpresas from './tabela/empresaListagem';
import Input from '@/app/shared/include/input/input-all';
import { usePermissions } from '@/app/routes/permissoes';
import {  CheckboxChangeEvent } from 'primereact/checkbox';
import { CompanyEntity, } from '@/app/entity/CompanyEntity';
import { EnderecoEntity } from '@/app/entity/enderecoEntity';
import { usePageSize } from '@/app/components/pageSize/pageSize';
import { ChangeEvent, useEffect, useRef, useState } from 'react';
import {  PaginatorPageChangeEvent } from 'primereact/paginator';
import CustomPaginator from '@/app/components/paginator/customPaginator';
import CheckBoxField from '@/app/components/CheckBoxField/checkBoxField';
import { useGenericSearch } from '@/app/services/debounceSearch/controller';
import { ativarEmpresa, deletarEmpresa, listEmpresa } from './controller/controller';
import { useIsDesktop, useIsMobile } from '@/app/components/responsiveCelular/responsive';
import { FilterOverlay } from '@/app/components/buttonsComponent/btn-FilterComponent/Btn-Filter';

const Empresas: React.FC = () => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const pageSize = usePageSize();
    const isMobile = useIsMobile();
    const isDesktop = useIsDesktop();
    const toast = useRef<Toast>(null);
    const msgs = useRef<Messages | null>(null);
    const {permissaoEmpresa} = usePermissions();
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
    const showOnboardingHint = searchParams.get('onboarding') === 'company-setup';
    const onboardingCnpj = searchParams.get('cnpj')?.replace(/\D/g, '') ?? '';
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
                summary: 'Atenção:',
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
    const handleSearchChange = (event: ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value;
        setSearchTerm(value);
        debouncedSearch(value);
    };
    const handleSalvarFiltro = () => {
        handleListCompany(0, searchTerm, listarInativos);
        setVisible(false);
    };
    const handleClearFilters = () => {
        setListarInativos(false);
        handleListCompany(0, '', false);
        setVisible(false);
    };
    const handleCheckboxChange = (e: CheckboxChangeEvent) => {
        setListarInativos(e.checked ?? false);
    };
    useEffect(() => {
        handleListCompany();
    }, []);
    return (
        <div className='p-fluid'>
            <Messages ref={msgs} className="custom-messages" />
            {isMobile &&
                <>
                    <div className="card styled-container-main-all-routes p-2">
                        <div className='p-2'>
                            <div className="grid formgrid" style={{ maxHeight: '74px' }}>
                                <div className="col-8 mb-0 lg:col-6 lg:mb-0 p-0 ">
                                    <Input
                                        label="Pesquisar CNPJ/Razão Social/Nome Fantasia"
                                        outlined={true}
                                        id="razao_social"
                                        useRightButton={true}
                                        iconRight={'pi pi-search'}
                                        onChange={handleSearchChange}
                                        value={searchTerm}
                                        loading={loading}
                                        onClickSearch={() => searchNow(searchTerm)}
                                        topLabel="Pesquisar:"
                                        showTopLabel
                                    />
                                </div>
                                <div className="col-4 mb-0 lg:col-2 p-0">
                                    <div className="container-BTN-Filter-Created ">
                                        <FilterOverlay onApply={handleSalvarFiltro} onClear={handleClearFilters} buttonClassName="height-2-8rem-ml-1rem-mobile">
                                            <CheckBoxField
                                                inputId="listarInativos"
                                                label="Listar Desativadas"
                                                checked={listarInativos}
                                                onChange={handleCheckboxChange}
                                            />
                                        </FilterOverlay>
                                        {permissaoEmpresa.create && (
                                        <Button icon="pi pi-plus" className="ml-1rem" onClick={handleNavigate} />
                                        )}
                                        </div>
                                </div>
                            </div>
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
                                showOnboardingHint={showOnboardingHint}
                                onboardingCnpj={onboardingCnpj}
                            />
                        </div>
                        <div style={{ marginTop: 'auto' }}>
                            <div className="custom-paginator">
                                <CustomPaginator
                                    first={listPaginationEmpresa.pageable.pageNumber * listPaginationEmpresa.pageable.pageSize}
                                    rows={pageSize}
                                    totalRecords={listPaginationEmpresa.totalElements}
                                    onPageChange={onPageChange}
                                    isMobile
                                />
                            </div>
                        </div>
                    </div>
                </>
            }
            {isDesktop &&
                <>
                    <div className="card styled-container-main-all-routes p-2">
                        <div className="scrollable-container">
                            <div className="p-0">
                                <div className="grid formgrid"  >
                                    <div className="col-12 lg:col-3 container-input-search-all" >
                                        <Input
                                            label="Pesquisar CNPJ/Razão Social/Nome Fantasia"
                                            outlined={true}
                                            id="razao_social"
                                            useRightButton={true}
                                            iconRight={'pi pi-search'}
                                            onChange={handleSearchChange}
                                            value={searchTerm}
                                            loading={loading}
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
                                     {permissaoEmpresa.create && (
                                    <div className='container-button-primary-novo'>
                                        <Button icon="pi pi-plus" label='Novo' onClick={handleNavigate} className="p-button-primary-novo" />
                                    </div>
                                    )}
                                </div>
                                <div>
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
                                        showOnboardingHint={showOnboardingHint}
                                        onboardingCnpj={onboardingCnpj}
                                    />
                                </div>
                            </div>
                        </div>
                        <div style={{ marginTop: 'auto' }}>
                            <CustomPaginator
                                first={listPaginationEmpresa.pageable.pageNumber * listPaginationEmpresa.pageable.pageSize}
                                rows={pageSize}
                                totalRecords={listPaginationEmpresa.totalElements}
                                onPageChange={onPageChange}
                            />
                        </div>
                    </div>
                </>
            }
        </div>
    );
};

export default Empresas;
