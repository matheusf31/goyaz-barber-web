import React, { SetStateAction } from 'react';

import { Container, Avatar } from './styles';

import { IBarbeiros } from '../../../../pages/dashboard';

interface IBarbeiro {
  id: string;
  name: string;
  avatar_url: string;
}

interface BarbeirosProps {
  barbeiros: IBarbeiros;
  selectedBarbeiro: IBarbeiro;
  setSelectedBarbeiro: React.Dispatch<SetStateAction<any>>;
}

const Barbeiros: React.FC<BarbeirosProps> = ({
  barbeiros,
  selectedBarbeiro,
  setSelectedBarbeiro,
}) => {
  return (
    <Container>
      {barbeiros?.map((barbeiro) => (
        <button type="button" onClick={() => setSelectedBarbeiro(barbeiro)} key={barbeiro.id}>
          <Avatar
            src={barbeiro.avatar_url}
            alt="avatar"
            active={selectedBarbeiro?.id === barbeiro.id}
          />
        </button>
      ))}
    </Container>
  );
};

export default Barbeiros;
