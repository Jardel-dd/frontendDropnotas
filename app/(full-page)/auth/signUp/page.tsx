'use client';
import Link from 'next/link';
import "@/app/styles/styledGlobal.css";
import LoadingScreen from '@/app/loading';
import { Button } from 'primereact/button';
import { useRouter } from 'next/navigation';
import { Messages } from 'primereact/messages';
import IconVisible from '@/app/shared/IconVisible';
import { useEffect, useRef, useState } from 'react';
import Input from '@/app/shared/include/input/input-all';
import { IconCNPJ, IconSearch } from '@/app/utils/icons/icons';
import { UsuarioContaEntity } from '@/app/entity/UsuarioContaEntity';
import { validateFormCreatedAccount } from './controller/validateForm';
import { InputMaskDrop } from '@/app/shared/include/inputMask/input';
import { create, handleSearchCNPJCreated } from './controller/controller';
import { CreatedAccountEntity, } from '../../../entity/CreatedAccountEntity';

export type LoginResponse = {
    token: string;
    refreshToken?: string;
};
function SignUp() {
    const router = useRouter();
    const msgs = useRef<Messages>(null);
    const [isLoggingIn, setIsLoggingIn] = useState(false);
    const [cnpjBuscado, setCnpjBuscado] = useState<string>('');
    const [loadingCnpj, setLoadingCnpj] = useState<boolean>(false);
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);
    const [confirmPassword, setConfirmPassword] = useState<string>('');
    const [userConta, setUserConta] = useState<CreatedAccountEntity>(
        new CreatedAccountEntity({
            usuario_conta: new UsuarioContaEntity({
                nome: '',
                email: '',
                senha: ''
            }),
            nome: '',
            email: '',
            senha: '',
            razao_social: '',
            cnpj: '',
        })
    );
    const [errors, setErrors] = useState<{ [key: string]: string }>({});
    const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] = useState(false);
    const [touchedFields, setTouchedFields] = useState<{ [key: string]: boolean }>({});
    const handleAllChanges = (event: {
        target: { id: string; value: any; checked?: any; type: string }
    }) => {
        const { id, value, type, checked } = event.target;
        setTouchedFields(prev => ({ ...prev, [id]: true }));
        const newValue =
            (type === "checkbox" || type === "switch")
                ? checked
                : id === "cnpj"
                    ? value.replace(/\D/g, "")
                    : value;
        let updatedUserConta: CreatedAccountEntity;
        const newUsuarioContaData = {
            nome: id === 'nome' ? newValue : userConta.usuario_conta.nome,
            email: id === 'email' ? newValue : userConta.usuario_conta.email,
            senha: id === 'senha' ? newValue : userConta.usuario_conta.senha,
        };
        updatedUserConta = userConta.copyWith({
            [id]: newValue,
            usuario_conta: new UsuarioContaEntity(newUsuarioContaData)
        });
        setUserConta(updatedUserConta);
    };
    const togglePasswordVisibility = (event: React.MouseEvent)=> {
         event.preventDefault();
        setIsPasswordVisible(!isPasswordVisible);
        setIsConfirmPasswordVisible(!isConfirmPasswordVisible);
    };
    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        msgs.current?.clear();
        console.log(' userConta1:', userConta);
        console.log('✅ Validação passou! Enviando para o endpoint...');
        setIsLoggingIn(true);
        try {
            await create(userConta, router, msgs);
            console.log('Requisição enviada com sucesso.');
        } catch (error) {
            console.error('Erro ao criar conta:', error);
        } finally {
            setIsLoggingIn(false);
        }
    };
    useEffect(() => {
        validateFormCreatedAccount(userConta, confirmPassword, setErrors, msgs);
    }, [userConta, confirmPassword]);
    useEffect(() => {
        const cnpjNumeros = userConta.cnpj?.replace(/\D/g, '') || '';
        if (cnpjNumeros.length === 14 && cnpjNumeros !== cnpjBuscado) {
            const buscarCnpj = async () => {
                setLoadingCnpj(true);
                try {
                    await handleSearchCNPJCreated(cnpjNumeros, setUserConta, setErrors, msgs);
                    setCnpjBuscado(cnpjNumeros);
                } catch (error) {
                    console.error('Erro ao buscar CNPJ:', error);
                } finally {
                    setLoadingCnpj(false);
                }
            };
            buscarCnpj();
        }
    }, [userConta.cnpj]);
    return (
        <>
            <form onSubmit={handleSubmit}>
                {isLoggingIn && <LoadingScreen loadingText="Criando sua conta, por favor, aguarde..." />}
                <div className="styled-containerSignUp-SignIn">
                    <Messages ref={msgs} className="custom-messages" />
                    <div className="card styled-container-login-register">
                        <img
                            style={{ height: '10rem' }}
                            alt="dropdown icon"
                            src="/layout/images/logoDropNotas.svg"
                        />
                        <p>Para fazer o cadastro você precisa preencher os campos abaixo:</p>
                        <div className="grid formgrid w-full">
                            <div className="col-12 lg:col-12 mt-1" >
                                <InputMaskDrop
                                    id="cnpj"
                                    value={userConta.cnpj || ''}
                                    onChange={(e) => {
                                        handleAllChanges({
                                            target: {
                                                id: e.target.id,
                                                value: e.value,
                                                type: 'text'
                                            }
                                        });
                                    }}
                                    placeholder="99.999.999/9999-99"
                                    mask="99.999.999/9999-99"
                                    iconRight={<IconSearch />}
                                    hasError={!!errors.cnpj}
                                    errorMessage={errors.cnpj}
                                    disabledRightButton={(userConta.cnpj || '').replace(/\D/g, '').length !== 14}
                                    loading={loadingCnpj}
                                    iconLeft={<IconCNPJ />}
                                    autoFocus
                                    onClickSearch={function (): void {
                                        throw new Error('Function not implemented.');
                                    }}
                                    outlined={false}
                                    topLabel="CNPJ:"
                                showTopLabel
                                required
                                />
                            </div>
                            <div className="col-12 lg:col-12 mt-1"  >
                                <Input
                                    id="razao_social"
                                    value={userConta.razao_social || ''}
                                    onChange={handleAllChanges}
                                    label="Digite a Razão Social"
                                    icon="pi pi-building"
                                    iconLeft={'pi pi-building'}
                                    outlined={true}
                                    hasError={!!errors.razao_social}
                                    errorMessage={errors.razao_social}
                                    topLabel="Razão Social:"
                                    showTopLabel
                                    required
                                />
                            </div>
                            <div className="col-12 lg:col-12 mt-1">
                                <Input
                                    id="nome"
                                    value={userConta.nome || ''}
                                    onChange={handleAllChanges}
                                    label="Digite o Nome"
                                    icon="pi pi-user"
                                    iconLeft={'pi pi-user'}
                                    outlined={true}
                                    hasError={!!errors.nome}
                                    errorMessage={errors.nome}
                                    topLabel="Nome:"
                                    showTopLabel
                                    required
                                />
                            </div>
                            <div className="col-12 lg:col-12 mt-1">
                                <Input
                                    id="email"
                                    value={userConta.email || ''}
                                    onChange={handleAllChanges}
                                    label="Digite o E-mail"
                                    icon="pi pi-at"
                                    type='email'
                                    iconLeft={'pi pi-at'}
                                    outlined={true}
                                    hasError={!!errors.email}
                                    errorMessage={errors.email}
                                    topLabel="E-mail:"
                                    showTopLabel
                                    required
                                />
                            </div>

                            <div className="col-12 lg:col-12 mt-1" >
                                <Input
                                    value={userConta.senha || ''}
                                    onChange={handleAllChanges}
                                    label="Digite a Senha"
                                    id="senha"
                                    type={isPasswordVisible ? 'text' : 'password'}
                                    useRightButton={true}
                                    outlined={true}
                                    iconLeft={'pi pi-key'}
                                    iconRight={<IconVisible isPasswordVisible={isPasswordVisible} />}
                                    onClick={togglePasswordVisibility}
                                    hasError={!!errors.senha}
                                    errorMessage={errors.senha}
                                    topLabel="Senha:"
                                    showTopLabel
                                    required
                                />
                            </div>

                            <div className="col-12 lg:col-12 mt-1">
                                <Input
                                    className="w-70"
                                    label="Digite a Confirmação de senha"
                                    id="confirmPassword"
                                    type={isConfirmPasswordVisible ? 'text' : 'password'}
                                    useRightButton={true}
                                    outlined={true}
                                    iconRight={<IconVisible isPasswordVisible={isConfirmPasswordVisible} />}
                                    iconLeft="pi pi-key"
                                    value={confirmPassword}
                                    onChange={(e) => {
                                        setConfirmPassword(e.target.value);
                                        // validatePasswordConfirmation(e.target.value);
                                    }}
                                    onClick={togglePasswordVisibility}
                                    hasError={!!errors.confirmPassword}
                                    errorMessage={errors.confirmPassword}
                                    topLabel="Confirmação de senha:"
                                    showTopLabel
                                    required
                                />
                            </div>
                            <div className='padding-1rem'>
                            </div>
                        </div>
                        <Button
                            label={isLoggingIn ? 'Criando conta...' : 'Criar conta'}
                            icon={isLoggingIn ? 'pi pi-spin pi-spinner' : undefined}
                            className="mb-4"
                            disabled={
                                isLoggingIn ||
                                Object.keys(errors).length > 0 ||
                                !userConta.cnpj ||
                                !userConta.razao_social ||
                                !userConta.nome ||
                                !userConta.email ||
                                !userConta.senha ||
                                !confirmPassword

                            }
                            onClick={() => { }}
                        />
                        <div className="text-center mt-4">
                            Já tem uma conta? {'  '}
                            <Link href="/">
                                <span className="text-primary cursor-pointer">Acessar conta</span>
                            </Link>
                        </div>
                    </div>
                </div>
            </form>
        </>
    );
}
export default SignUp;


