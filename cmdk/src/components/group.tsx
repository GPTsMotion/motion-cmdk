import * as React from 'react'
import { GroupProps } from '../type'
import { useId } from '@radix-ui/react-id'
import { GroupContext, useCommand } from '../hook'
import { mergeRefs, SlottableWithNestedChildren, useCmdk, useLayoutEffect, useValue } from '../utils'
import { Primitive } from '@radix-ui/react-primitive'

/**
 * Group command menu items together with a heading.
 * Grouped items are always shown together.
 */
export const Group = React.forwardRef<HTMLDivElement, GroupProps>((props, forwardedRef) => {
  const { heading, children, forceMount, ...etc } = props
  const id = useId()
  const ref = React.useRef<HTMLDivElement>(null)
  const headingRef = React.useRef<HTMLDivElement>(null)
  const headingId = useId()
  const context = useCommand()
  const render = useCmdk((state) =>
    forceMount ? true : context.filter() === false ? true : !state.search ? true : state.filtered.groups.has(id),
  )

  useLayoutEffect(() => {
    return context.group(id)
  }, [])

  useValue(id, ref, [props.value, props.heading, headingRef])

  const contextValue = React.useMemo(() => ({ id, forceMount }), [forceMount])

  return (
    <Primitive.div
      ref={mergeRefs([ref, forwardedRef])}
      {...etc}
      cmdk-group=""
      role="presentation"
      hidden={render ? undefined : true}
    >
      {heading && (
        <div ref={headingRef} cmdk-group-heading="" aria-hidden id={headingId}>
          {heading}
        </div>
      )}
      {SlottableWithNestedChildren(props, (child) => (
        <div cmdk-group-items="" role="group" aria-labelledby={heading ? headingId : undefined}>
          <GroupContext.Provider value={contextValue}>{child}</GroupContext.Provider>
        </div>
      ))}
    </Primitive.div>
  )
})
export { Group as CommandGroup }
