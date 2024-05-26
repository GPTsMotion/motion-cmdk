import * as React from 'react';
import {DialogProps} from '../type';
import * as RadixDialog from '@radix-ui/react-dialog';
import {Command} from './command';

/**
 * Renders the command menu in a Radix Dialog.
 */
export const Dialog = React.forwardRef<HTMLDivElement, DialogProps>((props, forwardedRef) => {
    const { open, onOpenChange, overlayClassName, contentClassName, container, ...etc } = props;
    return (
        <RadixDialog.Root open={ open } onOpenChange={ onOpenChange }>
            <RadixDialog.Portal container={ container }>
                <RadixDialog.Overlay cmdk-overlay="" className={ overlayClassName }/>
                <RadixDialog.Content aria-label={ props.label } cmdk-dialog="" className={ contentClassName }>
                    <Command ref={ forwardedRef } { ...etc } />
                </RadixDialog.Content>
            </RadixDialog.Portal>
        </RadixDialog.Root>
    );
});
export {Dialog as CommandDialog};
