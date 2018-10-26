import React from 'react'
import { FiAlertCircle } from 'react-icons/fi'
import Modal from './Modal'
import './ConfirmationModal.css'

export default function ConfirmationModal({ text, buttons }) {
  return (
    <Modal>
      <FiAlertCircle className="confirmationAlert"/>
      <div className="confirmationText">{text}</div>
      <div className="confirmationButtons">
        {buttons}
      </div>
    </Modal>
  )
} 