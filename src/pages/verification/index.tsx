import {
    ButtonApprove,
    ButtonContainer,
    ButtonReject,
    ContentVerification,
    IconButton,
    IconVerification,
    IconVerificationContainer,
    Line,
    ListWarning,
    Title,
    VerificationContainer,
    WarningContainer
} from 'components/Verfication/VerificationContainer';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import Get from 'services/api/Get';
import { Response } from 'services/api/types';

interface UserProfile {
    id?: number;
    name?: string;
    email?: string;
    whatsapp?: string;
}

const formatDate = (timestamp: number): string => {
    const date = new Date(timestamp * 1000); // Convert detik → milidetik
    const options: Intl.DateTimeFormatOptions = {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
    };
    return date.toLocaleString('id-ID', options).replace('.', ':');
};

const Verification: React.FC = () => {
    const router = useRouter();
    const { email, whatsapp, ts, type } = router.query;

    const [dataUser, setDataUser] = useState<UserProfile | null>(null);
    const [typeState, setTypeState] = useState<string>('');
    const [timestamp, setTimestamp] = useState<number | null>(null);

    const getUser = async (search_email?: string, typeVerification?: string, search_whatsapp?: string) => {
        try {
            const res = await Get<Response>('zukses', `auth/profil?email=${search_email}&type=${typeVerification}&whatsapp=${search_whatsapp}`);
            if (res?.status === 'success') {
                const userData = res.data as UserProfile;
                setDataUser(userData);

                const localStorageData = {
                    id: userData.id,
                    name: userData.name,
                    email: userData.email,
                    whatsapp: userData.whatsapp ?? '',
                };
                localStorage.setItem('dataUser', JSON.stringify(localStorageData));
            }
        } catch (err) {
            console.error('Gagal mengambil data user', err);
        }
    };

    useEffect(() => {
        if (typeof type === 'string') setTypeState(type);
        if (typeof ts === 'string') setTimestamp(Number(ts));

        if (email || whatsapp || ts || type) {
            getUser(email as string, type as string, whatsapp as string);
            router.push('/verification', undefined, { shallow: true });
        }
    }, [email, whatsapp, ts, type, router]);

    const handleApprove = () => {
        const path = typeState === 'whatsapp' ? '/verification/whatsapp' : '/verification/email';
        router.push(path);
    };

    const renderTableData = () => (
        <table>
            <tbody>
                <tr>
                    <th style={{ textAlign: 'left' }}>Username</th>
                    <td style={{ textAlign: 'left', paddingLeft: 20 }}>{dataUser?.name || ''}</td>
                </tr>
                <tr>
                    <th style={{ textAlign: 'left' }}>Waktu</th>
                    <td style={{ textAlign: 'left', paddingLeft: 20 }}>{timestamp ? formatDate(timestamp) : ''}</td>
                </tr>
                <tr>
                    <th style={{ textAlign: 'left' }}>Perangkat</th>
                    <td style={{ textAlign: 'left', paddingLeft: 20 }}>Chrome Windows</td>
                </tr>
                <tr>
                    <th style={{ textAlign: 'left' }}>Lokasi</th>
                    <td style={{ textAlign: 'left', paddingLeft: 20 }}>Makassar ID</td>
                </tr>
            </tbody>
        </table>
    );

    return (
        <VerificationContainer>
            <ContentVerification>
                <IconVerificationContainer>
                    <IconVerification src="/icon/information.svg" style={{ cursor: 'pointer' }} />
                </IconVerificationContainer>

                <Title>Seseorang mencoba mengubah {typeState}-mu.</Title>
                {renderTableData()}
                <Line />

                <WarningContainer>
                    <span>Jangan</span> ijinkan jika kamu:
                    <ListWarning>Menerima panggilan yang mengatasnamakan Zukses</ListWarning>
                    <ListWarning>Menawarkan hadiah undian</ListWarning>
                </WarningContainer>

                {dataUser && (
                    <ButtonContainer>
                        <ButtonApprove onClick={handleApprove}>
                            <IconButton src="/icon/check.svg" />
                            Izinkan Perubahan
                        </ButtonApprove>
                        <ButtonReject>
                            <IconButton src="/icon/reject.svg" />
                            Tolak Perubahan
                        </ButtonReject>
                    </ButtonContainer>
                )}
            </ContentVerification>
        </VerificationContainer>
    );
};

export default Verification;
