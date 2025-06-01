import {
  ButtonAgree,
  ButtonCancel,
  ButtonModalContainer,
  ContentModal,
  ModalContainer,
  TitleModal,
} from 'components/Auth';
import React from 'react';

type Props = {
  setModalAgreement: (value: boolean) => void;
  handleRegister: () => Promise<void>;
};

const ModalAgreement = ({ setModalAgreement, handleRegister }: Props) => {


  return (
    <ModalContainer>
      <TitleModal>
        Simak Ketentuan Akun Zukses
      </TitleModal>
      <ContentModal>
        Dengan mendaftar & menggunakan Zukses, saya mengakui telah membaca dan menyetujui{' '}
        <span>Syarat, Ketentuan dan Kebijakan dari Zukses</span> &{' '}
        <span>Kebijakan Privasi</span> Zukses.
      </ContentModal>
      <ButtonModalContainer>
        <ButtonCancel onClick={() => setModalAgreement(false)}>
          Batal
        </ButtonCancel>
        <ButtonAgree onClick={handleRegister}>
          Setuju
        </ButtonAgree>
      </ButtonModalContainer>
    </ModalContainer>
  );
};

export default ModalAgreement;
