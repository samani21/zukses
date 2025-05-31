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
    const { email, whatsapp, ts } = router.query

    const [emailState, setEmailState] = useState('')
    const [waState, setWaState] = useState('')
    const [timestamp, setTimestamp] = useState<number | null>(null)

    useEffect(() => {
        if (typeof email === 'string') setEmailState(email)
        if (typeof whatsapp === 'string') setWaState(whatsapp)
        if (typeof ts === 'string') setTimestamp(Number(ts))

        if (email || whatsapp || ts) {
            router.replace('/verification', undefined, { shallow: true })
        }
    }, [email, whatsapp, ts, router])

    return (
        <VerificationContainer>
            <ContentVerification>
                <IconVerificationContainer>
                    <IconVerification src='/icon/information.svg' />
                </IconVerificationContainer>
                <Title>
                    Seseorang mencoba mengubah email-mu.
                </Title>
                <table>
                    <tbody>
                        <tr>
                            <th style={{ textAlign: 'left' }}>Username</th>
                            <td style={{ textAlign: 'left', paddingLeft: 20 }}>Username</td>
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
                    <ButtonApprove>
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
