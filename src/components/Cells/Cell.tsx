import { Container, useTick } from '@inlet/react-pixi';
import { ParticleEmitter } from 'components/ParticleEmitter';
import { particleColors } from 'constants/levelMatrix';
import gsap from 'gsap';
import { isTouchDevice } from 'helper/pointer';
import { Coordinate, setCoordinate } from 'helper/types';
import { FunctionComponent, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useRecoilValue, useRecoilState, useSetRecoilState } from 'recoil';
import { gridLevelAtom, lastLevelUpdateAtom, scoreAtom } from 'root/atoms/levelItemAtoms';
import { gameScaleAtom, centerViewAtom } from 'root/atoms/viewAtoms';
import { CellShape } from './CellShape';

const Z_INDEX_DRAG = 1000;
const Z_INDEX_IDLE = 100;
export const CELL_SIZE = 130;

type Props = {
    position: Coordinate;
    cellId: number;
    id: number;
};
let lastDragPosition = setCoordinate(0, 0);
export const Cell: FunctionComponent<Props> = ({ position, id, cellId }) => {
    //Atoms-------
    const gameScale = useRecoilValue(gameScaleAtom);
    const setScore = useSetRecoilState(scoreAtom);
    const gameCenter = useRecoilValue(centerViewAtom);
    const [gridLevel, setGridLevel] = useRecoilState(gridLevelAtom);
    const [lastLevelUpdate, setLastLevelUpdate] = useRecoilState(lastLevelUpdateAtom);

    //item state-------
    const [isDragging, setIsDragging] = useState(false);
    const [isFloating, setIsFloating] = useState(false);
    const [moveTranslation, setTranslation] = useState<Coordinate>([position[0], position[1]]);
    const [displayPosition, setDisplayPosition] = useState<Coordinate>([position[0], position[1]]);
    const cellRef = useRef();
    const [isActive, setIsActive] = useState(true);

    const updatePosition = useCallback(() => {
        const diffX = displayPosition[0] - moveTranslation[0];
        const diffY = displayPosition[1] - moveTranslation[1];
        if (isDragging) {
            setDisplayPosition(moveTranslation);
        } else if (Math.abs(diffX) > 5 || Math.abs(diffY) > 5) {
            setIsFloating(true);

            setDisplayPosition((currentPosition) => {
                const newX = Math.abs(diffX) > 5 ? currentPosition[0] - diffX * 0.4 : moveTranslation[0];
                const newY = Math.abs(diffY) > 5 ? currentPosition[1] - diffY * 0.4 : moveTranslation[1];
                return setCoordinate(newX, newY);
            });
        } else {
            setIsFloating(false);
            setDisplayPosition(moveTranslation);
        }
    }, [displayPosition, isDragging, moveTranslation]);
    useTick(updatePosition);

    const onMove = useCallback(
        (e) => {
            let touchPosition = setCoordinate(0, 0);
            const [clientX, clientY] = getPointerPosition(e);

            touchPosition = setCoordinate(
                clientX / gameScale - gameCenter[0], //
                clientY / gameScale - gameCenter[1] //
            );
            setTranslation(touchPosition);
            lastDragPosition = touchPosition;
        },
        [gameCenter, gameScale]
    );

    const onDrop = useCallback(() => {
        if (isTouchDevice()) {
            document.removeEventListener('touchmove', onMove);
            document.removeEventListener('touchend', onDrop);
        } else {
            document.removeEventListener('mousemove', onMove);
            document.removeEventListener('mouseup', onDrop);
        }

        const dragCell = gridLevel.find((cell) => cell.id === id);
        if (dragCell) {
            const targetCell = gridLevel.find((cell) => {
                if (cell.id !== id) {
                    const isInRange = isColliding(cell.position, lastDragPosition, CELL_SIZE / 2);
                    return isInRange;
                }
                return false;
            });
            if (targetCell && targetCell.cellId === cellId) {
                const newGridLevel = [...gridLevel].map((cell) => {
                    if (cell.id === id) {
                        return { ...cell, active: false };
                    }

                    return cell;
                });
                const afterInvalidCell = newGridLevel.filter((cell) => {
                    return cell.active;
                });
                setGridLevel(newGridLevel);
                setLastLevelUpdate(performance.now());
                setScore(gridLevel.length - afterInvalidCell.length);
            } else {
                setTranslation(dragCell.position);
            }
        }

        setIsDragging(false);
    }, [gridLevel, onMove, id, cellId, setGridLevel, setLastLevelUpdate, setScore]);

    const startDrag = useCallback(() => {
        if (isTouchDevice()) {
            document.addEventListener('touchmove', onMove);
            document.addEventListener('touchend', onDrop);
        } else {
            document.addEventListener('mousemove', onMove);
            document.addEventListener('mouseup', onDrop);
        }
        setIsDragging(true); //hold only information about active listener
        setIsFloating(true); //hold information about position states
    }, [onDrop, onMove]);

    useEffect(() => {
        if (lastLevelUpdate) {
            const cell = gridLevel.find((cell) => cell.id === id);
            if (!cell?.active) {
                setIsActive(false);
                if (cellRef.current) {
                    gsap.to(cellRef.current, {
                        alpha: 0,
                        duration: 0.3,
                    });
                }
            }
        }
    }, [gridLevel, id, lastLevelUpdate]);

    return (
        <>
            <Container
                position={displayPosition}
                mousedown={startDrag}
                pointerdown={startDrag}
                interactive={isActive}
                zIndex={isFloating ? Z_INDEX_DRAG : Z_INDEX_IDLE}
                ref={cellRef}
            >
                <Container>
                    <CellShape cellId={cellId} id={id} />
                </Container>
            </Container>

            {!isActive && (
                <Container zIndex={Z_INDEX_DRAG + 100} position={displayPosition}>
                    <ParticleEmitter
                        size={30}
                        colors={particleColors[cellId]}
                        count={15}
                        emitterX={CELL_SIZE * 0.3}
                        emitterY={CELL_SIZE * 0.3}
                    />
                </Container>
            )}
        </>
    );
};

function getPointerPosition(
    e: { clientX: number; clientY: number } & { touches: { clientX: number; clientY: number }[] }
) {
    if (e.clientX) {
        return [e.clientX, e.clientY];
    } else if (e.touches.length) {
        return [e.touches[0].clientX, e.touches[0].clientY];
    }
    return [0, 0];
}
function isColliding(position: Coordinate, testPosition: Coordinate, range: number) {
    const diffX = position[0] - testPosition[0];
    const diffY = position[1] - testPosition[1];
    return diffX * diffX + diffY * diffY < range * range; //a2+b2=c2 we don't care about c value only if it is smaller from square of a and b
}
