'use client';
import '@/app/styles/styledGlobal.css';
import { Toast } from 'primereact/toast';
import { Button } from 'primereact/button';
import { useRouter } from 'next/navigation';
import { Messages } from 'primereact/messages';
import Input from '@/app/shared/include/input/input-all';
import { PerfilUser } from '@/app/entity/PerfilUsuarioEntity';
import { ChangeEvent, useEffect, useRef, useState } from 'react';
import { usePageSize } from '@/app/components/pageSize/pageSize';
import { useTheme } from '@/app/components/isDarkMode/isDarkMode';
import ListarPerfilUsers from './listUserProfile/list-permis-user';
import { Checkbox, CheckboxChangeEvent } from 'primereact/checkbox';
import { Paginator, PaginatorPageChangeEvent } from 'primereact/paginator';
import { useGenericSearch } from '@/app/services/debounceSearch/controller';
import DialogFilter from '@/app/components/dialogs/dialogFilterComponents/dialogFilter';
import { useIsDesktop, useIsMobile } from '@/app/components/responsiveCelular/responsive';
import { ativarPerfilUser, deletarPerfilUser, listPerfilUser } from './controller/controller';

const PerfilUsuarios: React.FC = () => {
    const pageSize = usePageSize();
    const isMobile = useIsMobile();
    const isDesktop = useIsDesktop();
    const router = useRouter();
    const toast = useRef<Toast>(null);
    const { isDarkMode } = useTheme();
    const msgs = useRef<Messages | null>(null);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [visible, setVisible] = useState<boolean>(false);
    const [perfilUser, setPerfilUser] = useState<PerfilUser>(
        new PerfilUser({
                   ativo: true,
                   id: 0,
                   nome: '',
                   perfilUsuario: false,
                   perfilUsuarioCadastrar: false,
                   perfilUsuarioAlterar: false,
                   perfilUsuarioDesativar: false,
                   perfilUsuarioPesquisar: false,
                   usuarioConta: false,
                   usuarioContaCadastrar: false,
                   usuarioContaAlterar: false,
                   usuarioContaDesativar: false,
                   usuarioContaPesquisar: false,
                   empresa: false,
                   empresaCadastrar: false,
                   empresaAlterar: false,
                   empresaDesativar: false,
                   empresaPesquisar: false,
                   pessoa: false,
                   pessoaCadastrar: false,
                   pessoaAlterar: false,
                   pessoaDesativar: false,
                   pessoaPesquisar: false,
                   vendedor: false,
                   vendedorCadastrar: false,
                   vendedorAlterar: false,
                   vendedorDesativar: false,
                   vendedorPesquisar: false,
                   servico: false,
                   servicoCadastrar: false,
                   servicoAlterar: false,
                   servicoDesativar: false,
                   servicoPesquisar: false,
                   ordemServico: false,
                   ordemServicoCadastrar: false,
                   ordemServicoAlterar: false,
                   ordemServicoDesativar: false,
                   ordemServicoPesquisar: false,
                   ordemServicoTipoVisualizacao: '',
                   contrato: false,
                   contratoCadastrar: false,
                   contratoAlterar: false,
                   contratoDesativar: false,
                   contratoPesquisar: false,
                   contratoTipoVisualizacao: '',
                   categoriaContrato: false,
                   categoriaContratoCadastrar: false,
                   categoriaContratoAlterar: false,
                   categoriaContratoDesativar: false,
                   categoriaContratoPesquisar: false,
                   formaPagamento: false,
                   formaPagamentoCadastrar: false,
                   formaPagamentoAlterar: false,
                   formaPagamentoDesativar: false,
                   formaPagamentoPesquisar: false,
                   nfseTipoVisualizacao:''
               }));
   
    const [listarInativos, setListarInativos] = useState<boolean>(false);
    const [isPerfilUsuarioCreated, setIsPerfilUsuarioCreated] = useState(false);
    const [selectedPerfilUser, setSelectedPerfilUser] = useState<PerfilUser | null>(null);
    const [listPaginationPerfilUser, setListPaginationPerfilUser] = useState<Record<string, any>>({
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
        router.push('/cadastro/perfilUsuario/created');
        setIsPerfilUsuarioCreated(true);
    };
    const handleListPerfilUser = async (pageNumber?: number, _searchTerm?: string, listarInativos = false) => {
        setLoading(true);
        try {
            const perfilUsers = await listPerfilUser(
                {
                    ...listPaginationPerfilUser,
                    pageable: {
                        ...listPaginationPerfilUser.pageable,
                        pageNumber: pageNumber ?? listPaginationPerfilUser.pageable.pageNumber,
                        pageSize: pageSize
                    }
                },
                listarInativos,
                setLoading,
                _searchTerm ?? searchTerm
            );
            setListPaginationPerfilUser(perfilUsers);
        } catch (error) {
            toast.current?.show({
                severity: 'error',
                summary: 'Erro',
                detail: 'Falha ao buscar Perfil de Usuário',
                life: 3000
            });
        } finally {
            setLoading(false);
        }
    };
    const { debouncedSearch, searchNow } = useGenericSearch({
        setter: setPerfilUser,
        field: 'nome',
        onSearch: (value) => handleListPerfilUser(0, value, listarInativos)
    });
    const handleCheckboxChange = (e: CheckboxChangeEvent) => {
        const newValue = e.checked ?? false;
        setListarInativos(newValue);
        handleListPerfilUser(0, searchTerm, newValue);
        setVisible(false);
    };
    const onPageChange = (event: PaginatorPageChangeEvent) => {
        const selectedPage = event.page;
        setListPaginationPerfilUser((prev) => ({
            ...prev,
            pageable: {
                ...prev.pageable,
                pageNumber: selectedPage
            }
        }));
        handleListPerfilUser(selectedPage, searchTerm, listarInativos);
    };
    const handleSearchChange = (event: ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value;
        setSearchTerm(value);
        debouncedSearch(value);
    };
    const handleSalvarFiltro = () => {
        handleListPerfilUser(0, searchTerm, listarInativos);
        setVisible(false);
    };
    const handleCancelarFiltro = () => {
        setVisible(false);
    };
    const handleCheckboxChangeMobile = (e: CheckboxChangeEvent) => {
        setListarInativos(e.checked ?? false);
    };
    useEffect(() => {
        handleListPerfilUser();
    }, []);
    return (
        <div className="w-full">
            <Messages ref={msgs} className="custom-messages" />
            {isMobile && (
                <>
                    <div className="card styled-container-main-all-routes">
                        <div className="scrollable-container">
                            <div className="grid formgrid p-0">
                                <div className="col-8 mb-0 lg:col-6 lg:mb-0 p-0">
                                    <Input
                                        label="Buscar"
                                        outlined={true}
                                        id="nome"
                                        useRightButton={true}
                                        iconRight={'pi pi-search'}
                                        onChange={handleSearchChange}
                                        value={searchTerm}
                                        loading={loading}
                                        onClickSearch={() => searchNow(searchTerm)}
                                        topLabel="Permissões:"
                                        showTopLabel
                                    />
                                </div>
                                <div className="col-4 mb-0 lg:col-3 lg:mb-0 p-0 ">
                                    <div className="container-BTN-Filter-Created mt-2">
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
                            <ListarPerfilUsers
                                loading={loading}
                                listPaginationPerfilUser={listPaginationPerfilUser}
                                deletar={(id) => deletarPerfilUser(id, msgs, listPaginationPerfilUser, listarInativos, setLoading, searchTerm)}
                                ativar={(id) => ativarPerfilUser(id, msgs, listPaginationPerfilUser, listarInativos, setLoading, searchTerm)}
                                setSelectedPerfilUser={setSelectedPerfilUser}
                                selectedPerfil={selectedPerfilUser}
                                setLoading={setLoading}
                                searchTerm={searchTerm}
                                setListPaginationPerfilUser={setListPaginationPerfilUser}
                                listarInativos={listarInativos}
                            />
                        </div>
                        <div style={{ marginTop: 'auto' }}>
                            <div className="custom-paginator">
                                <Paginator
                                    first={listPaginationPerfilUser.pageable.pageNumber * listPaginationPerfilUser.pageable.pageSize}
                                    rows={pageSize}
                                    totalRecords={listPaginationPerfilUser.totalElements}
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
                                    <div className="col-12 lg:col-3 container-input-search-all" >
                                        <Input
                                            label="Buscar"
                                            outlined={true}
                                            id="nome"
                                            useRightButton={true}
                                            iconRight={'pi pi-search'}
                                            onChange={handleSearchChange}
                                            value={searchTerm}
                                            loading={loading}
                                            onClickSearch={() => searchNow(searchTerm)}
                                            topLabel="Permissões:"
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
                                        <Button icon="pi pi-plus" label="Novo" onClick={handleNavigate} className="p-button-primary-novo" />
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div>
                            <ListarPerfilUsers
                                loading={loading}
                                listPaginationPerfilUser={listPaginationPerfilUser}
                                deletar={(id) => deletarPerfilUser(id, msgs, listPaginationPerfilUser, listarInativos, setLoading, searchTerm)}
                                ativar={(id) => ativarPerfilUser(id, msgs, listPaginationPerfilUser, listarInativos, setLoading, searchTerm)}
                                setSelectedPerfilUser={setSelectedPerfilUser}
                                selectedPerfil={selectedPerfilUser}
                                setLoading={setLoading}
                                searchTerm={searchTerm}
                                setListPaginationPerfilUser={setListPaginationPerfilUser}
                                listarInativos={listarInativos}
                            />
                        </div>
                        <div style={{ marginTop: 'auto' }}>
                            <Paginator first={listPaginationPerfilUser.pageable.pageNumber * listPaginationPerfilUser.pageable.pageSize} rows={pageSize} totalRecords={listPaginationPerfilUser.totalElements} onPageChange={onPageChange} />
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

export default PerfilUsuarios;
