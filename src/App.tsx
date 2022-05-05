import { useEffect, useRef, useState } from "react";
import Gun from "gun";
import "gun/lib/open";

const gun = Gun({ peers: ["http://localhost:3000/gun"] });

const App = () => {
  const [items, setItems] = useState<Array<Object>>([]);
  const [channelName, setChannelName] = useState<string>("default");
  const inputRef = useRef<any>();

  const handleSubmit = () => {
    const name = inputRef?.current?.value;
    const randomId = `id_${Date.now()}`;
    gun.get(channelName).get(randomId).put({ name, id: randomId });
    inputRef.current.value = "";
  };

  const handleDelete = (id: any) => () => {
    // in Gun you delete by setting the node to null
    gun.get(channelName).get(id).put(null);
  };

  useEffect(() => {
    gun.get(channelName).open((data) => {
      const items = Object.values(data)
        // filter out deleted values which will appear as null
        .filter((item) => !!item);

      // update local state which will be rendered
      setItems(items as any);
    });

    return () => {
      // this is the "unmount" part; we want to stop listening to updates
      // coming on this stream after the component is unmounted
      gun.get(channelName).off();
    };
  }, [channelName]);

  return (
    <div>
      <div>
        <h1>Your Channel Code is:</h1>
        <input />
        <h1>Add A Link</h1>
        <input ref={inputRef} />
        <button onClick={handleSubmit}>Add Link</button>
        <h3>Total Links: {items.length}</h3>
        <ul>
          {items.map((item: any) => (
            <li key={item.id}>
              {item.name} ({item.id})
              <button onClick={handleDelete(item.id)}>X</button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default App;
