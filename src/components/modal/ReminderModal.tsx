import { Button, Modal } from 'antd';
import Image from 'next/image';
import React from 'react';

interface ReminderModalProps {
  open: boolean;
  onOk: () => void;
  onCancel: () => void;
}

const ReminderModal: React.FC<ReminderModalProps> = ({ open, onOk, onCancel }) => {
    return (
        <Modal
            className='reminder-modal'
            okText="Send"
            closable={false}
            width="328px"
            open={open}
            onOk={onOk}
            onCancel={onCancel}
            footer={(_, { OkBtn, CancelBtn }) => (
                <div className='d-flex gap-2 justify-content-center'>
                    <button className='secondary-btn' onClick={onCancel}>Cancel</button>
                    <button className='primary-btn' onClick={onOk}>Send</button>
                </div>
            )}
        >
            <div className='d-flex flex-column align-items-center justify-content-center  mb-4'>
                <Image className='mb-3' src="/icons/reminder-bell.svg" width={40} height={40} alt="Reminder Bell" />
                <h2 className='mb-2 fs-4'>Reminder</h2>
                <p className='text-muted fs-6 mb-0 fw-medium'>Send Reminder to concerned person</p>
            </div>
        </Modal>
    );
};

export default ReminderModal;