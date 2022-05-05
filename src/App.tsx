import "./App.css";
import Gun from "gun";
import { useEffect, useState } from "react";

const gun = Gun({
  peers: ["http:localhost:3000/gun"],
});

const chanName = 'dsafffdafdsfafdsfdsaf12413213';
function App() {
  const [txt, setTxt] = useState();

  useEffect(() => {
    const chat = gun.get(chanName).once((node) => {
      console.log(node)
      if(node == undefined) {
        gun.get(chanName).put({text: "Write the text here"})
      } else {
        console.log("Found Node")
        setTxt(node.text)
      }
    })
    //chat.put({ text: "test" });
    chat.on((node) => {
      // Is called whenever text is updated
      console.log("Receiving Update");
      console.log(node);
      setTxt(node.text);
    });
  }, []);

  const updateText = (event: any) => {
    console.log("Updating Text");
    console.log(event.target.value);
    gun.get(chanName).put({ text: event.target.value }); // Edit the value in our db
    setTxt(event.target.value);
  };

  return (
    <div className="App">
      <h1>Collaborative Document With GunJS</h1>
      <textarea value={txt} onChange={updateText} />
    </div>
  );
}

export default App;
