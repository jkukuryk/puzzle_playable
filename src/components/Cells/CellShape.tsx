import { ScaleSprite } from 'components/ScaleSprite';
import { FunctionComponent, useMemo } from 'react';
import { CELL_SIZE } from './Cell';
import cellContainerImage from 'assets/cell/cellContainer.svg';
import starSVG from 'assets/cell/star.svg';
import circleSVG from 'assets/cell/circle.svg';
import rhombusSVG from 'assets/cell/rhombus.svg';
import heartSVG from 'assets/cell/heart.svg';
import triangleSVG from 'assets/cell/triangle.svg';
import diamondSVG from 'assets/cell/diamond.svg';
import { CellTypes, shapesList } from 'constants/levelMatrix';

type Props = {
    cellId: number;
    id: number;
};
export const CellShape: FunctionComponent<Props> = ({ cellId }) => {
    const cellShape = useMemo(() => {
        switch (shapesList[cellId]) {
            case CellTypes.CIRCLE:
                return circleSVG;
            case CellTypes.DIAMOND:
                return diamondSVG;
            case CellTypes.HEART:
                return heartSVG;
            case CellTypes.RHOMBUS:
                return rhombusSVG;
            case CellTypes.START:
                return starSVG;
            case CellTypes.TRIANGLE:
                return triangleSVG;
        }
    }, [cellId]);
    return (
        <>
            <ScaleSprite width={CELL_SIZE} height={CELL_SIZE} anchor={0.5} image={cellContainerImage} />
            <ScaleSprite width={CELL_SIZE} height={CELL_SIZE} anchor={0.5} image={cellShape} />
        </>
    );
};
