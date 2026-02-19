'use client';
import Link from 'next/link';
import LoadingScreen from './loading';
import '../app/styles/styledGlobal.css';
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import { useRouter } from 'next/navigation';
import { classNames } from 'primereact/utils';
import { Messages } from 'primereact/messages';
import IconVisible from './shared/IconVisible';
import Input from './shared/include/input/input-all';
import React, { useState, useRef, useEffect } from 'react';
import { UsuarioContaEntity } from './entity/UsuarioContaEntity';
import PrivateRoute from '@/app/routes/protected/protectedRoute';
import '../app/(full-page)/auth/signIn/controller/styleSignIn.css';
import useEnterKeyNavigation from '@/app/utils/useEnterKeyNavigation';
import { validateFormSignIn } from '@/app/(full-page)/auth/signIn/validate';
import { authLogin } from '@/app/(full-page)/auth/signIn/controller/controller';

const SignIn: React.FC = () => {
    const router = useRouter();
    const msgs = useRef<Messages>(null);
    const [loading, setLoading] = useState(false);
    const [isLoggingIn, setIsLoggingIn] = useState(false);
    const [visible, setVisible] = useState<boolean>(false);
    const [userConta, setUserConta] = useState<UsuarioContaEntity>(
        new UsuarioContaEntity({
            foto_perfil: '',
            nome: '',
            email: '',
            senha: ''
        })
    );
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);
    const [errors, setErrors] = useState<{ [key: string]: string }>({});
    const [emailRecuperacao, setEmailRecuperacao] = useState<string>('');
    const [touchedFields, setTouchedFields] = useState<{ [key: string]: boolean }>({});
    const handleAllChanges = (event: { target: { id: string; value: any; checked?: any; type: string } }) => {
        const _userConta = userConta!.copyWith({
            [event.target.id]: event.target.type === 'checkbox' || event.target.type === 'switch' ? event.target.checked : event.target.value
        });
        setUserConta(_userConta);
    };
    const login = async () => {
        if (!validateFormSignIn(userConta, setErrors, msgs)) return;
        try {
            setLoading(true);
            const success = await authLogin(userConta, msgs, router);

            if (success) {
                setIsLoggingIn(true);
                router.push('/dashboard');
            }
        } catch (error) {
            console.error(error);
            msgs.current?.show([{ severity: 'error', summary: 'Erro', detail: 'Ocorreu um erro ao tentar logar.' }]);
        } finally {
            setLoading(false);
        }
    };

    const togglePasswordVisibility = () => {
        setIsPasswordVisible(!isPasswordVisible);
    };
    useEnterKeyNavigation(login);
    useEffect(() => {
        if (Object.values(touchedFields).some((touched) => touched)) {
            validateFormSignIn(userConta, setErrors, msgs);
        }
    }, [userConta]);
    if (isLoggingIn) {
        return <LoadingScreen loadingText={'Carregando Credenciais para acesso...'} />;
    }
    return (
        <PrivateRoute redirectIfAuthenticated={true}>
            <div className="styled-containerSignUp-SignIn ">
                <Messages ref={msgs} className="custom-messages" />
                <div className="card styled-container-login-register">
                    <img style={{ height: '10rem' }} alt="dropdown icon" src="/layout/images/logoDropNotas.svg" />
                    <p className="text-color-secondary mb-4">Informe email e senha nos campos</p>
                    <div className="col-12 lg:col-12 ">
                        <Input
                            id="email"
                            value={userConta.email || ''}
                            onChange={handleAllChanges}
                            label="Digite o E-mail"
                            icon="pi pi-at"
                            type="email"
                            iconLeft="pi pi-at"
                            outlined={true}
                            onBlur={() => {
                                setTouchedFields((prev) => ({ ...prev, email: true }));
                                validateFormSignIn(userConta, setErrors, msgs);
                            }}
                            autoFocus={true}
                            hasError={!!errors.email}
                            errorMessage={errors.email}
                            topLabel="E-mail:"
                            showTopLabel
                            required
                        />
                    </div>
                    <div className="col-12 lg:col-12 mt-1">
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
                            className={errors.senha ? 'p-invalid' : ''}
                            hasError={!!errors.senha}
                            errorMessage={errors.senha}
                            topLabel="Senha:"
                            showTopLabel
                            required
                        />
                    </div>
                    <div className="col-12 mb-1 lg:col-4 lg:mb-0 w-full mt-customMargin-Top1">
                        <Button
                            label={loading ? 'ENTRANDO...' : 'Entrar'}
                            icon={loading ? 'pi pi-spin pi-spinner' : undefined}
                            className="mb-4 w-full"
                            onClick={login}
                            loading={loading}
                            disabled={loading || Object.keys(errors).length > 0 || !userConta.email || !userConta.senha}
                        />
                    </div>
                    <div className="text-center mt-4">
                        Não tem uma conta? {'  '}
                        <Link href="/auth/signUp">
                            <span className="text-primary cursor-pointer">Criar Conta</span>
                        </Link>
                        <div className="mt-customMargin-Top1">
                            <Link
                                href="#"
                                onClick={(e) => {
                                    e.preventDefault();
                                    setVisible(true);
                                }}
                            >
                                <span className="cursor-pointer" style={{ color: '#4169E1' }}>
                                    Recuperar senha{' '}
                                </span>
                            </Link>
                            <Dialog header="Recuperação de senha" draggable={false} visible={visible} className="containerRecuperarSenha" onHide={() => setVisible(false)}>
                                <p className="m-0">
                                    <span className="input-container input-icon-left mb-4">
                                        <Input
                                            label="Email de recuperação"
                                            className={classNames('w-full')}
                                            value={emailRecuperacao}
                                            onChange={(e) => setEmailRecuperacao(e.target.value)}
                                            icon="pi pi-at"
                                            type="email"
                                            iconLeft="pi pi-at"
                                            outlined={true}
                                        />
                                    </span>
                                    <div className="center-contentStyleBtnRecuperar">
                                        <Button label="Recuperar Senha" className="mb-4" />
                                    </div>
                                </p>
                            </Dialog>
                        </div>
                    </div>
                    <span>Versão: 0.0.212</span>
                </div>
            </div>
        </PrivateRoute>
    );
};
export default SignIn;
