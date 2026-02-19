'use client';
import BackButton from '@/app/components/buttonsComponent/backButton/btn-back';
import LoadingScreen from '@/app/loading';
import { useRouter } from 'next/navigation'; 
import { Button } from 'primereact/button';
import React, { useState } from 'react';

function NotFound() {
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter(); 
    const navigateToDashboard = () => {
        setIsLoading(true); 
        setTimeout(() => {
            router.push('/dashboard'); 
        }, 500); 
    };
    return (
        <React.Fragment>
            {isLoading ? (
                <LoadingScreen loadingText={'Carregando...'} />
            ) : (
                <div className="surface-ground h-screen w-screen flex align-items-center justify-content-center">
                    <div className="surface-card py-7 px-5 sm:px-7 shadow-2 flex flex-column w-11 sm:w-30rem" style={{ borderRadius: '1rem' }}>
                        <h1 style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize:"2rem" }}>Página não encontrada</h1>
                        <ul className="list-none p-0 m-0">
                            <li>
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <img alt="dropdown icon" src="/layout/images/erro-404.svg" />
                                </div>
                            </li>
                        </ul>
                        <h1 style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize:"1rem" }}>Utilize os botões abaixo para navegar:</h1>
                        <div style={{ display: 'flex', flexDirection: 'row', marginTop: '1rem', justifyContent: 'space-between' }}>
                            <BackButton />
                            <Button onClick={navigateToDashboard} label="Dashboard"></Button>
                        </div>
                    </div>
                </div>
            )}
        </React.Fragment>
    );
}

export default NotFound;
