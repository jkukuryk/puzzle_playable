import { StrictMode } from 'react';
import { RecoilRoot } from 'recoil';
import { UI } from 'ui/ui';
import { CanvasSizeHandler } from 'containers/CanvasSizeHandler';
import { GlobalTicker } from 'containers/GlobalTicker';
import { CenterLevel } from 'containers/CenterLevel';
import { StageContainer } from 'containers/StageContainer';
import { Subscriber } from 'containers/Subscriber';
import { gameSize } from 'constants/resolution';

export const App = () => {
    return (
        <StrictMode>
            <div className="game_container">
                <StageContainer>
                    <RecoilRoot>
                        <CanvasSizeHandler size={'contain'} gameSize={gameSize} />
                        <Subscriber />
                        <GlobalTicker />
                        <CenterLevel />
                        <UI />
                    </RecoilRoot>
                </StageContainer>
            </div>
        </StrictMode>
    );
};
