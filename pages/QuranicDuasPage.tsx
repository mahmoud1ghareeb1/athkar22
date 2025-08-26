import React from 'react';
import { quranicDuasData } from '../data/quranic-duas';
import GenericZikrPage from './GenericZikrPage';

interface QuranicDuasPageProps {
  onClose: () => void;
}

const QuranicDuasPage: React.FC<QuranicDuasPageProps> = ({ onClose }) => {
    return (
        <GenericZikrPage
            onClose={onClose}
            title="أدعية قرآنية"
            athkarList={quranicDuasData}
        />
    );
};

export default QuranicDuasPage;
