import MapWithDraggableSvgPin from 'components/MapWithDraggableSvgPin'
import { HeaderMaps, InfoMap, ModalMapsContainer } from 'components/Profile/AddressComponent'
import { X } from 'lucide-react'
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
            <HeaderMaps className="bg-#fff] h-[60px]" style={{ justifyContent: "space-between" }}>
                <InfoMap>
                    <div className='text-[#333333] text-[22px] font-bold tracking-[-0.05em]'>Pilih Lokasi</div>
                    {/* <div className='subtitle hidden md:block'>{fullAddressStreet}</div> */}
                </InfoMap>
                <X className='h-[27px] w-[27px] text-[#333333] cursor-pointer' onClick={() => setOpenMaps(false)} />
            </HeaderMaps>
            {/* <div className='p-4'>
                <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 ">
                    <div className="flex">
                        <div className="flex-shrink-0">
                            <InformationCircleIcon className="h-5 w-5 text-yellow-400" />
                        </div>
                        <div className="ml-3">
                            <p className="text-sm text-yellow-700">
                                Tetapkan pin yang tepat. Kami akan mengantarkan ke lokasi peta. Mohon periksa apakah sudah benar, jika belum klik peta untuk menyesuaikan.
                            </p>
                        </div>
                    </div>
                </div>
            </div> */}
            <MapWithDraggableSvgPin lat={lat} long={long} setLat={setLat} setLong={setLong} setOpenMaps={setOpenMaps} fullAddressStreet={fullAddressStreet} />
        </ModalMapsContainer>
    )
}

export default ModalMaps