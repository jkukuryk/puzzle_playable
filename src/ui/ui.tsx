import { FunctionComponent } from 'react';
import { FailureUI } from './FailureUI';
import { IntroUI } from './IntroUI';
import { SuccessUI } from './SuccessUI';

export const UI: FunctionComponent = () => {
    return (
        <>
            <IntroUI />
            <SuccessUI />
            <FailureUI />
        </>
    );
};
