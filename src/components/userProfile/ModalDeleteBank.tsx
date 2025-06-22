import { ButtonContainer, ButtonHold, ButtonOk, DeleteComponentComponent } from 'components/Profile/ModalDelete';
import React, { useEffect } from 'react'

type Props = {
    handleDelete: (id?: number) => Promise<void>;
    setOpenDelete: (velue: number) => void;
    id?: number
}

const ModalDeleteBank = ({ handleDelete, id, setOpenDelete }: Props) => {

    return (
        <DeleteComponentComponent>
            Hapus Akun bank?
            <ButtonContainer>
                <ButtonHold onClick={() => setOpenDelete(0)}>
                    NANTI SAJA
                </ButtonHold>
                <ButtonOk onClick={() => handleDelete(id)}>
                    HAPUS
                </ButtonOk>
            </ButtonContainer>
        </DeleteComponentComponent>
    )
}

export default ModalDeleteBank