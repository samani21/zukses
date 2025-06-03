// pages/address.tsx
import React from 'react';
import UserProfile from '.';
import AutocompleteAlamat from '../../components/AutocompleteAlamat';
import AutocompleteStreetAddress from 'components/AutocompleteStreetAddress';

function AddressPage() {
    return (
        <UserProfile mode="address">
            <h2>Alamat Pengguna</h2>
            <AutocompleteAlamat />
            <AutocompleteStreetAddress />
        </UserProfile>
    );
}

export default AddressPage;
