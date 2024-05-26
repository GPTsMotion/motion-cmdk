import * as React from 'react';
import {InputProps} from '../type';
import {useCommand, useStore} from '../hook';
import {useCmdk} from '../utils';
import {ITEM_SELECTOR, VALUE_ATTR} from '../constant';
import {Primitive} from '@radix-ui/react-primitive';

/**
 * Command menu input.
 * All props are forwarded to the underyling `input` element.
 */
export const Input = React.forwardRef<HTMLInputElement, InputProps>((props, forwardedRef) => {
    const { onValueChange, ...etc } = props;
    const isControlled = props.value != null;
    const store = useStore();
    const search = useCmdk((state) => state.search);
    const value = useCmdk((state) => state.value);
    const context = useCommand();

    const selectedItemId = React.useMemo(() => {
        const item = context.listInnerRef.current?.querySelector(
            `${ ITEM_SELECTOR }[${ VALUE_ATTR }="${ encodeURIComponent(value) }"]`,
        );
        return item?.getAttribute('id');
    }, []);

    React.useEffect(() => {
        if (props.value != null) {
            store.setState('search', props.value);
        }
    }, [props.value]);

    return (
        <Primitive.input
            ref={ forwardedRef }
            { ...etc }
            cmdk-input=""
            autoComplete="off"
            autoCorrect="off"
            spellCheck={ false }
            aria-autocomplete="list"
            role="combobox"
            aria-expanded={ true }
            aria-controls={ context.listId }
            aria-labelledby={ context.labelId }
            aria-activedescendant={ selectedItemId }
            id={ context.inputId }
            type="text"
            value={ isControlled ? props.value : search }
            onChange={ (e) => {
                if (!isControlled) {
                    store.setState('search', e.target.value);
                }

                onValueChange?.(e.target.value);
            } }
        />
    );
});
export {Input as CommandInput};
