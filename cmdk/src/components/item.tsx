import * as React from 'react';
import {ItemProps} from '../type';
import {useId} from '@radix-ui/react-id';
import {GroupContext, useCommand, useStore} from '../hook';
import {mergeRefs, useAsRef, useCmdk, useLayoutEffect, useValue} from '../utils';
import {SELECT_EVENT} from '../constant';
import {Primitive} from '@radix-ui/react-primitive';

/**
 * Command menu item. Becomes active on pointer enter or through keyboard navigation.
 * Preferably pass a `value`, otherwise the value will be inferred from `children` or
 * the rendered item's `textContent`.
 */
export const Item = React.forwardRef<HTMLDivElement, ItemProps>((props, forwardedRef) => {
    const id = useId();
    const ref = React.useRef<HTMLDivElement>(null);
    const groupContext = React.useContext(GroupContext);
    const context = useCommand();
    const propsRef = useAsRef(props);
    const forceMount = propsRef.current?.forceMount ?? groupContext?.forceMount;

    useLayoutEffect(() => {
        if (!forceMount) {
            return context.item(id, groupContext?.id);
        }
    }, [forceMount]);

    const value = useValue(id, ref, [props.value, props.children, ref], props.keywords);

    const store = useStore();
    const selected = useCmdk((state) => state.value && state.value === value.current);
    const render = useCmdk((state) =>
        forceMount ? true : context.filter() === false ? true : !state.search ? true : state.filtered.items.get(id) > 0,
    );

    React.useEffect(() => {
        const element = ref.current;
        if (!element || props.disabled) return;
        element.addEventListener(SELECT_EVENT, onSelect);
        return () => element.removeEventListener(SELECT_EVENT, onSelect);
    }, [render, props.onSelect, props.disabled]);

    function onSelect() {
        select();
        propsRef.current.onSelect?.(value.current);
    }

    function select() {
        store.setState('value', value.current, true);
    }

    if (!render) return null;

    const { disabled, value: _, onSelect: __, forceMount: ___, keywords: ____, ...etc } = props;

    return (
        <Primitive.div
            ref={ mergeRefs([ref, forwardedRef]) }
            { ...etc }
            id={ id }
            cmdk-item=""
            role="option"
            aria-disabled={ Boolean(disabled) }
            aria-selected={ Boolean(selected) }
            data-disabled={ Boolean(disabled) }
            data-selected={ Boolean(selected) }
            onPointerMove={ disabled || context.disablePointerSelection ? undefined : select }
            onClick={ disabled ? undefined : onSelect }
        >
            { props.children }
        </Primitive.div>
    );
});
export {Item as CommandItem};
