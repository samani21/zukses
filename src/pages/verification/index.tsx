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
    const [emailState, setEmailState] = useState('')
    const [waState, setWaState] = useState('')
    const [typeState, setTypeState] = useState('')
    const [timestamp, setTimestamp] = useState<number | null>(null)

    const getUser = async (search?: string) => {
        const res = await Get<Response>('zukses', `auth/me?email=${search}`);
        console.log('res', res?.data);
        if (res?.status === 'success') {
            setDataUser(res?.data as { id?: number, name?: string })
        }
    }
    useEffect(() => {
        if (typeof email === 'string') setEmailState(email)
        if (typeof type === 'string') setTypeState(type)
        if (typeof whatsapp === 'string') setWaState(whatsapp)
        if (typeof ts === 'string') setTimestamp(Number(ts))
        if (email || whatsapp || ts || type) {
            const search = email || whatsapp;
            getUser(search as string)
            router.replace('/verification', undefined, { shallow: true })
        }
    }, [email, whatsapp, ts, router, type])


    const handleApprove = () => {
        if (typeState === 'whatsapp') {
            router.replace(`/verification/whatsapp?search_whatsapp=${waState}&id=${dataUser?.id}&name=${dataUser?.name}`);
        } else {
            router.replace(`/verification/email?search_email=${emailState}&id=${dataUser?.id}&name=${dataUser?.name}`);
        }
    }

    return (
        <VerificationContainer>
            <ContentVerification>
                <IconVerificationContainer>
                    <IconVerification src='/icon/information.svg' />
                </IconVerificationContainer>
                <Title>
                    Seseorang mencoba mengubah {typeState}-mu.
                </Title>
                <table>
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
                </table>
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
            </ContentVerification>
        </VerificationContainer>
    )
}

export default Verification
