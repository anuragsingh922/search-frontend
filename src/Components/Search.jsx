import React, { useState } from "react";
import "./Search.css";
import SendIcon from "@mui/icons-material/Send";

function Search() {
  const [usermsg, setusermsg] = useState("");
  const [chats, setChats] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const [link, setlink] = useState([]);
  let linkkk = [];

  const handleonchange = (e) => {
    e.preventDefault();
    setusermsg(e.target.value);
  };

  //   const scroltobuttom = () => {
  //     window.scrollTo({
  //       top: 200,
  //       behaviour: "smooth",
  //     });
  //   };

  // const transcribe = async (e) => {

  // }



  

  const onsubmit = async (e) => {
    e.preventDefault();

    while (link.length > 0) {
      link.pop();
    }

    if (usermsg.length > 0) {
      setIsTyping(true);
      const msgg = usermsg.trim();
      setusermsg("");
      setIsTyping(true);

      let msgs = chats;
      msgs.push({ role: "user", content: msgg });
      setChats(msgs);
      setusermsg("");

      const url = "http://localhost:5000/api/search_streaming";

      const options = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user_id: "28062023Ass",
          customer_message: { usermsg },
          stream: true,
        }),
      };

      try {
        const response = await fetch(url, options);
        console.log(response);
        setIsTyping(false);

        const reader = response.body.getReader();
        const decoder = new TextDecoder("utf-8");

        msgs.push({ role: "AI", content: "" });
        while (true) {
          const { done, value } = await reader.read();
          if (done) {
            break;
          }

          const chunk = decoder.decode(value);
          const lines = chunk.split("\n");

          let parsedLines = [];
          lines.forEach((line) => {
            parsedLines.push(line);
          });
          setIsTyping(false);
          for (const parsedLine of parsedLines) {
            let str = parsedLine;
            console.log(str.indexOf("data:"));
            if (str.indexOf("data:") >= 0) {
              msgs[msgs.length - 1].content += str.substring(
                0,
                str.indexOf("data:")
              );
              // links.push(str.substring(str.indexOf("data:",str.length)));
              for (let j = 0; j < 6; j++) {
                const linkk = str
                  .substring(
                    str.indexOf(`${j}: '`),
                    str.indexOf(`', ${j + 1}:`)
                  )
                  .replace(`${j}: '`, "");
                linkkk.push(linkk );
                setlink((prevLinks) => [...prevLinks, linkk]);
              }
              return "";
            }
            msgs[msgs.length - 1].content += str;
            setChats(() => {
              return [...msgs];
            });
          }
        }
        setusermsg("");
      } catch {
        setIsTyping(false);
        console.log("Api not working");
      }
    }
  };
  return (
    <div className="search">
      <div className="heading">Search</div>

      <div className="boxes">
        <div className="chat box">
          <div className="chatbox">

            {chats && chats.length
              ? chats.map((chat, index) => {
                  const texts = chat.content.split("\n");
                  return (
                    <div key={index} className="msg">
                      <span>
                        <b>{chat.role.toUpperCase()}</b>
                      </span>
                      <span> : </span>
                      {texts.map((item, index) => {
                        if (
                          item &&
                          index === texts.length - 2 &&
                          !texts[index + 1]
                        ) {
                          return (
                            <span key={index}>
                              <span>{item}</span>
                            </span>
                          );
                        } else if (item) {
                          if (index !== texts.length - 1) {
                            return (
                              <span key={index}>
                                <span>{item}</span>
                                <br />
                                <br />
                              </span>
                            );
                          } else {
                            return (
                              <span key={index}>
                                <span>{item}</span>
                              </span>
                            );
                          }
                        }
                      })}
                    </div>
                  );
                })
              : ""}
            {isTyping ? <div className={`msg recived`}>AI : Typing</div> : ""}
          </div>

          <form className="input">
            <input
              type="text"
              className="inputt"
              onChange={handleonchange}
              value={usermsg}
              placeholder="Ask me anything..."
            />
            <div className="iconn" onClick={onsubmit}>
              {" "}
              <button className="btn">
                {" "}
                <SendIcon className="icon" />
              </button>
            </div>
          </form>
        </div>

        <div className="links box">
          <h3 className="h3">Related Links</h3>

          {link.map((l, i, k, j) => {
            return link ? (
              <div className="link" key={i}>
                <a
                  href={l}
                  key={j}
                  className="a"
                  rel="noreferrer"
                  target="_blank"
                >
                {l}
                </a>
                {i < 6 ? <hr key={k} className="hr" /> : ""}
              </div>
            ) : (
              ""
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default Search;
































