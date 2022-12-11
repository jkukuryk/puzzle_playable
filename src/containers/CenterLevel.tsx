import { Container } from '@inlet/react-pixi';

import { useRecoilValue } from 'recoil';
import { centerViewAtom } from 'root/atoms/viewAtoms';
import { Level } from 'root/Level';

export const CenterLevel = () => {
    const gameCenter = useRecoilValue(centerViewAtom);

    return (
        <Container position={[gameCenter[0], gameCenter[1]]}>
            <Level />
        </Container>
    );
};
