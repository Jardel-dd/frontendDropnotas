import { getCitiesFromState } from '@/app/entity/maps';
import Input from '@/app/shared/include/input/input-all';
import Dropdown from '@/app/shared/include/dropdown/dropdown';
import { InputMaskDrop } from '@/app/shared/include/inputMask/input';
import EnderecoForm from '@/app/components/enderecos/enderecoFormComponent/enderecoForm';
import { getScopedErrors } from '@/app/(main)/notaServico/controller/validation';

type Props = {
    nfseGerada: any;
    handleAllChanges: (e: any, bloco?: 'prestador' | 'tomador' | 'servico', subBloco?: 'contato') => void;
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
    const prestadorErrors = getScopedErrors(errors, 'prestador');
    const prestadorEnderecoErrors = getScopedErrors(errors, 'prestador.endereco');

    return (
        <div>
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
                        hasError={!!prestadorErrors.cpf_cnpj}
                        errorMessage={prestadorErrors.cpf_cnpj}
                        onClickSearch={() => {}}
                        outlined={false}
                        showTopLabel
                        required
                        topLabel="CNPJ:"
                    />
                </div>
                <div className="col-12 lg:col-5">
                    <Input
                        id="razao_social"
                        value={nfseGerada.prestador?.razao_social || ''}
                        label="Razão Social:"
                        onChange={(e) => handleAllChanges(e, 'prestador')}
                        hasError={!!prestadorErrors.razao_social}
                        errorMessage={prestadorErrors.razao_social}
                        showTopLabel
                        required
                        topLabel="Razão Social do Prestador:"
                    />
                </div>
                <div className="col-12 lg:col-4">
                    <Input
                        id="nome_fantasia"
                        value={nfseGerada.prestador?.nome_fantasia || ''}
                        label="Nome Fantasia"
                        onChange={(e) => handleAllChanges(e, 'prestador')}
                        hasError={!!prestadorErrors.nome_fantasia}
                        errorMessage={prestadorErrors.nome_fantasia}
                        showTopLabel
                        required
                        topLabel="Nome Fantasia do Prestador:"
                    />
                </div>
                <div className="col-12 lg:col-3">
                    <Input
                        value={nfseGerada.prestador?.inscricao_municipal || ''}
                        onChange={(e) => handleAllChanges(e, 'prestador')}
                        label="Digite Inscrição Municipal"
                        id="inscricao_municipal"
                        type="number"
                        hasError={!!prestadorErrors.inscricao_municipal}
                        errorMessage={prestadorErrors.inscricao_municipal}
                        showTopLabel
                        required
                        topLabel="Inscrição Municipal:"
                    />
                </div>
                <div className="col-12 lg:col-3 ">
                    <Dropdown
                        id="prestacao_sus"
                        value={nfseGerada.prestador?.prestacao_sus ?? null}
                        options={prestacaoSus}
                        onChange={handleDropdownChange}
                        label="Prestação SUS:"
                        hasError={!!prestadorErrors.prestacao_sus}
                        errorMessage={prestadorErrors.prestacao_sus}
                        showTopLabel
                        required
                        topLabel="Selecione a Prestação SUS"
                    />
                </div>
                <div className="col-12 lg:col-3">
                    <Dropdown
                        id="incentivo_fiscal"
                        value={nfseGerada.prestador?.incentivo_fiscal ?? null}
                        options={incentivoFiscal}
                        onChange={handleDropdownChange}
                        label="Selecione o Incentivo Fiscal"
                        hasError={!!prestadorErrors.incentivo_fiscal}
                        errorMessage={prestadorErrors.incentivo_fiscal}
                        showTopLabel
                        required
                        topLabel="Incentivo Fiscal:"
                    />
                </div>
                <div className="col-12 lg:col-3">
                    <Dropdown
                        id="optante_simples_nacional"
                        value={nfseGerada.prestador?.optante_simples_nacional ?? null}
                        options={prestacaoSus}
                        onChange={handleDropdownChange}
                        label="Selecione Optante Simples Nacional:"
                        hasError={!!prestadorErrors.optante_simples_nacional}
                        errorMessage={prestadorErrors.optante_simples_nacional}
                        showTopLabel
                        required
                        topLabel="Optante Simples Nacional:"
                    />
                </div>
                <div className="col-12 lg:col-12">
                    <Input
                        value={nfseGerada.prestador?.email || ''}
                        onChange={(e) => handleAllChanges(e, 'prestador')}
                        label="E-mail"
                        id="email"
                        type="email"
                        hasError={!!prestadorErrors.email}
                        errorMessage={prestadorErrors.email}
                        showTopLabel
                        topLabel="E-mail:"
                    />
                </div>
            </div>
            <div className="grid formgrid ">
                <div className="col-12 lg:col-12">
                    <EnderecoForm
                        endereco={nfseGerada.prestador?.endereco}
                        telefone={nfseGerada.prestador?.telefone}
                        errors={{ ...prestadorEnderecoErrors, telefone: prestadorErrors.telefone }}
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
