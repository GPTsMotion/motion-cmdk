import { Command } from 'motion-cmdk'

const Page = () => {
  return (
    <div>
      <Command
        className="root"
        filter={(item, query) => {
          console.log('', item)
          if (item === 'c') return 0.2
          if (item.includes(query)) return 1
        }}
      >
        <Command.Input placeholder="Search…" className="input" />
        <Command.List className="list">
          <Command.Empty className="empty">No results.</Command.Empty>
          <Command.Item value="a" className="item">
            A
          </Command.Item>
          <Command.Item value="b" className="item">
            B
          </Command.Item>
          <Command.Item value="c" className="item">
            C
          </Command.Item>
        </Command.List>
      </Command>
    </div>
  )
}

export default Page
