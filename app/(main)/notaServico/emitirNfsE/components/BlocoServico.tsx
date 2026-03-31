import { useState } from 'react';
import { IconPorcentagem, IconReal } from '@/app/utils/icons/icons';
import Input from '@/app/shared/include/input/input-all';
import { ServiceEntity } from '@/app/entity/ServiceEntity';
import Dropdown from '@/app/shared/include/dropdown/dropdown';
import CustomInputNumber from '@/app/shared/include/inputReal/inputReal';
import { DropdownSearch } from '@/app/shared/include/dropdown/searchDropdownAll';
import { searchServiceTable } from '@/app/components/fetchAll/listAllTableService/controller';
import { exigibilidadeISSServico, issRetido, responsavelRetencao, tributacaoISSQN } from '@/app/shared/optionsDropDown/options';
import ServicoDropdownField from '@/app/(main)/cadastro/servicos/dropdown/servico';
import { getScopedErrors } from '@/app/(main)/notaServico/controller/validation';

type Props = {
    nfseGerada: any;
    errors: Record<string, string>;
    handleAllChanges: (e: any, bloco?: 'prestador' | 'tomador' | 'servico') => void;
    handleNumberChange: (e: any, bloco?: 'prestador' | 'tomador' | 'servico', index?: number) => void;
    handleDropdownChange: (e: any, bloco?: 'prestador' | 'tomador' | 'servico', index?: number) => void;
};

