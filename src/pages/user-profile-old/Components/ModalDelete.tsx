import { ButtonContainer, ButtonHold, ButtonOk, DeleteComponentComponent } from 'components/Profile/ModalDelete';
import React from 'react'

type Props = {
    handleDelete: (id?: number) => Promise<void>;
    setOpenDelete: (velue: number) => void;
    id?: number
}

const ModalDelete = ({ handleDelete, id, setOpenDelete }: Props) => {
    return (
        <DeleteComponentComponent>
            Hapus Alamat?
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

export default ModalDelete