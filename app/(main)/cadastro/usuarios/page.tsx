'use client';
import '@/app/styles/styledGlobal.css'
import { Toast } from 'primereact/toast';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { useRouter } from 'next/navigation';
import ListarUserConta from './listUser/list';
import { Messages } from 'primereact/messages';
import Input from '@/app/shared/include/input/input-all';
import { UsuarioContaEntity } from '@/app/entity/UsuarioContaEntity';
import { ativar, deletar, list } from './controller/controller';
import { ChangeEvent, useEffect, useRef, useState } from 'react';
import { usePageSize } from '@/app/components/pageSize/pageSize';
import { Checkbox, CheckboxChangeEvent } from 'primereact/checkbox';
import { Paginator, PaginatorPageChangeEvent } from 'primereact/paginator';
import { useGenericSearch } from '@/app/services/debounceSearch/controller';
import { useIsDesktop, useIsMobile } from '@/app/components/responsiveCelular/responsive';
import DialogFilter from '@/app/components/dialogs/dialogFilterComponents/dialogFilter';

const Usuarios: React.FC = () => {
    const router = useRouter();
    const pageSize = usePageSize();
    const isMobile = useIsMobile();
    const isDesktop = useIsDesktop();
    const toast = useRef<Toast>(null);
    const msgs = useRef<Messages | null>(null);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [visible, setVisible] = useState<boolean>(false);
    const [isUserCreated, setIsUserCreated] = useState(false);
    const [userConta, setUserConta] = useState<UsuarioContaEntity>(
        new UsuarioContaEntity({
            ativo: true,
            foto_perfil: '',
            nome: '',
            email: '',
            senha: ''
        })
    );
    const [listarInativos, setListarInativos] = useState<boolean>(false);
    const [listPaginationUsersConta, setListPaginationUsersConta] = useState<Record<string, any>>({
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
        router.push('/cadastro/usuarios/created');
        setIsUserCreated(true);
    };
    const handleListUsersConta = async (
        pageNumber?: number,
        _searchTerm?: string,
        listarInativos = false
    ) => {
        setLoading(true);
        try {
            const userContas = await list(
                {
                    ...listPaginationUsersConta,
                    pageable: {
                        ...listPaginationUsersConta.pageable,
                        pageNumber: pageNumber ?? listPaginationUsersConta.pageable.pageNumber,
                        pageSize: pageSize,
                    }
                },
                listarInativos,
                setLoading,
                _searchTerm ?? searchTerm
            );
            setListPaginationUsersConta(userContas);
        } catch (error) {
            console.error('Erro ao buscar Usuário:', error);
            toast.current?.show({
                severity: 'error',
                summary: 'Erro',
                detail: 'Falha ao buscar Usuário',
            });
        } finally {
            setLoading(false);
        }
    };
    const { debouncedSearch, searchNow } = useGenericSearch({
        setter: setUserConta,
        field: 'nome',
        onSearch: (value) => handleListUsersConta(0, value, listarInativos),
    });
    const onPageChange = (event: PaginatorPageChangeEvent) => {
        const selectedPage = event.page;
        setListPaginationUsersConta((prev) => ({
            ...prev,
            pageable: {
                ...prev.pageable,
                pageNumber: selectedPage
            }
        }));
        handleListUsersConta(selectedPage, searchTerm, listarInativos);
    };
    const handleCheckboxChange = (e: CheckboxChangeEvent) => {
        const newValue = e.checked ?? false;
        setListarInativos(newValue);
        handleListUsersConta(0, searchTerm, newValue);
        setVisible(false)

    };
    const handleSearchChange = (event: ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value;
        setSearchTerm(value);
        debouncedSearch(value);
    };
    const handleSalvarFiltro = () => {
        handleListUsersConta(0, searchTerm, listarInativos);
        setVisible(false);
    };
    const handleCancelarFiltro = () => {
        setVisible(false);
    };
    const handleCheckboxChangeMobile = (e: CheckboxChangeEvent) => {
        setListarInativos(e.checked ?? false);
    };
    useEffect(() => {
        handleListUsersConta();
    }, []);
    return (
        <div className='w-full'>
            <Messages ref={msgs} className="custom-messages" />
                {isMobile &&
                    <>
            <div className="card styled-container-main-all-routes">
                        <div className="scrollable-container">
                             <div className="grid formgrid p-0">
                            <div className="col-8 mb-0 lg:col-6 lg:mb-0 p-0 ">
                                <Input
                                    label="Buscar"
                                    outlined={true}
                                    useRightButton={true}
                                    iconRight={'pi pi-search'}
                                    id="nome"
                                    onChange={handleSearchChange}
                                    value={searchTerm}
                                    loading={loading}
                                    onClickSearch={() => searchNow(searchTerm)}
                                    topLabel="Usuário:"
                                    showTopLabel
                                />
                                 </div>
                                 <div className="col-4 mb-0 lg:col-3 lg:mb-0 p-0 ">
                                    <div className="container-BTN-Filter-Created mt-2">
                                    <Button className='height-2-8rem-ml-1rem' icon="pi pi-filter" onClick={() => setVisible(true)} outlined />
                                    <Button icon="pi pi-plus" className='ml-1rem' onClick={handleNavigate} />
                                </div>
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
                        <div className='mt-3'>
                            <ListarUserConta
                                loading={loading}
                                listPaginationUserConta={listPaginationUsersConta}
                                setLoading={setLoading}
                                searchTerm={searchTerm}
                                listarInativos={listarInativos}
                                setListPaginationUserConta={setListPaginationUsersConta}
                                deletar={(id) => deletar(id, msgs, listPaginationUsersConta, listarInativos, setLoading, searchTerm)}
                                ativar={(id) => ativar(id, msgs, listPaginationUsersConta, listarInativos, setLoading, searchTerm)}
                            />
                        </div>
                        <div style={{ marginTop: 'auto' }}>
                            <div className="custom-paginator">
                                <Paginator
                                    first={listPaginationUsersConta.pageable.pageNumber * listPaginationUsersConta.pageable.pageSize}
                                    rows={listPaginationUsersConta.pageable.pageSize}
                                    totalRecords={listPaginationUsersConta.totalElements}
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
                }
                {isDesktop &&
                    <>
                        <div className="card styled-container-main-all-routes p-2">
                            <div className="scrollable-container">
                             <div className="p-0">
                                 <div className="grid formgrid">
                                <div className="col-12 lg:col-3 container-input-search-all" >
                                <Input
                                    label="Buscar"
                                    outlined={true}
                                    useRightButton={true}
                                    iconRight={'pi pi-search'}
                                    id="nome"
                                    onChange={handleSearchChange}
                                    value={searchTerm}
                                    loading={loading}
                                    onClickSearch={() => searchNow(searchTerm)} 
                                    topLabel="Usuário:"
                                    showTopLabel/>
                            </div>
                            <div className='checkBox-width-max-10rem'>
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
                            </div>
                            <div className='container-button-primary-novo'>
                                <Button
                                    label="Novo"
                                    icon="pi pi-plus"
                                    onClick={handleNavigate}
                                    className="p-button-primary-novo"
                                />
                            </div>
                        </div>
                        <div className='mt-3'>
                            <ListarUserConta
                                loading={loading}
                                listPaginationUserConta={listPaginationUsersConta}
                                setLoading={setLoading}
                                searchTerm={searchTerm}
                                listarInativos={listarInativos}
                                setListPaginationUserConta={setListPaginationUsersConta}
                                deletar={(id) => deletar(id, msgs, listPaginationUsersConta, listarInativos, setLoading, searchTerm)}
                                ativar={(id) => ativar(id, msgs, listPaginationUsersConta, listarInativos, setLoading, searchTerm)}
                            />
                        </div>
                        </div>
                         </div>
                        <div style={{ marginTop: 'auto' }}>
                            <Paginator
                                first={listPaginationUsersConta.pageable.pageNumber * listPaginationUsersConta.pageable.pageSize}
                                rows={listPaginationUsersConta.pageable.pageSize}
                                totalRecords={listPaginationUsersConta.totalElements}
                                onPageChange={onPageChange}
                            />
                        </div>
                         </div>
                    </>
                }
        </div>
    );
};
export default Usuarios;
