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
} from 'components/Verfication/VerificationContainer'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import Get from 'services/api/Get';
import { Response } from 'services/api/types';

const formatDate = (timestamp: number): string => {
    const date = new Date(timestamp * 1000); // ✅ Convert detik → milidetik
    const options: Intl.DateTimeFormatOptions = {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
    }
    return date.toLocaleString('id-ID', options).replace('.', ':');
}


const Verification = () => {
    const router = useRouter()
    const { email, whatsapp, ts, type } = router.query
    const [dataUser, setDataUser] = useState<{ id?: number, name?: string }>();
    const [typeState, setTypeState] = useState('')
    const [timestamp, setTimestamp] = useState<number | null>(null)

    const getUser = async (search_email?: string, typeVerification?: string, search_whatsapp?: string) => {
        try {
            const res = await Get<Response>('zukses', `auth/profil?email=${search_email}&type=${typeVerification}&whatsapp=${search_whatsapp}`);
            console.log('res', res?.data);
            if (res?.status === 'success') {
                setDataUser(res?.data as { id?: number, name?: string })
                const data = {
                    name: res?.data?.name,
                    email: res?.data?.email,
                    id: res?.data?.id,
                    whatsapp: `${res?.data?.whatsapp}`,
                };
                localStorage.setItem('dataUser', JSON.stringify(data));
            }
        } catch (err: unknown) {
            console.error('Failed to fetch user:', err);
        }
    }
    useEffect(() => {
        if (typeof type === 'string') setTypeState(type)
        if (typeof ts === 'string') setTimestamp(Number(ts))
        if (email || whatsapp || ts || type) {
            const search_email = email;
            const typeVerfication = type;
            const search_whatsapp = whatsapp;
            getUser(search_email as string, typeVerfication as string, search_whatsapp as string)
            router.replace('/verification', undefined, { shallow: true })
        }
    }, [email, whatsapp, ts, router, type])


    const handleApprove = () => {
        if (typeState === 'whatsapp') {
            router.replace(`/verification/whatsapp`);
        } else {
            router.replace(`/verification/email`);
        }
    }

    return (
        <VerificationContainer>
            <ContentVerification>
                <IconVerificationContainer>
                    <IconVerification src='/icon/information.svg' style={{ cursor: "pointer" }} />
                </IconVerificationContainer>
                <Title>
                    Seseorang mencoba mengubah {typeState}-mu.
                </Title>
                {
                    dataUser ? <table>
                        <tbody>
                            <tr>
                                <th style={{ textAlign: 'left' }}>Username</th>
                                <td style={{ textAlign: 'left', paddingLeft: 20 }}>{dataUser?.name}</td>
                            </tr>
                            <tr>
                                <th style={{ textAlign: 'left' }}>Waktu</th>
                                <td style={{ textAlign: 'left', paddingLeft: 20 }}>
                                    {timestamp ? formatDate(timestamp) : '-'}
                                </td>
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
                    </table> : <table>
                        <tbody>
                            <tr>
                                <th style={{ textAlign: 'left' }}>Username</th>
                                <td style={{ textAlign: 'left', paddingLeft: 20 }}></td>
                            </tr>
                            <tr>
                                <th style={{ textAlign: 'left' }}>Waktu</th>
                                <td style={{ textAlign: 'left', paddingLeft: 20 }}>
                                </td>
                            </tr>
                            <tr>
                                <th style={{ textAlign: 'left' }}>Perangkat</th>
                                <td style={{ textAlign: 'left', paddingLeft: 20 }}></td>
                            </tr>
                            <tr>
                                <th style={{ textAlign: 'left' }}>Lokasi</th>
                                <td style={{ textAlign: 'left', paddingLeft: 20 }}></td>
                            </tr>
                        </tbody>
                    </table>
                }
                <Line />
                <WarningContainer>
                    <span>Jangan</span> ijinkan jika kamu:
                    <ListWarning>
                        Menerima panggilan yang menagatas namakan Zukses
                    </ListWarning>
                    <ListWarning>
                        Menawarkan hadian undian
                    </ListWarning>
                </WarningContainer>
                {
                    dataUser &&
                    <>
                        <ButtonContainer>
                            <ButtonApprove onClick={handleApprove}>
                                <IconButton src='/icon/check.svg' />
                                Izinkan Perubahan
                            </ButtonApprove>
                            <ButtonReject>
                                <IconButton src='/icon/reject.svg' />
                                Tolak Perubahan
                            </ButtonReject>
                        </ButtonContainer>
                    </>
                }

            </ContentVerification>
        </VerificationContainer>
    )
}

export default Verification
