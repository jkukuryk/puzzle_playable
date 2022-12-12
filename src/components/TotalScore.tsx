import { FunctionComponent, useMemo } from 'react';
import { Container } from '@inlet/react-pixi';
import { Coordinate } from 'helper/types';
import totalSVG from 'assets/ui/totalScore.svg';
import { SVGSprite } from './SvgSprite';
import { CELL_SIZE } from './Cells/Cell';
import { useRecoilValue } from 'recoil';
import { scoreAtom } from 'root/atoms/levelItemAtoms';
import number0SVG from 'assets/ui/numbers/0.svg';
import number1SVG from 'assets/ui/numbers/1.svg';
import number2SVG from 'assets/ui/numbers/2.svg';
import number3SVG from 'assets/ui/numbers/3.svg';
import number4SVG from 'assets/ui/numbers/4.svg';
import number5SVG from 'assets/ui/numbers/5.svg';
import number6SVG from 'assets/ui/numbers/6.svg';
import number7SVG from 'assets/ui/numbers/7.svg';
import number8SVG from 'assets/ui/numbers/8.svg';
import number9SVG from 'assets/ui/numbers/9.svg';
import { ParticleEmitter } from './ParticleEmitter';

const svgWidth = 391;
const svgHeight = 57;
const svgNumberWidth = 37;
const svgNumberHeight = 35;

export const TotalScore: FunctionComponent<{ position: Coordinate }> = ({ position }) => {
    const cellMerged = useRecoilValue(scoreAtom);
    const countNumberSVG = useMemo(() => {
        switch (cellMerged) {
            case 1:
                return number1SVG;
            case 2:
                return number2SVG;
            case 3:
                return number3SVG;
            case 4:
                return number4SVG;
            case 5:
                return number5SVG;
            case 6:
                return number6SVG;
            case 7:
                return number7SVG;
            case 8:
                return number8SVG;
            case 9:
                return number9SVG;
            default:
                return number0SVG;
        }
    }, [cellMerged]);

    return (
        <Container
            position={[position[0] - CELL_SIZE / 2 + svgWidth / 2, position[1] - CELL_SIZE / 2 - 50]}
            zIndex={9999}
        >
            <SVGSprite width={svgWidth} height={svgHeight} src={totalSVG} />
            <Container position={[163, 0]}>
                {cellMerged < 10 ? (
                    <SVGSprite width={svgNumberWidth} height={svgNumberHeight} src={countNumberSVG} />
                ) : (
                    <Container scale={0.7}>
                        <SVGSprite width={svgNumberWidth} height={svgNumberHeight} src={number1SVG} x={-16} />
                        <SVGSprite width={svgNumberWidth} height={svgNumberHeight} src={number0SVG} x={16} />
                    </Container>
                )}
                <ParticleEmitter
                    colors={['#1ea7e1', '#ffffff']}
                    size={svgNumberWidth}
                    count={3}
                    emitterX={1}
                    emitterY={1}
                    key={cellMerged}
                />
            </Container>
        </Container>
    );
};
