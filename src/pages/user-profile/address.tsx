// pages/address.tsx
import React from 'react';
import UserProfile from '.';
import { Action, AddAddressMobile, Address, AddressComponent, AddressContent, AddressTop, ButtonAddAddress, ContentAddress, HeaderAddress, IconAddAddress, InfoUser, ListAddressContainer, SetAddress, StatusAddress, Title, TypographAddress } from 'components/Profile/AddressComponent';

function AddressPage() {
    return (
        <UserProfile mode="address">
            <AddressComponent>
                <HeaderAddress>
                    <Title>Alamat Saya</Title>
                    <ButtonAddAddress>
                        + Tambah Alamat Baru
                    </ButtonAddAddress>
                </HeaderAddress>
                <ContentAddress>
                    <p className='mobile'>Alamat</p>
                    <ListAddressContainer>
                        <Address>
                            <AddressTop>
                                <InfoUser>
                                    <b>Samani</b>
                                    <p>(+62) 812 5413 0919</p>
                                </InfoUser>
                                <Action>
                                    <p>Ubah</p>
                                </Action>
                            </AddressTop>
                            <AddressContent>
                                <TypographAddress>
                                    <p>Jalan Gerilya Peradapan No. 41, RT.39/RW.2, Kelurahan Kelayan Timur, Banjarmasin Selatan</p>
                                    <p>BANJARMASIN SELATAN, KOTA BANJARMASIN, KALIMANTAN SELATAN, ID, 70247</p>
                                </TypographAddress>
                                <SetAddress>
                                    Atur Sebagai Utama
                                </SetAddress>
                            </AddressContent>
                            <StatusAddress>
                                <span className='primary'>
                                    Utama
                                </span>
                            </StatusAddress>
                        </Address>
                        <Address>
                            <AddressTop>
                                <InfoUser>
                                    <b>Samani</b>
                                    <p>(+62) 812 5413 0919</p>
                                </InfoUser>
                                <Action>
                                    <p>Ubah</p>
                                    <p>Hapus</p>
                                </Action>
                            </AddressTop>
                            <AddressContent>
                                <TypographAddress>
                                    <p>Jalan.gerilya peradapan RT39 RW02</p>
                                    <p>BANJARMASIN SELATAN, KOTA BANJARMASIN, KALIMANTAN SELATAN, ID, 70247</p>
                                </TypographAddress>
                                <SetAddress>
                                    Atur Sebagai Utama
                                </SetAddress>
                            </AddressContent>
                            <StatusAddress>
                                <span>
                                    Alamat Toko
                                </span>
                                <span>
                                    Alamat Pengembalian
                                </span>
                            </StatusAddress>
                        </Address>
                        <Address>
                            <AddressTop>
                                <InfoUser>
                                    <b>Samani</b>
                                    <p>(+62) 812 5413 0919</p>
                                </InfoUser>
                                <Action>
                                    <p>Ubah</p>
                                    <p>Hapus</p>
                                </Action>
                            </AddressTop>
                            <AddressContent>
                                <TypographAddress>
                                    <p>Jalan.gerilya peradapan RT39 RW02</p>
                                    <p>BANJARMASIN SELATAN, KOTA BANJARMASIN, KALIMANTAN SELATAN, ID, 70247</p>
                                </TypographAddress>
                                <SetAddress>
                                    Atur Sebagai Utama
                                </SetAddress>
                            </AddressContent>
                            <StatusAddress>

                            </StatusAddress>
                        </Address>
                        <Address>
                            <AddressTop>
                                <InfoUser>
                                    <b>Samani</b>
                                    <p>(+62) 812 5413 0919</p>
                                </InfoUser>
                                <Action>
                                    <p>Ubah</p>
                                    <p>Hapus</p>
                                </Action>
                            </AddressTop>
                            <AddressContent>
                                <TypographAddress>
                                    <p>Jalan.gerilya peradapan RT39 RW02</p>
                                    <p>BANJARMASIN SELATAN, KOTA BANJARMASIN, KALIMANTAN SELATAN, ID, 70247</p>
                                </TypographAddress>
                                <SetAddress>
                                    Atur Sebagai Utama
                                </SetAddress>
                            </AddressContent>
                            <StatusAddress>

                            </StatusAddress>
                        </Address>
                    </ListAddressContainer>
                    <AddAddressMobile>
                        <IconAddAddress src='/icon/add-red.svg' />
                        Tambah Alamat Baru
                    </AddAddressMobile>
                </ContentAddress>
            </AddressComponent>
        </UserProfile>
    );
}

export default AddressPage;
