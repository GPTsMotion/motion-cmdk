/**
 *
 *
 * Helpers
 *
 *
 */
import { State } from './type'
import * as React from 'react'
import { VALUE_ATTR } from './constant'
import { useCommand, useStore } from './hook'

export function findNextSibling(el: Element, selector: string) {
  let sibling = el.nextElementSibling

  while (sibling) {
    if (sibling.matches(selector)) return sibling
    sibling = sibling.nextElementSibling
  }
}

export function findPreviousSibling(el: Element, selector: string) {
  let sibling = el.previousElementSibling

  while (sibling) {
    if (sibling.matches(selector)) return sibling
    sibling = sibling.previousElementSibling
  }
}

export function useAsRef<T>(data: T) {
  const ref = React.useRef<T>(data)

  useLayoutEffect(() => {
    ref.current = data
  })

  return ref
}

export const useLayoutEffect = typeof window === 'undefined' ? React.useEffect : React.useLayoutEffect

export function useLazyRef<T>(fn: () => T) {
  const ref = React.useRef<T>()

  if (ref.current === undefined) {
    ref.current = fn()
  }

  return ref as React.MutableRefObject<T>
}

// ESM is still a nightmare with Next.js so I'm just gonna copy the package code in
// https://github.com/gregberge/react-merge-refs
// Copyright (c) 2020 Greg Bergé
export function mergeRefs<T = any>(refs: Array<React.MutableRefObject<T> | React.LegacyRef<T>>): React.RefCallback<T> {
  return (value) => {
    refs.forEach((ref) => {
      if (typeof ref === 'function') {
        ref(value)
      } else if (ref != null) {
        ;(ref as React.MutableRefObject<T | null>).current = value
      }
    })
  }
}

/** Run a selector against the store state. */
export function useCmdk<T = any>(selector: (state: State) => T) {
  const store = useStore()
  const cb = () => selector(store.snapshot())
  return React.useSyncExternalStore(store.subscribe, cb, cb)
}

export function useValue(
  id: string,
  ref: React.RefObject<HTMLElement>,
  deps: (string | React.ReactNode | React.RefObject<HTMLElement>)[],
  aliases: string[] = [],
) {
  const valueRef = React.useRef<string>()
  const context = useCommand()

  useLayoutEffect(() => {
    const value = (() => {
      for (const part of deps) {
        if (typeof part === 'string') {
          return part.trim()
        }

        if (typeof part === 'object' && 'current' in part) {
          if (part.current) {
            return part.current.textContent?.trim()
          }
          return valueRef.current
        }
      }
    })()

    const keywords = aliases.map((alias) => alias.trim())

    context.value(id, value, keywords)
    ref.current?.setAttribute(VALUE_ATTR, value)
    valueRef.current = value
  })

  return valueRef
}

/** Imperatively run a function on the next layout effect cycle. */
export const useScheduleLayoutEffect = () => {
  const [s, ss] = React.useState<object>()
  const fns = useLazyRef(() => new Map<string | number, () => void>())

  useLayoutEffect(() => {
    fns.current.forEach((f) => f())
    fns.current = new Map()
  }, [s])

  return (id: string | number, cb: () => void) => {
    fns.current.set(id, cb)
    ss({})
  }
}

function renderChildren(children: React.ReactElement) {
  const childrenType = children.type as any
  // The children is a component
  if (typeof childrenType === 'function') return childrenType(children.props)
  // The children is a component with `forwardRef`
  else if ('render' in childrenType) return childrenType.render(children.props)
  // It's a string, boolean, etc.
  else return children
}

export function SlottableWithNestedChildren(
  { asChild, children }: { asChild?: boolean; children?: React.ReactNode },
  render: (child: React.ReactNode) => JSX.Element,
) {
  if (asChild && React.isValidElement(children)) {
    return React.cloneElement(renderChildren(children), { ref: (children as any).ref }, render(children.props.children))
  }
  return render(children)
}

export const srOnlyStyles = {
  position: 'absolute',
  width: '1px',
  height: '1px',
  padding: '0',
  margin: '-1px',
  overflow: 'hidden',
  clip: 'rect(0, 0, 0, 0)',
  whiteSpace: 'nowrap',
  borderWidth: '0',
} as const
export { useCmdk as useCommandState }

const getId = (() => {
  let i = 0
  return () => `${i++}`
})()
export const useIdCompatibility = () => {
  React.useState(getId)
  const [id] = React.useState(getId)
  return 'cmdk' + id
}
