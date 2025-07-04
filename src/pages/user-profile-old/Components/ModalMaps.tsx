import MapWithDraggableSvgPin from 'components/MapWithDraggableSvgPin'
import { HeaderMaps, IconAddAddress, InfoMap, ModalMapsContainer } from 'components/Profile/AddressComponent'
import React from 'react'

type Props = {
    fullAddressStreet?: string
    lat?: number
    long?: number
    setLat: (velue: number) => void
    setLong: (velue: number) => void
    setOpenMaps: (velue: boolean) => void
}

const ModalMaps = ({ fullAddressStreet, lat, long, setLat, setLong, setOpenMaps }: Props) => {
    return (
        <ModalMapsContainer>
            <HeaderMaps>
                <IconAddAddress src='/icon-old/arrow-left-gray.svg' onClick={() => setOpenMaps(false)} />
                <InfoMap>
                    <div className='title'>Ubah Lokasi</div>
                    <div className='subtitle hidden md:block'>{fullAddressStreet}</div>
                </InfoMap>
            </HeaderMaps>
            <MapWithDraggableSvgPin lat={lat} long={long} setLat={setLat} setLong={setLong} setOpenMaps={setOpenMaps} fullAddressStreet={fullAddressStreet} />
        </ModalMapsContainer>
    )
}

export default ModalMaps