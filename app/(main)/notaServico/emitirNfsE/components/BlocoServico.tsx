import { useEffect, useState } from 'react';
import { IconPorcentagem, IconReal } from '@/app/utils/icons/icons';
import Input from '@/app/shared/include/input/input-all';
import { ServiceEntity } from '@/app/entity/ServiceEntity';
import Dropdown from '@/app/shared/include/dropdown/dropdown';
import CustomInputNumber from '@/app/shared/include/inputReal/inputReal';
import { DropdownSearch } from '@/app/shared/include/dropdown/searchDropdownAll';
import { exigibilidadeISSServico, issRetido, responsavelRetencao, tributacaoISSQN } from '@/app/shared/optionsDropDown/options';
import { getScopedErrors } from '@/app/(main)/notaServico/controller/validation';
import { fetchAllCodigoNBS, fetchFilteredCodigoNBS } from '@/app/components/fetchAll/listAllCodigoNBS/controller';
import InputTextarea from '@/app/shared/include/inputTextArea/InputTextarea';
import { fetchAllTabelaServico, fetchFilteredTabelaServico } from '@/app/components/fetchAll/listAllTableService/controller';
import { TableService } from '@/app/entity/TableServiceEntity';

type Props = {
    nfseGerada: any;
    errors: Record<string, string>;
    handleAllChanges: (e: any, bloco?: 'prestador' | 'tomador' | 'servico', subBloco?: 'contato') => void;
    handleNumberChange: (e: any, bloco?: 'prestador' | 'tomador' | 'servico', index?: number) => void;
    handleDropdownChange: (e: any, bloco?: 'prestador' | 'tomador' | 'servico', index?: number) => void;
};

