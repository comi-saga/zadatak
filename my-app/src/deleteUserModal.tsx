import React from 'react';
import Modal from 'react-modal';

const customStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)'
  }
};

Modal.setAppElement('#root');

type Props = {
    isOpen: boolean,
    onRequestClose: () => void,
    onDelete: () => void
}

function DeleteUserModal(props: Props) {
  const { isOpen, onRequestClose, onDelete } = props;

  function handleDelete() {
    onDelete();
    onRequestClose();
  }

  return (
    <Modal isOpen={isOpen} onRequestClose={onRequestClose} style={customStyles}>
      <h2>Obrisi korisnika</h2>
      <p>Da li ste sigurni da zelite da obrisete korisnika?</p>
      <button className='btn btn-success' onClick={onRequestClose}>Otkazi</button> &nbsp;
      <button className='btn btn-danger' onClick={handleDelete}>Obrisi</button>
      <button style={{position: "absolute",top: "0px", right: "0px"}} onClick={onRequestClose}>
        X
      </button>
    </Modal>
  );
}

export default DeleteUserModal;