export default function BlocoServico({ nfseGerada, handleNumberChange, handleDropdownChange, handleAllChanges, errors }: Props) {
    const [selectedService, setSelectedService] = useState<ServiceEntity | null>(null);
    const [selectedCodigoNBS, setSelectedCodigoNBS] = useState<ServiceEntity | null>(null);
    const servicoErrors = getScopedErrors(errors, 'servico');

    return (
        <div className="grid formgrid ">
            <div className="col-12 mt-1 lg:col-9">
                <Input
                    id="descricao"
                    value={nfseGerada.servico?.descricao || ''}
                    label="DescriÃ§Ã£o"
                    onChange={(e) => handleAllChanges(e, 'servico')}
                    hasError={!!servicoErrors.descricao}
                    errorMessage={servicoErrors.descricao}
                    showTopLabel
                    required
                    topLabel="Descricao"
                />
            </div>
            <div className="col-12 mt-1 lg:col-3">
                <CustomInputNumber
                    id="valor_servico"
                    value={nfseGerada.servico.valores?.valor_servico ?? 0}
                    onChange={(e) => handleNumberChange(e, 'servico')}
                    label="Valor ServiÃ§o:"
                    useRightButton
                    outlined
                    iconLeft={<IconReal isDarkMode={false} />}
                    hasError={!!servicoErrors['valores.valor_servico']}
                    errorMessage={servicoErrors['valores.valor_servico']}
                    showTopLabel
                    required
                    topLabel="Valor ServiÃ§o"
                />
            </div>
            <div className="col-12 mt-1 lg:col-3">
                <Dropdown
                    id="exigibilidade_iss"
                    value={nfseGerada.servico?.exigibilidade_iss ?? ''}
                    options={exigibilidadeISSServico}
                    onChange={(e) => handleDropdownChange(e, 'servico')}
                    label="Selecione a Exigibilidade ISS:"
                    hasError={!!servicoErrors.exigibilidade_iss}
                    errorMessage={servicoErrors.exigibilidade_iss}
                    showTopLabel
                    required
                    topLabel="Exigibilidade ISS:"
                />
            </div>
            <div className="col-12 mt-1 lg:col-3">
                <Dropdown
                    value={nfseGerada.servico?.iss_retido ?? ''}
                    onChange={(e) => handleDropdownChange(e, 'servico')}
                    label="Iss Retido"
                    options={issRetido}
                    id="iss_retido"
                    hasError={!!servicoErrors.iss_retido}
                    errorMessage={servicoErrors.iss_retido}
                    topLabel="Iss Retido:"
                    showTopLabel
                    required
                />
            </div>
            <div className="col-12 mt-1 lg:col-3">
                <Dropdown
                    id="tributacao_issqn"
                    value={nfseGerada.servico.tributacao_issqn ?? 0}
                    options={tributacaoISSQN}
                    onChange={(e) => handleDropdownChange(e, 'servico')}
                    label="Selecione a TributaÃ§Ã£o ISSQN "
                    hasError={!!servicoErrors.tributacao_issqn}
                    errorMessage={servicoErrors.tributacao_issqn}
                    showTopLabel
                    required
                    topLabel="TributaÃ§Ã£o ISSQN:"
                />
            </div>
            <div className="col-12 mt-1 lg:col-3">
                <DropdownSearch<ServiceEntity>
                    id="codigo_nbs"
                    selectedItem={selectedCodigoNBS}
                    onItemChange={(service) => {
                        setSelectedCodigoNBS(service);
                        handleAllChanges(
                            {
                                target: {
                                    id: 'codigo_nbs',
                                    value: service?.codigo_nbs ?? '',
                                    type: 'text'
                                }
                            },
                            'servico'
                        );
                    }}
                    fetchAllItems={searchServiceTable}
                    fetchFilteredItems={searchServiceTable}
                    optionLabel={'descricao' as keyof ServiceEntity}
                    placeholder="Selecione CÃ³digo NBS"
                    hasError={!!servicoErrors.codigo_nbs}
                    errorMessage={servicoErrors.codigo_nbs}
                    topLabel="CÃ³digo NBS:"
                    showTopLabel
                    required
                />
            </div>
            <div className="col-12 mt-1 lg:col-3">
                <ServicoDropdownField
                    id="item_lista_servico"
                    selectedService={selectedService}
                    onServiceChange={(service) => {
                        setSelectedService(service);
                        handleAllChanges(
                            {
                                target: {
                                    id: 'item_lista_servico',
                                    value: service?.item_lista_servico ?? '',
                                    type: 'text'
                                }
                            },
                            'servico'
                        );
                        handleAllChanges(
                            {
                                target: {
                                    id: 'codigo_cnae',
                                    value: service?.codigo_cnae ?? '',
                                    type: 'text'
                                }
                            },
                            'servico'
                        );
                    }}
                    placeholder="Selecione um servico"
                    topLabel="Descricao da Atividade do Servico:"
                    showTopLabel
                    required
                    hasError={!!servicoErrors.item_lista_servico}
                    errorMessage={servicoErrors.item_lista_servico}
                />
            </div>
            <div className="col-12 mt-1 lg:col-3">
                <Dropdown
                    id="responsavel_retencao"
                    value={nfseGerada.servico.responsavel_retencao ?? ''}
                    options={responsavelRetencao}
                    onChange={(e) => handleDropdownChange(e, 'servico')}
                    label="Selecione o Responsavel RetenÃ§Ã£o:"
                    hasError={!!servicoErrors.responsavel_retencao}
                    errorMessage={servicoErrors.responsavel_retencao}
                    showTopLabel
                    required
                    topLabel="Responsavel RetenÃ§Ã£o:"
                />
            </div>
            <div className="col-12 mt-1 lg:col-3">
                <Input
                    id="codigo_municipio"
                    label="CÃ³digo do MunicÃ­pio"
                    value={nfseGerada.servico.codigo_municipio || ''}
                    onChange={(e) => handleAllChanges(e, 'servico')}
                    hasError={!!servicoErrors.codigo_municipio}
                    errorMessage={servicoErrors.codigo_municipio}
                    topLabel="CÃ³digo do MunicÃ­pio:"
                    showTopLabel
                    required
                />
            </div>
            <div className="col-12 mt-1 lg:col-3">
                <Input
                    id="municipio_incidencia"
                    value={nfseGerada.servico?.municipio_incidencia || ''}
                    label="MunicÃ­pio IncidÃªncia"
                    onChange={(e) => handleAllChanges(e, 'servico')}
                    showTopLabel
                    required
                    topLabel="CÃ³digo MunicÃ­pio IncidÃªncia:"
                    hasError={!!servicoErrors.municipio_incidencia}
                    errorMessage={servicoErrors.municipio_incidencia}
                />
            </div>
            <div className="col-12 mt-1 lg:col-3">
                <Input
                    id="codigo_tributacao_municipio"
                    label="CÃ³digo do TributaÃ§Ã£o Municipal"
                    value={nfseGerada.servico.codigo_tributacao_municipio || ''}
                    onChange={(e) => handleAllChanges(e, 'servico')}
                    hasError={!!servicoErrors.codigo_tributacao_municipio}
                    errorMessage={servicoErrors.codigo_tributacao_municipio}
                    topLabel="CÃ³digo do TributaÃ§Ã£o Municipal:"
                    showTopLabel
                    required
                />
            </div>
            <div className="col-12 mt-1 lg:col-3">
                <Input
                    id="base_calculo"
                    value={nfseGerada.servico?.valores?.base_calculo ?? 0}
                    label="Base de Calculo"
                    onChange={(e) => handleNumberChange(e, 'servico')}
                    showTopLabel
                    required
                    topLabel="Base de Calculo:"
                    type="number"
                    iconLeft={<IconPorcentagem isDarkMode={false} />}
                />
            </div>
            <div className="col-12 mt-1 lg:col-3">
                <Input
                    id="aliquota_iss"
                    value={nfseGerada.servico?.valores.aliquota_iss ?? 0}
                    label="AlÃ­quota ISS"
                    onChange={(e) => handleNumberChange(e, 'servico')}
                    showTopLabel
                    required
                    topLabel="AlÃ­quota ISS:"
                    type="number"
                    iconLeft={<IconPorcentagem isDarkMode={false} />}
                />
            </div>
            <div className="col-12 mt-1 lg:col-3">
                <Input
                    id="aliquota_deducoes"
                    value={nfseGerada.servico?.valores.aliquota_deducoes ?? 0}
                    label="AlÃ­quota DeduÃ§Ãµes"
                    onChange={(e) => handleNumberChange(e, 'servico')}
                    showTopLabel
                    required
                    topLabel="AlÃ­quota DeduÃ§Ãµes:"
                    type="number"
                    iconLeft={<IconPorcentagem isDarkMode={false} />}
                />
            </div>
            <div className="col-12 mt-1 lg:col-3">
                <Input
                    id="aliquota_pis"
                    value={nfseGerada.servico?.valores.aliquota_pis ?? 0}
                    label="AlÃ­quota PIS"
                    onChange={(e) => handleNumberChange(e, 'servico')}
                    showTopLabel
                    required
                    topLabel="AlÃ­quota PIS:"
                    type="number"
                    iconLeft={<IconPorcentagem isDarkMode={false} />}
                />
            </div>
            <div className="col-12 mt-1 lg:col-3">
                <Input
                    id="aliquota_cofins"
                    value={nfseGerada.servico?.valores.aliquota_cofins ?? 0}
                    label="AlÃ­quota COFINS"
                    onChange={(e) => handleNumberChange(e, 'servico')}
                    showTopLabel
                    required
                    topLabel="AlÃ­quota COFINS:"
                    type="number"
                    iconLeft={<IconPorcentagem isDarkMode={false} />}
                />
            </div>
            <div className="col-12 mt-1 lg:col-3">
                <Input
                    id="aliquota_inss"
                    value={nfseGerada.servico?.valores.aliquota_inss ?? 0}
                    label="AlÃ­quota INSS"
                    onChange={(e) => handleNumberChange(e, 'servico')}
                    showTopLabel
                    required
                    topLabel="AlÃ­quota INSS:"
                    type="number"
                    iconLeft={<IconPorcentagem isDarkMode={false} />}
                />
            </div>
            <div className="col-12 mt-1 lg:col-3">
                <Input
                    id="aliquota_ir"
                    value={nfseGerada.servico?.valores.aliquota_ir ?? 0}
                    label="AlÃ­quota IR"
                    onChange={(e) => handleNumberChange(e, 'servico')}
                    showTopLabel
                    required
                    topLabel="AlÃ­quota IR:"
                    type="number"
                    iconLeft={<IconPorcentagem isDarkMode={false} />}
                />
            </div>
            <div className="col-12 mt-1 lg:col-3">
                <Input
                    id="aliquota_csll"
                    value={nfseGerada.servico?.valores.aliquota_csll ?? 0}
                    label="AlÃ­quota CSLL"
                    onChange={(e) => handleNumberChange(e, 'servico')}
                    showTopLabel
                    required
                    topLabel="AlÃ­quota CSLL:"
                    type="number"
                    iconLeft={<IconPorcentagem isDarkMode={false} />}
                />
            </div>
            <div className="col-12 mt-1 lg:col-3">
                <Input
                    id="aliquota_outras_retencoes"
                    value={nfseGerada.servico?.valores.aliquota_outras_retencoes ?? 0}
                    label="AlÃ­quota outras RetenÃ§Ãµes"
                    onChange={(e) => handleNumberChange(e, 'servico')}
                    showTopLabel
                    required
                    topLabel="AlÃ­quota outras RetenÃ§Ãµes:"
                    type="number"
                    iconLeft={<IconPorcentagem isDarkMode={false} />}
                />
            </div>
            <div className="col-12 mt-1 lg:col-3">
                <Input
                    id="percentual_desconto_incondicionado"
                    value={nfseGerada.servico?.valores.percentual_desconto_incondicionado ?? 0}
                    label="Percentual desconto Incondicionado"
                    onChange={(e) => handleNumberChange(e, 'servico')}
                    showTopLabel
                    required
                    topLabel="Percentual desconto Incondicionado:"
                    type="number"
                    iconLeft={<IconPorcentagem isDarkMode={false} />}
                />
            </div>
            <div className="col-12 mt-1 lg:col-3">
                <Input
                    id="percentual_desconto_condicionado"
                    value={nfseGerada.servico?.valores.percentual_desconto_condicionado ?? 0}
                    label="Percentual desconto Condicionado"
                    onChange={(e) => handleNumberChange(e, 'servico')}
                    showTopLabel
                    required
                    topLabel="Percentual desconto Condicionado:"
                    type="number"
                    iconLeft={<IconPorcentagem isDarkMode={false} />}
                />
            </div>
        </div>
    );
}