export default function BlocoServico({ nfseGerada, handleNumberChange, handleDropdownChange, handleAllChanges, errors }: Props) {
    const [selectedService, setSelectedService] = useState<TableService | null>(null);
    const [selectedCodigoNBS, setSelectedCodigoNBS] = useState<ServiceEntity | null>(null);
    const servicoErrors = getScopedErrors(errors, 'servico');
    const selectedServiceCode = nfseGerada.servico?.item_lista_servico?.toString().trim() ?? '';

    useEffect(() => {
        let isMounted = true;

        const syncSelectedService = async () => {
            if (!selectedServiceCode) {
                setSelectedService(null);
                return;
            }

            if (selectedService?.codigo === selectedServiceCode) {
                return;
            }

            const serviceOptions = await fetchFilteredTabelaServico(selectedServiceCode);

            if (!isMounted) {
                return;
            }

            const matchedService =
                serviceOptions.find((service) => service.codigo === selectedServiceCode) ??
                new TableService({
                    id: 0,
                    codigo: selectedServiceCode,
                    descricao: selectedServiceCode
                });

            setSelectedService(matchedService);
        };

        void syncSelectedService();

        return () => {
            isMounted = false;
        };
    }, [selectedService?.codigo, selectedServiceCode]);

    return (
        <div className="grid formgrid ">
            <div className="col-12 lg:col-9">
                <Input
                    id="descricao"
                    value={nfseGerada.servico?.descricao || ''}
                    label="Descrição"
                    onChange={(e) => handleAllChanges(e, 'servico')}
                    hasError={!!servicoErrors.descricao}
                    errorMessage={servicoErrors.descricao}
                    showTopLabel
                    required
                    topLabel="Descrição:"
                />
            </div>
            <div className="col-12 lg:col-3">
                <CustomInputNumber
                    id="valor_servico"
                    value={nfseGerada.servico.valores?.valor_servico ?? 0}
                    onChange={(e) => handleNumberChange(e, 'servico')}
                    label="Valor Serviço:"
                    useRightButton
                    outlined
                    iconLeft={<IconReal isDarkMode={false} />}
                    hasError={!!servicoErrors['valores.valor_servico']}
                    errorMessage={servicoErrors['valores.valor_servico']}
                    showTopLabel
                    required
                    topLabel="Valor Serviço"
                />
            </div>
            <div className="col-12 lg:col-3">
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
            <div className="col-12 lg:col-3">
                <Dropdown
                    value={nfseGerada.servico?.iss_retido ?? ''}
                    onChange={(e) => handleDropdownChange(e, 'servico')}
                    label="Iss Retido"
                    options={issRetido}
                    id="iss_retido"
                    hasError={!!servicoErrors.iss_retido}
                    errorMessage={servicoErrors.iss_retido}
                    topLabel="ISS Retido:"
                    showTopLabel
                    required
                />
            </div>
            <div className="col-12 lg:col-3">
                <Dropdown
                    id="tributacao_issqn"
                    value={nfseGerada.servico.tributacao_issqn ?? 0}
                    options={tributacaoISSQN}
                    onChange={(e) => handleDropdownChange(e, 'servico')}
                    label="Selecione a Tributária ISSQN "
                    hasError={!!servicoErrors.tributacao_issqn}
                    errorMessage={servicoErrors.tributacao_issqn}
                    showTopLabel
                    required
                    topLabel="Tributária ISSQN:"
                />
            </div>
            <div className="col-12 lg:col-3">
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
                    fetchAllItems={fetchAllCodigoNBS}
                    fetchFilteredItems={fetchFilteredCodigoNBS}
                    optionLabel={'descricao' as keyof ServiceEntity}
                    placeholder="Selecione Código NBS"
                    hasError={!!servicoErrors.codigo_nbs}
                    errorMessage={servicoErrors.codigo_nbs}
                    topLabel="Código NBS:"
                    showTopLabel
                    required
                />
            </div>
            <div className="col-12 lg:col-3">
                 <DropdownSearch<TableService>
                                    id="item_lista_servico"
                                    selectedItem={selectedService}
                                    onItemChange={(service) => {
                                        setSelectedService(service);
                                        handleAllChanges(
                                            {
                                                target: {
                                                    id: 'item_lista_servico',
                                                    value: service?.codigo ?? '',
                                                    type: 'text'
                                                }
                                            },
                                            'servico'
                                        );
                                    }}
                                    fetchAllItems={fetchAllTabelaServico}
                                    fetchFilteredItems={fetchFilteredTabelaServico}
                                    optionValue="codigo"
                                    optionLabel="descricao"
                                    hasError={!!servicoErrors.item_lista_servico}
                                    errorMessage={servicoErrors.item_lista_servico}
                                    topLabel="Código do Serviço:"
                                    showTopLabel
                                    required
                                />
               
            </div>
            <div className="col-12 lg:col-3">
                <Dropdown
                    id="responsavel_retencao"
                    value={nfseGerada.servico.responsavel_retencao ?? ''}
                    options={responsavelRetencao}
                    onChange={(e) => handleDropdownChange(e, 'servico')}
                    label="Selecione o Responsavel Retenção:"
                    hasError={!!servicoErrors.responsavel_retencao}
                    errorMessage={servicoErrors.responsavel_retencao}
                    showTopLabel
                    required
                    topLabel="Responsavel Retenção:"
                />
            </div>
            <div className="col-12 lg:col-3">
                <Input
                    id="codigo_municipio"
                    label="Código do Município"
                    value={nfseGerada.servico.codigo_municipio || ''}
                    onChange={(e) => handleAllChanges(e, 'servico')}
                    hasError={!!servicoErrors.codigo_municipio}
                    errorMessage={servicoErrors.codigo_municipio}
                    topLabel="Código do Município:"
                    showTopLabel
                    required
                />
            </div>
            <div className="col-12 lg:col-3">
                <Input
                    id="codigo_tributacao_municipio"
                    label="Código do Tributação Municipal"
                    value={nfseGerada.servico.codigo_tributacao_municipio || ''}
                    onChange={(e) => handleAllChanges(e, 'servico')}
                    hasError={!!servicoErrors.codigo_tributacao_municipio}
                    errorMessage={servicoErrors.codigo_tributacao_municipio}
                    topLabel="Código do Tributação Municipal:"
                    showTopLabel
                />
            </div>
            <div className="col-12 lg:col-3">
                   <CustomInputNumber
                    id="valor_servico"
                    value={nfseGerada.servico.valores?.base_calculo ?? 0}
                    onChange={(e) => handleNumberChange(e, 'servico')}
                    label="Base de Cálculo:"
                    useRightButton
                    outlined
                    iconLeft={<IconReal isDarkMode={false} />}
                    hasError={!!servicoErrors['valores.base_calculo']}
                    errorMessage={servicoErrors['valores.base_calculo']}
                    showTopLabel
                    required
                    topLabel="Base de Cálculo"
                />
                
            </div>
            <div className="col-12 lg:col-3">
                <CustomInputNumber
                    id="aliquota_iss"
                    value={nfseGerada.servico?.valores.aliquota_iss ?? 0}
                    label="Alíquota ISS"
                    onChange={(e) => handleNumberChange(e, 'servico')}
                    showTopLabel
                    required
                    topLabel="Alíquota ISS:"
                    iconLeft={<IconPorcentagem isDarkMode={false} />}
                />
            </div>
            <div className="col-12 lg:col-3">
                <CustomInputNumber
                    id="aliquota_deducoes"
                    value={nfseGerada.servico?.valores.aliquota_deducoes ?? 0}
                    label="Alíquota Deduções"
                    onChange={(e) => handleNumberChange(e, 'servico')}
                    showTopLabel
                    required
                    topLabel="Alíquota Deduções:"
                    iconLeft={<IconPorcentagem isDarkMode={false} />}
                />
            </div>
            <div className="col-12 lg:col-3">
                <CustomInputNumber
                    id="aliquota_pis"
                    value={nfseGerada.servico?.valores.aliquota_pis ?? 0}
                    label="Alíquota PIS"
                    onChange={(e) => handleNumberChange(e, 'servico')}
                    showTopLabel
                    required
                    topLabel="Alíquota PIS:"
                    iconLeft={<IconPorcentagem isDarkMode={false} />}
                />
            </div>
            <div className="col-12 lg:col-3">
                <CustomInputNumber
                    id="aliquota_cofins"
                    value={nfseGerada.servico?.valores.aliquota_cofins ?? 0}
                    label="Alíquota COFINS"
                    onChange={(e) => handleNumberChange(e, 'servico')}
                    showTopLabel
                    required
                    topLabel="Alíquota COFINS:"
                    iconLeft={<IconPorcentagem isDarkMode={false} />}
                />
            </div>
            <div className="col-12 lg:col-3">
                <CustomInputNumber
                    id="aliquota_inss"
                    value={nfseGerada.servico?.valores.aliquota_inss ?? 0}
                    label="Alíquota INSS"
                    onChange={(e) => handleNumberChange(e, 'servico')}
                    showTopLabel
                    required
                    topLabel="Alíquota INSS:"
                    iconLeft={<IconPorcentagem isDarkMode={false} />}
                />
            </div>
            <div className="col-12 lg:col-3">
                <CustomInputNumber
                    id="aliquota_ir"
                    value={nfseGerada.servico?.valores.aliquota_ir ?? 0}
                    label="Alíquota IR"
                    onChange={(e) => handleNumberChange(e, 'servico')}
                    showTopLabel
                    required
                    topLabel="Alíquota IR:"
                    iconLeft={<IconPorcentagem isDarkMode={false} />}
                />
            </div>
            <div className="col-12 lg:col-3">
                <CustomInputNumber
                    id="aliquota_csll"
                    value={nfseGerada.servico?.valores.aliquota_csll ?? 0}
                    label="Alíquota CSLL"
                    onChange={(e) => handleNumberChange(e, 'servico')}
                    showTopLabel
                    required
                    topLabel="Alíquota CSLL:"
                    iconLeft={<IconPorcentagem isDarkMode={false} />}
                />
            </div>
            <div className="col-12 lg:col-3">
                <CustomInputNumber
                    id="aliquota_outras_retencoes"
                    value={nfseGerada.servico?.valores.aliquota_outras_retencoes ?? 0}
                    label="Alíquota outras Retenções"
                    onChange={(e) => handleNumberChange(e, 'servico')}
                    showTopLabel
                    required
                    topLabel="Alíquota outras Retenções:"
                    iconLeft={<IconPorcentagem isDarkMode={false} />}
                />
            </div>
            <div className="col-12 lg:col-3">
                <CustomInputNumber
                    id="percentual_desconto_incondicionado"
                    value={nfseGerada.servico?.valores.percentual_desconto_incondicionado ?? 0}
                    label="Percentual desconto Incondicionado"
                    onChange={(e) => handleNumberChange(e, 'servico')}
                    showTopLabel
                    required
                    topLabel="Percentual desconto Incondicionado:"
                    iconLeft={<IconPorcentagem isDarkMode={false} />}
                />
            </div>
            <div className="col-12 lg:col-3">
                <CustomInputNumber
                    id="percentual_desconto_condicionado"
                    value={nfseGerada.servico?.valores.percentual_desconto_condicionado ?? 0}
                    label="Percentual desconto Condicionado"
                    onChange={(e) => handleNumberChange(e, 'servico')}
                    showTopLabel
                    required
                    topLabel="Percentual desconto Condicionado:"
                    iconLeft={<IconPorcentagem isDarkMode={false} />}
                />
            </div>
            <div className="col-12 mb-1 lg:col-3 lg:mb-0 w-full">
                <InputTextarea
                    value={nfseGerada.servico?.descricao_completa || ''}
                    onChange={(e) => handleAllChanges(e, 'servico')}
                    rows={5}
                    cols={30}
                    label=""
                    id="descricao_completa"
                    topLabel="Descrição Complementar:"
                    showTopLabel
                />
            </div>
        </div>
    );
}
