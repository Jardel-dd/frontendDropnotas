'use client';
import './styledDialog.css';
import '@/app/styles/styledGlobal.css';
import BlocoServico from './components/BlocoServico';
import BlocoTomador from './components/BlocoTomador';
import { TabView, TabPanel } from 'primereact/tabview';
import BlocoPrestador from './components/BlocoPrestador';
import { useTheme } from '@/app/components/isDarkMode/isDarkMode';
import { getScopedErrors } from '@/app/(main)/notaServico/controller/validation';

export function NotaServico(props: any) {
    const { isDarkMode } = useTheme();
    const invalidTabMessage = 'Verifique este menu, possui campos obrigatorios nao preenchidos';

    const {
        nfseGerada,
        handleAllChanges,
        handleDropdownChange,
        handleSubmit,
        errors,
        handleSearchCep,
        setLoadingCep,
        setNfs,
        setError,
        msgs,
        router,
        handleNumberChange,
        setNfseGerada,
        tipo_rps,
        prestacaoSus,
        incentivoFiscal,
        handleDropdownChangeEnderecoTomador,
        handleDropdownChangeEnderecoPrestador,
        getCitiesFromState,
        loadingCep
    } = props;

    const scopedErrors = errors ?? {};
    const hasPrestadorErrors = Object.keys(getScopedErrors(scopedErrors, 'prestador')).length > 0;
    const hasTomadorErrors = Object.keys(getScopedErrors(scopedErrors, 'tomador')).length > 0;
    const hasServicoErrors = Object.keys(getScopedErrors(scopedErrors, 'servico')).length > 0;

    return (
        <div className="shared-form-tabbed-body">
            <TabView className={`shared-form-tabs shared-form-tabbed-view ${isDarkMode ? 'dark-mode' : 'light-mode'}`}>
                <TabPanel
                    header={
                        <span className="shared-form-tab-label">
                            Empresa (Prestador)
                            {hasPrestadorErrors && <i className="pi pi-exclamation-circle shared-form-tab-alert" title={invalidTabMessage} aria-label={invalidTabMessage} />}
                        </span>
                    }
                >
                    <BlocoPrestador
                        nfseGerada={nfseGerada}
                        handleAllChanges={handleAllChanges}
                        handleDropdownChange={handleDropdownChange}
                        handleSubmit={handleSubmit}
                        handleSearchCep={handleSearchCep}
                        setLoadingCep={setLoadingCep}
                        setNfs={setNfs}
                        setError={setError}
                        msgs={msgs}
                        errors={errors}
                        incentivoFiscal={incentivoFiscal}
                        prestacaoSus={prestacaoSus}
                        handleDropdownChangeEnderecoPrestador={handleDropdownChangeEnderecoPrestador}
                        loadingCep={loadingCep}
                    />
                </TabPanel>
                <TabPanel
                    header={
                        <span className="shared-form-tab-label">
                            Cliente (Tomador)
                            {hasTomadorErrors && <i className="pi pi-exclamation-circle shared-form-tab-alert" title={invalidTabMessage} aria-label={invalidTabMessage} />}
                        </span>
                    }
                >
                    <BlocoTomador
                        nfseGerada={nfseGerada}
                        handleAllChanges={handleAllChanges}
                        handleDropdownChange={handleDropdownChange}
                        handleSearchCep={handleSearchCep}
                        setLoadingCep={setLoadingCep}
                        setNfs={setNfs}
                        setError={setError}
                        msgs={msgs}
                        errors={errors}
                        handleDropdownChangeEnderecoTomador={handleDropdownChangeEnderecoTomador}
                        loadingCep={loadingCep}
                    />
                </TabPanel>
                <TabPanel
                    header={
                        <span className="shared-form-tab-label">
                            Serviço
                            {hasServicoErrors && <i className="pi pi-exclamation-circle shared-form-tab-alert" title={invalidTabMessage} aria-label={invalidTabMessage} />}
                        </span>
                    }
                >
                    <BlocoServico nfseGerada={nfseGerada} handleNumberChange={handleNumberChange} handleAllChanges={handleAllChanges} handleDropdownChange={handleDropdownChange} errors={errors} />
                </TabPanel>
            </TabView>
        </div>
    );
}
export default NotaServico;
