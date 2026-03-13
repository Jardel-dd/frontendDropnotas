import { getCitiesFromState } from '@/app/entity/maps';
import Input from '@/app/shared/include/input/input-all';
import Dropdown from '@/app/shared/include/dropdown/dropdown';
import { InputMaskDrop } from '@/app/shared/include/inputMask/input';
import EnderecoForm from '@/app/components/enderecos/enderecoFormComponent/enderecoForm';

type Props = {
    nfseGerada: any;
    handleAllChanges: (e: any, bloco?: 'prestador' | 'tomador' | 'servico') => void;
    handleDropdownChange: (e: any) => void;
    handleSubmit: (e: any) => void;
    handleSearchCep: Function;
    setLoadingCep: Function;
    setNfs: Function;
    setError: Function;
    msgs: any;
    errors: Record<string, string>;
    incentivoFiscal: any[];
    prestacaoSus: any[];
    handleDropdownChangeEnderecoPrestador: (e: any) => void;
    loadingCep: boolean;
};

export default function BlocoPrestador({
    nfseGerada,
    handleAllChanges,
    handleDropdownChange,
    handleSubmit,
    handleSearchCep,
    setLoadingCep,
    setNfs,
    setError,
    msgs,
    errors,
    incentivoFiscal,
    prestacaoSus,
    handleDropdownChangeEnderecoPrestador,
    loadingCep
}: Props) {
    return (
        <div >
            <div className="grid formgrid">
                <div className="col-12 mb-0 lg:col-3 lg:mb-0">
                    <InputMaskDrop
                        id="cpf_cnpj"
                        value={nfseGerada.prestador?.cpf_cnpj || ''}
                        onChange={(e) =>
                            handleAllChanges({
                                target: {
                                    id: e.target.id,
                                    value: e.value,
                                    type: 'text'
                                }
                            })
                        }
                        placeholder="99.999.999/9999-99"
                        mask="99.999.999/9999-99"
                        iconRight="pi pi-search"
                        errorMessage={errors.cnpj}
                        onClickSearch={() => {}}
                        outlined={false}
                        showTopLabel
                        required
                        topLabel=" CNPJ:"
                    />
                </div>
                <div className="col-12 mb-1 lg:col-5">
                    <Input 
                    id="razao_social" 
                    value={nfseGerada.prestador?.razao_social || ''} 
                    label="Razão Social:" 
                    onChange={(e) => handleAllChanges(e, 'prestador')} 
                    showTopLabel 
                    required 
                    topLabel="Razão Social do Prestador:" />
                </div>
                <div className="col-12 mb-1 lg:col-4">
                    <Input 
                    id="nome_fantasia" 
                    value={nfseGerada.prestador?.nome_fantasia || ''} 
                    label="Nome Fantasia" 
                    onChange={(e) => handleAllChanges(e, 'prestador')} 
                    showTopLabel 
                    required 
                    topLabel="Nome Fantasia do Prestador:" 
                    />
                </div>
                <div className="col-12 mb-1 lg:col-3 lg:mb-0">
                    <Input
                        value={nfseGerada.prestador?.inscricao_municipal || ''}
                        onChange={(e) => handleAllChanges(e, 'prestador')}
                        label="Digite Inscrição Municipal"
                        id="inscricao_municipal"
                        type="number"
                        showTopLabel
                        required
                        topLabel="Inscrição Municipal:"
                    />
                </div>
                <div className="col-12 mb-1 lg:col-3 lg:mb-0">
                    <Dropdown
                        id="prestacao_sus"
                        value={nfseGerada.prestador?.prestacao_sus ?? null}
                        options={prestacaoSus}
                        onChange={handleDropdownChange}
                        label="Prestação SUS:"
                        hasError={!!errors.prestacao_sus}
                        errorMessage={errors.prestacao_sus}
                        showTopLabel
                        required
                        topLabel="Selecione a Prestação SUS"
                    />
                </div>
                <div className="col-12 mb-1 lg:col-3 lg:mb-0">
                    <Dropdown
                        id="incentivo_fiscal"
                        value={nfseGerada.prestador?.incentivo_fiscal ?? null}
                        options={incentivoFiscal}
                        onChange={handleDropdownChange}
                        label="Selecione o Incentivo Fiscal"
                        hasError={!!errors.incentivo_fiscal}
                        errorMessage={errors.incentivo_fiscal}
                        showTopLabel
                        required
                        topLabel="Incentivo Fiscal:"
                    />
                </div>
                <div className="col-12 mb-1 lg:col-3 lg:mb-0">
                    <Dropdown
                        id="optante_simples_nacional"
                        value={nfseGerada.prestador?.optante_simples_nacional ?? null}
                        options={prestacaoSus}
                        onChange={handleDropdownChange}
                        label="Selecione Optante Simples Nacional:"
                        showTopLabel
                        required
                        topLabel="Optante Simples Nacional:"
                    />
                </div>
                <div className="col-12 mb-1 lg:col-12 lg:mb-0">
                    <Input 
                    value={nfseGerada.prestador?.email || ''} 
                    onChange={(e) => handleAllChanges(e, 'prestador')} 
                    label="E-mail" 
                    id="email" 
                    type="email" 
                    showTopLabel 
                    topLabel="E-mail:" 
                    />
                </div>
            </div>
            <div className="grid formgrid ">
                <div className="col-12 mb-1 lg:col-12">
                    <EnderecoForm
                        endereco={nfseGerada.prestador?.endereco}
                        telefone={nfseGerada.prestador?.telefone}
                        errors={errors}
                        onChange={handleDropdownChangeEnderecoPrestador}
                        onCepSearch={() => handleSearchCep(nfseGerada.prestador?.endereco?.cep || '', setLoadingCep, setNfs, setError, msgs)}
                        onDropdownChange={handleDropdownChange}
                        onDropdownChangeEndereco={handleDropdownChangeEnderecoPrestador}
                        getCitiesFromState={getCitiesFromState}
                        loadingCep={loadingCep}
                    />
                </div>
            </div>
        </div>
    );
}
