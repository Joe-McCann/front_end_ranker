"use client";

import { useState, useContext, useEffect } from "react";
import { UserContext } from "./UserContext";
import "./HomePage.css";
import { calcELOUpdates, getTwoRandomItems } from "./EloChoiceFunctions";

export default function HomePage() {
  const fruit_image = "https://images.stockcake.com/public/b/e/5/be5f0314-97d7-4849-88b9-dd21dd2c98e6_medium/colorful-fruit-assortment-stockcake.jpg";
  const { username, account_info, setLists } = useContext(UserContext);
  const [selectedList, setSelectedList] = useState(null);
  const [newList, setNewList] =useState(null);
  const [matchList, setMatchList] = useState(null);
  const [selectedListName, setSelectedListName] = useState(null);
  const [newItem, setNewItem] = useState({ name: "", tags: "", elo: 1000, imagePath: fruit_image });

  // Function to handle adding a new item
  const addItemToList = () => {
    if (newItem.name.trim() === "") {
      alert("Item name cannot be empty.");
      return;
    }
    const updatedItems = [...selectedList.items, newItem];
    const updatedLists = {...account_info.lists, [selectedListName]:{ imagePath: selectedList.imagePath, 
      description:selectedList.description, items:updatedItems }}
    setLists((prevLists) => ({
      ...prevLists, // Preserve existing lists
      lists: updatedLists, // Add new list
    }));
    setSelectedList((prev) => ({ ...prev, items: updatedItems }));
    setNewItem({ name: "", tags: "", elo: 1000, imagePath: fruit_image }); // Reset the form
  }

  const createNewList = () => {
    if (newList.trim() === "") {
      alert("List Name cannot be empty.");
      return;
    }
    const description = "New List"
    const updatedItems = {...account_info.lists, [newList]: { description: description, items: [], imagePath: fruit_image}};
    setLists((prevLists) => ({
      ...prevLists, // Preserve existing lists
      lists: updatedItems, // Add new list
    }));
    if (username !== null){
      fetch(`http://127.0.0.1:8080/${username}/lists/${newList}`, {
        body : JSON.stringify({ imagePath: fruit_image, description : description, items: []}), 
        headers : { "Content-type": "application/json" },
        method : "PUT"
        })
    }
    setNewList("");
  };

  useEffect(() => {
    console.log("Updated lists:", account_info);
  }, [account_info]);



  const updateElo = (index) => {
    const winnerIndex = matchList[index]
    const loserIndex = matchList[index ? 0 : 1]
    const newELOs = calcELOUpdates(selectedList.items[winnerIndex].elo, selectedList.items[loserIndex].elo)
    var updatedItems = selectedList.items
    updatedItems[winnerIndex].elo = newELOs[0]
    updatedItems[loserIndex].elo = newELOs[1]
    updatedItems.sort((a, b) => b.elo - a.elo)
    setSelectedList((prev) => ({ ...prev, items:updatedItems }))
    setMatchList(getTwoRandomItems(selectedList.items))
  }

  return (
    <div className="container">
      {!selectedList && (
        <div className="search-bar-container">
          <input type="text" 
          onChange={(e) => setNewList(e.target.value)}
          placeholder="Add New List" 
          className="add-new-list-bar" />
          <button onClick={createNewList} className="add-button">+</button>
        </div>
      )}

      {!selectedList && (
        <div className="grid">
          {account_info &&
            Object.entries(account_info.lists).map(([listName, listData], index) => (
              <div
                key={index}
                className="card"
                onClick={() => {
                  listData.items.sort((a, b) => b.elo - a.elo)
                  setSelectedList(listData);
                  setSelectedListName(listName);
                  setMatchList(getTwoRandomItems(listData.items));
                }}
              >
                <img
                  src={(listData.imagePath !== null) ? listData.imagePath : fruit_image}
                  alt="Placeholder"
                />
                <div className="card-title">{listName}</div>
                <div className="card-description">{listData.description}</div>
              </div>
            ))}
        </div>
      )}

      {selectedList && (
        <div className="list-header">
          <div className="list-header-content">
            <h1 className="list-title">{selectedListName}</h1>
            <h3 className="list-description">{selectedList.description}</h3>
          </div>
          <button className="back-button" onClick={() => {
              if (username !== null){
                const abortCont = new AbortController();
                fetch(`http://127.0.0.1:8080/${username}/lists/${selectedListName}`, {
                  signal : abortCont.signal,
                  body : JSON.stringify({ imagePath: selectedList.imagePath, description : selectedList.description, items : selectedList.items}), 
                  headers : { "Content-type": "application/json" },
                  method : "PUT"
                  });
              }
              setSelectedList(null);
            }}>
            Back to Lists
          </button>
        </div>
      )}

      {selectedList && (
        <div className="page">
          <div className="left-column">
            <div className="match-list">
              {matchList.map((itemIndex, index) => (
                <div
                  key={index}
                  className="match-card"
                  onClick={() => updateElo(index)}
                >
                  <img
                    src={(selectedList.items[itemIndex].imagePath !== null) ? selectedList.items[itemIndex].imagePath : fruit_image}
                    alt="Placeholder"
                  />
                  <div className="match-card-content">
                    <div className="card-title">{selectedList.items[itemIndex].name}</div>
                    <div className="card-description">{selectedList.items[itemIndex].elo}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="right-column">
            <table className="table">
              <thead>
                <tr>
                <th className="table-header">Rank</th>
                  <th className="table-header">Name</th>
                  <th className="table-header">Tags</th>
                  <th className="table-header">Elo</th>
                </tr>
              </thead>
              <tbody>
                {selectedList.items.map((item, index) => (
                  <tr key={index}>
                    <td className="table-cell">{index + 1}</td>
                    <td className="table-cell">{item.name}</td>
                    <td className="table-cell">{item.tags.join(", ")}</td>
                    <td className="table-cell">{item.elo}</td>
                  </tr>
                ))}
                </tbody>
                     {/* Row for Adding a New Item */}
                <tfoot>
                  <tr>
                  <td className="table-cell">
                      Add:
                    </td>
                    <td className="table-cell">
                      <input
                        type="text"
                        placeholder="Name"
                        value={newItem.name}
                        onChange={(e) => setNewItem((prev) => ({ ...prev, name: e.target.value }))}
                        className="input"
                      />
                    </td>
                    <td className="table-cell">
                      <input
                        type="text"
                        placeholder="Tags"
                        value={newItem.tags}
                        onChange={(e) => setNewItem((prev) => ({ ...prev, tags: e.target.value.split(",").map((tag) => tag.trim())}))}
                        className="input"
                      />
                    </td>
                    <td className="table-cell">
                      <button onClick={addItemToList} className="add-button">+</button>
                    </td>
                  </tr>
                </tfoot>
              
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
