import * as React from 'react'
import { EmptyProps, ListProps, LoadingProps } from '../type'
import { useCommand } from '../hook'
import { Primitive } from '@radix-ui/react-primitive'
import { mergeRefs, SlottableWithNestedChildren, useCmdk } from '../utils'

/**
 * Contains `Item`, `Group`, and `Separator`.
 * Use the `--cmdk-list-height` CSS variable to animate height based on the number of results.
 */
export const List = React.forwardRef<HTMLDivElement, ListProps>((props, forwardedRef) => {
  const { children, label = 'Suggestions', ...etc } = props
  const ref = React.useRef<HTMLDivElement>(null)
  const height = React.useRef<HTMLDivElement>(null)
  const context = useCommand()

  React.useEffect(() => {
    if (height.current && ref.current) {
      const el = height.current
      const wrapper = ref.current
      let animationFrame
      const observer = new ResizeObserver(() => {
        animationFrame = requestAnimationFrame(() => {
          const height = el.offsetHeight
          wrapper.style.setProperty(`--cmdk-list-height`, height.toFixed(1) + 'px')
        })
      })
      observer.observe(el)
      return () => {
        cancelAnimationFrame(animationFrame)
        observer.unobserve(el)
      }
    }
  }, [])

  return (
    <Primitive.div
      ref={mergeRefs([ref, forwardedRef])}
      {...etc}
      cmdk-list=""
      role="listbox"
      aria-label={label}
      id={context.listId}
    >
      {SlottableWithNestedChildren(props, (child) => (
        <div ref={mergeRefs([height, context.listInnerRef])} cmdk-list-sizer="">
          {child}
        </div>
      ))}
    </Primitive.div>
  )
})
/**
 * Automatically renders when there are no results for the search query.
 */
export const Empty = React.forwardRef<HTMLDivElement, EmptyProps>((props, forwardedRef) => {
  const render = useCmdk((state) => state.filtered.count === 0)

  if (!render) return null
  return <Primitive.div ref={forwardedRef} {...props} cmdk-empty="" role="presentation" />
})
/**
 * You should conditionally render this with `progress` while loading asynchronous items.
 */
export const Loading = React.forwardRef<HTMLDivElement, LoadingProps>((props, forwardedRef) => {
  const { progress, children, label = 'Loading...', ...etc } = props

  return (
    <Primitive.div
      ref={forwardedRef}
      {...etc}
      cmdk-loading=""
      role="progressbar"
      aria-valuenow={progress}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label={label}
    >
      {SlottableWithNestedChildren(props, (child) => (
        <div aria-hidden>{child}</div>
      ))}
    </Primitive.div>
  )
})
export { Loading as CommandLoading }
export { Empty as CommandEmpty }
export { List as CommandList }
