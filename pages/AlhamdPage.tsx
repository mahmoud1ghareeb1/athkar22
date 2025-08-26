import React from 'react';
import { alhamdDuas } from '../data/alhamd-duas';
import GenericZikrPage from './GenericZikrPage';

interface AlhamdPageProps {
  onClose: () => void;
}

const AlhamdPage: React.FC<AlhamdPageProps> = ({ onClose }) => {
    return <GenericZikrPage onClose={onClose} title="الحمد" athkarList={alhamdDuas} />;
};

export default AlhamdPage;
