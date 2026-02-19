'use client';
import './styledDialog.css';
import '@/app/styles/styledGlobal.css';
import BlocoServico from './components/BlocoServico';
import BlocoTomador from './components/BlocoTomador';
import { TabView, TabPanel } from 'primereact/tabview';
import BlocoPrestador from './components/BlocoPrestador';

export function NotaServico(props: any) {
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
    return (
        <div>
            <TabView className="custom-tabs">
                <TabPanel header="Empresa  (Prestador)">
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
                <TabPanel header="Cliente (Tomador)">
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
                <TabPanel header="Serviço">
                    <BlocoServico nfseGerada={nfseGerada} handleNumberChange={handleNumberChange} handleAllChanges={handleAllChanges} handleDropdownChange={handleDropdownChange} errors={errors} />
                </TabPanel>
            </TabView>
        </div>
    );
}
export default NotaServico;
